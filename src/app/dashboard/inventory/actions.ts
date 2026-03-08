'use server'

import { createClient } from '@/utils/supabase/server'
import { addMinutes, parse } from 'date-fns'

export async function generateInventory(formData: FormData) {
  const supabase = await createClient()
  
  // Note: in a real app we'd get course_id from the user's profile
  // For MVP, we'll try to find a default course or let it fail if RLS blocks it
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { error: 'Not authenticated' }
  }

  // Get first course for user
  const { data: courses } = await supabase.from('courses').select('id').eq('user_id', userData.user.id).limit(1)
  
  if (!courses || courses.length === 0) {
    return { error: 'No course found for user. Please set up a course first.' }
  }
  
  const courseId = courses[0].id

  const dateStr = formData.get('date') as string
  const startTimeStr = formData.get('startTime') as string
  const endTimeStr = formData.get('endTime') as string
  const intervalStr = formData.get('interval') as string
  const basePriceStr = formData.get('basePrice') as string

  if (!dateStr || !startTimeStr || !endTimeStr || !intervalStr || !basePriceStr) {
    return { error: 'Missing required fields' }
  }

  const interval = parseInt(intervalStr, 10)
  const basePrice = parseFloat(basePriceStr)

  const startDateTime = parse(`${dateStr} ${startTimeStr}`, 'yyyy-MM-dd HH:mm', new Date())
  const endDateTime = parse(`${dateStr} ${endTimeStr}`, 'yyyy-MM-dd HH:mm', new Date())

  let current = startDateTime
  const teeTimes = []

  while (current <= endDateTime) {
    teeTimes.push({
      course_id: courseId,
      time: current.toISOString(),
      base_price: basePrice,
      current_price: basePrice,
      status: 'available'
    })
    current = addMinutes(current, interval)
  }

  const { error } = await supabase.from('tee_times').insert(teeTimes)

  if (error) {
    return { error: error.message }
  }

  return { success: true, count: teeTimes.length }
}
