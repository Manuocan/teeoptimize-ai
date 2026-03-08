'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PricingRulesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Pricing Rules</h1>
        <Button>+ Add New Rule</Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Weather Optimization</CardTitle>
                <CardDescription>Adjust prices based on 7-day weather forecast</CardDescription>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Increase price by <strong>15%</strong> when forecast is Sunny and 70°F+</li>
              <li>Decrease price by <strong>20%</strong> when forecast indicates Rain &gt; 50%</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Last-Minute Utilization</CardTitle>
                <CardDescription>Liquidate unsold inventory before it expires</CardDescription>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Decrease price by <strong>10%</strong> if unbooked 48 hours before tee time</li>
              <li>Decrease price by <strong>25%</strong> if unbooked 24 hours before tee time</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>High Demand Surge</CardTitle>
                <CardDescription>Increase prices on rapidly filling days</CardDescription>
              </div>
              <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded">Inactive</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 opacity-60">
              <li>Increase remaining tee times by <strong>10%</strong> when day reaches 80% utilization</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
