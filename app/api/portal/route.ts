import { auth, currentUser } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any,
})

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const stripeCustomerId = user?.publicMetadata?.stripeCustomerId as string | undefined

  if (!stripeCustomerId) {
    return Response.json({ error: 'No subscription found' }, { status: 404 })
  }

  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://momentumcap.io'}/dashboard`

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  })

  return Response.json({ url: session.url })
}
