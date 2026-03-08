import { createClient } from '@/utils/supabase/server'
import BookingWidget from './BookingWidget'

export default async function BookingPage({ params }: { params: Promise<{ courseId: string }> }) {
  const supabase = await createClient()
  const { courseId } = await params

  let courseName = "Sample Golf Club"
  let teeTimes = []

  if (courseId !== 'sample-course') {
    const { data: course } = await supabase.from('courses').select('name').eq('id', courseId).single()
    if (course) courseName = course.name

    const now = new Date()
    const future = new Date(now)
    future.setDate(future.getDate() + 3)

    const { data: times } = await supabase
      .from('tee_times')
      .select('*')
      .eq('course_id', courseId)
      .eq('status', 'available')
      .gte('time', now.toISOString())
      .lte('time', future.toISOString())
      .order('time', { ascending: true })

    if (times) teeTimes = times
  } else {
    // Generate mock tee times for the sample course
    const now = new Date()
    // Start from tomorrow morning for predictability
    now.setDate(now.getDate() + 1)
    now.setHours(8, 0, 0, 0)
    
    for (let i = 0; i < 10; i++) {
      const time = new Date(now)
      time.setMinutes(time.getMinutes() + (i * 10))
      
      const basePrice = 50
      let currentPrice = basePrice
      
      // Simulate dynamic pricing
      if (i === 2 || i === 3) currentPrice = 65 // high demand
      if (i > 7) currentPrice = 35 // last minute discount

      teeTimes.push({
        id: `mock-${i}`,
        time: time.toISOString(),
        base_price: basePrice,
        current_price: currentPrice
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
        <div className="p-6 bg-slate-900 text-white">
          <h2 className="text-2xl font-bold">{courseName}</h2>
          <p className="text-slate-300 text-sm mt-1">Select a Tee Time</p>
        </div>
        <div className="p-6">
          <BookingWidget initialTeeTimes={teeTimes} courseId={courseId} />
        </div>
      </div>
    </div>
  )
}
