import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Create a Stripe Express Account
    const account = await stripe.accounts.create({
      type: 'express',
    })

    // 2. Save account.id to Supabase course
    const { data: courses } = await supabase.from('courses').select('id').eq('user_id', userData.user.id).limit(1)
    if (courses && courses.length > 0) {
      await supabase.from('courses').update({ stripe_account_id: account.id }).eq('id', courses[0].id)
    }

    // 3. Create an account link for onboarding
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/dashboard/settings?stripe_refresh=true`,
      return_url: `${origin}/dashboard/settings?stripe_return=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
