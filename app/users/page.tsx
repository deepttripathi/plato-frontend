"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UsersTable } from "@/components/users-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <DashboardShell>
      <DashboardHeader heading="Users" description="Manage users and their access">
        {user?.assumeRole === "admin" && (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DashboardHeader>

      <div className="flex items-center justify-between mb-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="team" className="w-full">
        <TabsList className={`grid w-full max-w-md ${user?.assumeRole === "admin" ? "grid-cols-3" : "grid-cols-2"}`}>
          <TabsTrigger value="team">My Team</TabsTrigger>
          <TabsTrigger value="admins">Admin</TabsTrigger>
          {user?.assumeRole === "admin" && <TabsTrigger value="all">All Users</TabsTrigger>}
        </TabsList>

        <TabsContent value="team" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>My Team</CardTitle>
              <CardDescription>Users in your team</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable filter="team" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrators</CardTitle>
              <CardDescription>Users with administrative privileges</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable filter="admin" searchQuery={searchQuery} />
            </CardContent>
          </Card>
        </TabsContent>

        {user?.assumeRole === "admin" && 
          <TabsContent value="all" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Complete list of all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable filter="all" searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>
        }

      </Tabs>
    </DashboardShell>
  )
}
