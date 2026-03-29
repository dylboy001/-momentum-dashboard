import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  premium: process.env.STRIPE_PREMIUM_PRICE_ID!,
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: 'pro' | 'premium' }
  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    return Response.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: email,
    client_reference_id: userId,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://momentumcap.io'}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://momentumcap.io'}/pricing`,
    subscription_data: {
      metadata: { clerkUserId: userId },
    },
  })

  return Response.json({ url: session.url })
}
