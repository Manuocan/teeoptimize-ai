import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  // We use the service role key to bypass RLS for this background job
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key'
  )

  try {
    // 1. Fetch courses
    const { data: courses } = await supabase.from('courses').select('id')
    if (!courses) return NextResponse.json({ message: 'No courses found' })

    let updatedCount = 0

    for (const course of courses) {
      const { data: rules } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('course_id', course.id)
        .eq('is_active', true)

      // 2. Fetch future available tee times for next 7 days
      const now = new Date()
      const nextWeek = new Date(now)
      nextWeek.setDate(now.getDate() + 7)

      const { data: teeTimes } = await supabase
        .from('tee_times')
        .select('*')
        .eq('course_id', course.id)
        .eq('status', 'available')
        .gte('time', now.toISOString())
        .lte('time', nextWeek.toISOString())

      if (!teeTimes || teeTimes.length === 0) continue

      // 3. Evaluate prices based on rules
      for (const tt of teeTimes) {
        let newPrice = Number(tt.base_price)

        if (rules && rules.length > 0) {
          for (const rule of rules) {
            // Weather Rule Logic (Mocked AI Forecast)
            if (rule.rule_type === 'weather') {
              const ttDate = new Date(tt.time)
              const diffDays = Math.floor((ttDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              
              // Mock: assume perfect weather next 3 days, rainy after
              if (diffDays <= 3 && rule.parameters.sunny_multiplier) {
                newPrice *= rule.parameters.sunny_multiplier
              } else if (diffDays > 3 && rule.parameters.rainy_multiplier) {
                newPrice *= rule.parameters.rainy_multiplier
              }
            }

            // Utilization / Last Minute Rule Logic
            if (rule.rule_type === 'utilization') {
              const hoursUntilTeeTime = (new Date(tt.time).getTime() - now.getTime()) / (1000 * 60 * 60)
              if (hoursUntilTeeTime < 48 && rule.parameters.last_minute_discount) {
                newPrice *= rule.parameters.last_minute_discount
              }
            }
          }
        }

        // Apply new price with boundaries (e.g. minimum $10 floor)
        newPrice = Math.max(10, Math.round(newPrice * 100) / 100)

        if (newPrice !== Number(tt.current_price)) {
          await supabase.from('tee_times').update({ current_price: newPrice }).eq('id', tt.id)
          updatedCount++
        }
      }
    }

    return NextResponse.json({ message: 'Pricing updated successfully', updatedCount })
  } catch (error) {
    console.error('Pricing engine error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
