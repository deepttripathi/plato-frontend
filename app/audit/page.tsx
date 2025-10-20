import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AuditTable } from "@/components/audit-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuditPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Audit Log" description="Track all system activities and changes" />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="users">User Changes</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>All Activities</CardTitle>
              <CardDescription>Complete audit log of all system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTable filter="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>User Changes</CardTitle>
              <CardDescription>Audit log of user-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTable filter="users" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Changes</CardTitle>
              <CardDescription>Audit log of automation-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTable filter="automations" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>System Changes</CardTitle>
              <CardDescription>Audit log of system-level activities</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTable filter="system" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
