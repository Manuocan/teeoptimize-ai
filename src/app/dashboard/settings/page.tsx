'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)

  const handleConnectStripe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/onboard', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to connect Stripe')
      }
    } catch (err) {
      alert('Error connecting Stripe')
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Settings</h1>
      
      <Card className="max-w-2xl mb-6">
        <CardHeader>
          <CardTitle>Payments (Stripe Connect)</CardTitle>
          <CardDescription>Connect your bank account to receive payouts for tee times sold via TeeOptimize AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-600">We take a small 5% optimization fee on transactions. The rest is routed directly to your connected bank account.</p>
          <Button onClick={handleConnectStripe} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Bank Account (Stripe)'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
