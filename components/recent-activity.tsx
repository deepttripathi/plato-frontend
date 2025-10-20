"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { historyEntries } from "@/lib/data"
import { useAuth } from "@/components/auth-provider"

export function RecentActivity() {
  const { user } = useAuth()

  // Filter entries based on assumed role and team, then get 5 most recent
  const recentEntries = [...historyEntries]
    .filter(entry => {
      if (user?.assumeRole === "user") {
        return entry.team === user.team
      }
      return true
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {recentEntries.map((entry) => (
        <div key={entry.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={entry.userAvatar || "/placeholder.svg"} alt={entry.user} />
            <AvatarFallback>{entry.user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{entry.user}</p>
            <p className="text-sm text-muted-foreground">
              Ran <span className="font-medium text-primary">{entry.automationName}</span>
            </p>
            <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
          </div>
          <div className="ml-auto">
            <div
              className={`px-2 py-1 text-xs rounded-md ${
                entry.status === "success"
                  ? "bg-green-100 text-green-800"
                  : entry.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {entry.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
