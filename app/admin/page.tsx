"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalsList } from "@/components/proposals-list"
import { TeamManagement } from "@/components/team-management"
import { SystemSettings } from "@/components/system-settings"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { AutomationApprovals } from "@/components/automation-approvals"
import { useAuth } from "@/components/auth-provider"

export default function AdminPage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      redirect("/")
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Dashboard" description="Manage platform settings and configurations" />

      <Tabs defaultValue="submitted-automations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="submitted-automations">Approvals</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="submitted-automations" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Automations waiting for approval</CardTitle>
              <CardDescription>Approve or decline automations</CardDescription>
            </CardHeader>
            <CardContent>
              <AutomationApprovals />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Proposals</CardTitle>
              <CardDescription>Review and manage automation proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <ProposalsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Proposals</CardTitle>
              <CardDescription>Review and manage automation proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <ProposalsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage teams and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
