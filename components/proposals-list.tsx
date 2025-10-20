"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Clock, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"
import { proposals } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export function ProposalsList() {
  const { toast } = useToast()
  const [activeProposals, setActiveProposals] = useState(proposals)

  const handleApprove = (id: string) => {
    setActiveProposals(
      activeProposals.map((proposal) => (proposal.id === id ? { ...proposal, status: "approved" } : proposal)),
    )

    toast({
      title: "Proposal approved",
      description: "The proposal has been approved and will be implemented.",
    })
  }

  const handleReject = (id: string) => {
    setActiveProposals(
      activeProposals.map((proposal) => (proposal.id === id ? { ...proposal, status: "rejected" } : proposal)),
    )

    toast({
      title: "Proposal rejected",
      description: "The proposal has been rejected.",
    })
  }

  const pendingProposals = activeProposals.filter((p) => p.status === "pending")
  const approvedProposals = activeProposals.filter((p) => p.status === "approved")
  const rejectedProposals = activeProposals.filter((p) => p.status === "rejected")

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="pending">Pending ({pendingProposals.length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({approvedProposals.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({rejectedProposals.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4 py-4">
        {pendingProposals.length > 0 ? (
          pendingProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col items-start justify-start gap-2 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
                  <CardTitle>{proposal.title}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                </div>
                <CardDescription>
                  Proposed by {proposal.proposedBy} on {new Date(proposal.proposedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{proposal.description}</p>

                <div className="mt-4">
                  <h4 className="text-sm font-medium">Proposed Benefits:</h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {proposal.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {proposal.teams && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Requested Access:</h4>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proposal.teams.map((team) => (
                        <span
                          key={team}
                          className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                        >
                          {team}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex pt-2 flex-col justify-start items-start gap-2 lg:flex-row lg:justify-between lg:items-center ">
                <Button variant="outline" size="sm" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Comment
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-500 hover:text-red-600"
                    onClick={() => handleReject(proposal.id)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button size="sm" className="gap-1" onClick={() => handleApprove(proposal.id)}>
                    <ThumbsUp className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-2 text-lg font-semibold">No pending proposals</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">There are no proposals waiting for your review</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved" className="space-y-4 py-4">
        {approvedProposals.length > 0 ? (
          approvedProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle>{proposal.title}</CardTitle>
                  <Badge variant="default" className="bg-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Approved
                  </Badge>
                </div>
                <CardDescription>
                  Proposed by {proposal.proposedBy} on {new Date(proposal.proposedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{proposal.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-2 text-lg font-semibold">No approved proposals</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">There are no approved proposals yet</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4 py-4">
        {rejectedProposals.length > 0 ? (
          rejectedProposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle>{proposal.title}</CardTitle>
                  <Badge variant="outline" className="text-red-500 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Rejected
                  </Badge>
                </div>
                <CardDescription>
                  Proposed by {proposal.proposedBy} on {new Date(proposal.proposedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{proposal.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mt-2 text-lg font-semibold">No rejected proposals</h3>
            <p className="mb-4 mt-1 text-sm text-muted-foreground">There are no rejected proposals</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
