import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue (Today)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$2,450.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Yield Gained</CardTitle>
            <CardDescription>Extra revenue from dynamic pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">+$320.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
            <CardDescription>Percentage of tee times booked</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">84%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Golfer</TableHead>
                <TableHead>Tee Time</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Paid Price</TableHead>
                <TableHead>AI Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">John Doe</TableCell>
                <TableCell>Today, 8:00 AM</TableCell>
                <TableCell>$50.00</TableCell>
                <TableCell>$65.00</TableCell>
                <TableCell className="text-green-600">+$15.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jane Smith</TableCell>
                <TableCell>Today, 8:10 AM</TableCell>
                <TableCell>$50.00</TableCell>
                <TableCell>$65.00</TableCell>
                <TableCell className="text-green-600">+$15.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mike Johnson</TableCell>
                <TableCell>Tomorrow, 2:00 PM</TableCell>
                <TableCell>$40.00</TableCell>
                <TableCell>$35.00</TableCell>
                <TableCell className="text-red-600">-$5.00 (Liquidated)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
