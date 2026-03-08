import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 text-center">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight">TeeOptimize AI</h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-8">
        Dynamic yield management and predictive pricing for golf courses. Maximize revenue with AI-driven tee time adjustments based on weather, utilization, and demand.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg" className="text-lg">Go to Dashboard</Button>
        </Link>
        <Link href="/book/sample-course">
          <Button variant="outline" size="lg" className="text-lg">View Sample Booking Widget</Button>
        </Link>
      </div>
    </div>
  );
}
