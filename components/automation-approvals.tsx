"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "./auth-provider"

const SERVER_URL = "http://" + process.env.NEXT_PUBLIC_SERVER

export function AutomationApprovals() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: pendingAutomations, isLoading } = useQuery({
    queryKey: ['pending-automations'],
    queryFn: async () => {
      const response = await fetch(`${SERVER_URL}/tasks/waiting-for-approvals`)
      if (!response.ok) {
        throw new Error('Failed to fetch pending automations')
      }
      return response.json()
    }
  })

  const approveMutation = useMutation({
    mutationFn: async (automationId: string) => {
      if (!user) {
        throw new Error("You are not authorized to perform this action")
      }
      const response = await fetch(`${SERVER_URL}/task/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: automationId, author: user.name }),
      })
      if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to approve automation')
      }
      return response.json()
    },
    onSuccess: (data: { task_id: number }) => {
      toast({
        title: "Automation task approved",
        description: `Automation task ID ${data.task_id} is approved.`,
      })

      queryClient.invalidateQueries({ queryKey: ['pending-automations'] })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit automation: " + error.message,
        variant: "destructive",
      })
    }
  })

  const declineMutation = useMutation({
    mutationFn: async (automationId: string) => {
      if (!user) {
        throw new Error("You are not authorized to perform this action")
      }
      const response = await fetch(`${SERVER_URL}/task/decline`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_id: automationId, author: user.name }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to decline automation')
      }
      return response.json()
    },
    onSuccess: (data: { task_id: number }) => {
      toast({
        title: "Automation task declined",
        description: `Automation task ID ${data.task_id} is declined.`,
      })

      queryClient.invalidateQueries({ queryKey: ['pending-automations'] })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to decline automation: " + error.message,
        variant: "destructive",
      })
    }
  })

  const handleAction = (automationId: string, approved: boolean) => {
    if (approved) {
      approveMutation.mutate(automationId)
    } else {
      declineMutation.mutate(automationId)
    }
  }

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading...</p>
  }

  if (!pendingAutomations?.length) {
    return <p className="text-center text-muted-foreground">No pending approvals</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingAutomations.map((automation) => {
            return (
            <TableRow key={automation.ID}>
              <TableCell className="font-medium">{automation.type}</TableCell>
              <TableCell>{automation.requested_by}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleAction(automation.ID, true)}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(automation.ID, false)}
                    variant="destructive"
                    size="sm"
                  >
                    Decline
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  )
}
