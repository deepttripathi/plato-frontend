import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { HistoryTable } from "@/components/history-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HistoryPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Execution History" description="View the history of automation runs" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>All Executions</CardTitle>
              <CardDescription>Complete history of automation executions</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryTable filter="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Successful Executions</CardTitle>
              <CardDescription>History of successful automation executions</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryTable filter="success" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Executions</CardTitle>
              <CardDescription>History of failed automation executions</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryTable filter="failed" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="running" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Running Executions</CardTitle>
              <CardDescription>Currently running automation executions</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoryTable filter="running" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
