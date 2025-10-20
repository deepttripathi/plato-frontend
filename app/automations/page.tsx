import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AutomationsList } from "@/components/automations-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function AutomationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Automations" description="Browse and run available automations">
        <Button className="hidden md:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Request New Automation
        </Button>
      </DashboardHeader>
      <AutomationsList />
    </DashboardShell>
  )
}
