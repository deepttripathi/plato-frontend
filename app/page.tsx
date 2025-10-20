'use client'

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import { TeamStats } from "@/components/team-stats"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
	const { user, isLoading } = useAuth()
	const router = useRouter()
	
	if (isLoading) {
	  return <></>
	}
	
	if (!user && !isLoading) {
	  router.push('/auth')
	  return null
	}

  return (
    <DashboardShell>
      <DashboardHeader heading="Overview" description="Welcome to Platform Automation" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Automations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automations Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">10</div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users in Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-xs text-muted-foreground">+1 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">98.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 w-full">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Automation Usage</CardTitle>
            <CardDescription>Number of automations executed over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest automation runs across teams</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Team Statistics</CardTitle>
            <CardDescription>Automation usage by team</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <TeamStats />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Popular Automations</CardTitle>
            <CardDescription>Most frequently used automations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">ELK Data View Creation</p>
                  <p className="text-sm text-muted-foreground">Used 87 times this month</p>
                </div>
                <div className="ml-auto font-medium">+34%</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Database Backup</p>
                  <p className="text-sm text-muted-foreground">Used 52 times this month</p>
                </div>
                <div className="ml-auto font-medium">+12%</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Log Analysis</p>
                  <p className="text-sm text-muted-foreground">Used 45 times this month</p>
                </div>
                <div className="ml-auto font-medium">+21%</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Server Provisioning</p>
                  <p className="text-sm text-muted-foreground">Used 39 times this month</p>
                </div>
                <div className="ml-auto font-medium">+17%</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">API Key Rotation</p>
                  <p className="text-sm text-muted-foreground">Used 22 times this month</p>
                </div>
                <div className="ml-auto font-medium">+5%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
