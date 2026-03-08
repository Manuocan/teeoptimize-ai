import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { teeTimeId, courseId } = body
    
    // We use service role to read course details
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
    )

    let price = 50
    let stripeAccountId = null
    let name = 'Sample Golf Club'
    let timeDesc = new Date().toLocaleString()

    if (courseId !== 'sample-course') {
      const { data: teeTime } = await supabase.from('tee_times').select('*, courses(stripe_account_id, name)').eq('id', teeTimeId).single()
      
      if (!teeTime) return NextResponse.json({ error: 'Tee time not found' }, { status: 404 })

      stripeAccountId = teeTime.courses?.stripe_account_id
      if (!stripeAccountId) {
        return NextResponse.json({ error: 'Course is not connected to Stripe' }, { status: 400 })
      }
      
      price = Number(teeTime.current_price)
      name = teeTime.courses?.name || name
      timeDesc = new Date(teeTime.time).toLocaleString()
    } else {
      // Mock for sample course
      // Let's assume price was passed or we just mock a 50$ charge
      price = 50
    }

    const platformFee = Number((price * 0.05).toFixed(2)) // 5% SaaS fee
    const amountInCents = Math.round(price * 100)

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Tee Time at ${name}`,
              description: timeDesc,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/book/${courseId}?success=true`,
      cancel_url: `${origin}/book/${courseId}?canceled=true`,
    }

    if (stripeAccountId) {
      sessionConfig.payment_intent_data = {
        application_fee_amount: Math.round(platformFee * 100),
        transfer_data: {
          destination: stripeAccountId,
        },
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
