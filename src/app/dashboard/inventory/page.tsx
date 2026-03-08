'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateInventory } from './actions'

export default function InventoryPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const formData = new FormData(e.currentTarget)
    const result = await generateInventory(formData)
    
    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else {
      setMessage(`Success! Generated ${result.count} tee times.`)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Generate Tee Times</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" name="date" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input type="time" id="startTime" name="startTime" defaultValue="07:00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input type="time" id="endTime" name="endTime" defaultValue="17:00" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interval">Interval (minutes)</Label>
                <Select name="interval" defaultValue="10">
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="12">12 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price ($)</Label>
                <Input type="number" id="basePrice" name="basePrice" defaultValue="50" min="0" step="0.01" required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Inventory'}
            </Button>
            
            {message && (
              <div className={`p-4 rounded ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
