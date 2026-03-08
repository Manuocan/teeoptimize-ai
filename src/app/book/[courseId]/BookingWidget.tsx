'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"

export default function BookingWidget({ initialTeeTimes, courseId }: { initialTeeTimes: any[], courseId: string }) {
  const [selectedTime, setSelectedTime] = useState<any | null>(null)

  if (initialTeeTimes.length === 0) {
    return <div className="text-center text-slate-500 py-8">No tee times available.</div>
  }

  if (selectedTime) {
    return (
      <div className="space-y-4">
        <div className="bg-slate-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg">{format(new Date(selectedTime.time), 'EEEE, MMMM do')}</h3>
          <p className="text-slate-600">{format(new Date(selectedTime.time), 'h:mm a')}</p>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-slate-600">Green Fee</span>
          <span className="font-bold">${selectedTime.current_price}</span>
        </div>
        
        {selectedTime.current_price < selectedTime.base_price && (
          <div className="flex justify-between items-center py-2 text-green-600 text-sm">
            <span>Dynamic Discount</span>
            <span>-${(selectedTime.base_price - selectedTime.current_price).toFixed(2)}</span>
          </div>
        )}
        
        {selectedTime.current_price > selectedTime.base_price && (
          <div className="flex justify-between items-center py-2 text-orange-600 text-sm">
            <span>High Demand Premium</span>
            <span>+${(selectedTime.current_price - selectedTime.base_price).toFixed(2)}</span>
          </div>
        )}

        <Button 
          className="w-full mt-4" 
          size="lg" 
          onClick={async () => {
            try {
              const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teeTimeId: selectedTime.id, courseId })
              })
              const data = await res.json()
              if (data.url) {
                window.location.href = data.url
              } else {
                alert(data.error || 'Checkout failed')
              }
            } catch (err) {
              alert('Error initiating checkout')
            }
          }}
        >
          Checkout (${selectedTime.current_price})
        </Button>
        
        <Button variant="ghost" className="w-full" onClick={() => setSelectedTime(null)}>
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {initialTeeTimes.map((tt) => (
        <button
          key={tt.id}
          onClick={() => setSelectedTime(tt)}
          className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
            tt.current_price < tt.base_price 
              ? 'border-green-200 bg-green-50 hover:bg-green-100' 
              : tt.current_price > tt.base_price 
                ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' 
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span className="font-bold">{format(new Date(tt.time), 'h:mm a')}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-bold">${tt.current_price}</span>
            {tt.current_price !== tt.base_price && (
              <span className="text-xs line-through text-slate-400">${tt.base_price}</span>
            )}
          </div>
          {tt.current_price < tt.base_price && (
            <span className="text-[10px] text-green-600 font-semibold mt-1">Save {(100 - (tt.current_price/tt.base_price)*100).toFixed(0)}%</span>
          )}
          {tt.current_price > tt.base_price && (
            <span className="text-[10px] text-orange-600 font-semibold mt-1">🔥 Hot Time</span>
          )}
        </button>
      ))}
    </div>
  )
}
