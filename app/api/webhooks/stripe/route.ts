import { clerkClient } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any,
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  const clerk = await clerkClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      if (!userId) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0]?.price.id
      const tier = priceId === process.env.STRIPE_PREMIUM_PRICE_ID ? 'premium' : 'pro'

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          tier,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.clerkUserId
      if (!userId) break

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          tier: 'free',
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
      })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.clerkUserId
      if (!userId) break

      const priceId = subscription.items.data[0]?.price.id
      const tier = priceId === process.env.STRIPE_PREMIUM_PRICE_ID ? 'premium' : 'pro'

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          tier,
          stripeSubscriptionId: subscription.id,
        },
      })
      break
    }
  }

  return new Response('OK', { status: 200 })
}
