"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Play, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { automations } from "@/lib/data"
import { useAuth } from "./auth-provider"

export function AutomationsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  const filteredAutomations = automations.filter((automation) => {
    // Filter by search query
    const matchesSearch =
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by team access if not admin
    const hasAccess = user?.role === "admin" || (automation.teams && automation.teams.includes(user?.team || ""))

    return matchesSearch && hasAccess
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search automations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredAutomations.map((automation) => (
          <Card key={automation.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle>{automation.name}</CardTitle>
                {/*<Badge variant={automation.category === "data" ? "default" : "outline"}>{automation.category}</Badge>*/}
              </div>
              <CardDescription>{automation.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>Last run: {automation.lastRun || "Never"}</span>
              </div>

              {automation.lastStatus && (
                <div className="mt-2 flex items-center text-sm">
                  {automation.lastStatus === "success" ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-green-500">Last run successful</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-red-500">Last run failed</span>
                    </>
                  )}
                </div>
              )}

              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {automation.teams?.map((team) => (
                    <span
                      key={team}
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild className="w-full">
                <Link href={`/automations/${automation.id}`}>
                  <Play className="mr-2 h-4 w-4" />
                  Run Automation
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredAutomations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mt-2 text-lg font-semibold">No automations found</h3>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            {searchQuery ? "Try a different search term" : "No automations are available for your team"}
          </p>
        </div>
      )}
    </div>
  )
}
