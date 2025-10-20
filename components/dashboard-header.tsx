import type React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface DashboardHeaderProps {
  heading: string
  description?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, description, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4 w-full">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}
