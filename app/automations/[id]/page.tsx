"use client"

import { useParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { automations } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { PlayCircle, History, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth, User } from "@/components/auth-provider"

async function getDataStreamSuggestions(pattern: string) {
  const server = process.env.NEXT_PUBLIC_SERVER
  const endpoint = `http://${server}/elk/data-streams?index-pattern=${pattern}`
  if (!pattern) return []
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json'
    },
  })
  if (!response.ok) throw new Error('Failed to fetch suggestions')
  return response.json()
}

async function getDataSources(pattern: string) {
  const server = process.env.NEXT_PUBLIC_SERVER
  const endpoint = `http://${server}/elk/data-streams?exact=true&index-pattern=${pattern}`
  if (!pattern) return []
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/json'
    },
  })
  if (!response.ok) throw new Error('Failed to fetch data sources')
  return response.json()
}

async function submitAutomation({ pattern, scheduledDate, user }: { pattern: string, scheduledDate?: Date, user: User | null }) {
  if (!user) {
    throw new Error("You need to log in to submit automation tasks")
  }
  const server = process.env.NEXT_PUBLIC_SERVER
  const response = await fetch(`http://${server}/task/elk-data-view`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scheduled_at: scheduledDate?.toISOString() || new Date().toISOString(),
      requested_by: user.name, // This should be replaced with actual user info
      parameters: {
        "index-pattern": pattern
      }
    })
  })

  if (!response.ok) {
    const jsonRes = await response.json()
    console.log(jsonRes.message)
    throw new Error(jsonRes.message)
  }

  return response.json()
}

export default function AutomationPage() {
  const { user } = useAuth()
  const params = useParams()
  const { toast } = useToast()
  const [optionChosen, setOptionChosen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pattern, setPattern] = useState("")
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [dataSources, setDataSources] = useState<string[]>([])
  const [scheduledDate, setScheduledDate] = useState<Date>()
  const debouncedPattern = useDebounce(pattern, 300)

  const { data: suggestions } = useQuery({
    queryKey: ['dataStreams', debouncedPattern],
    queryFn: () => getDataStreamSuggestions(debouncedPattern),
    enabled: debouncedPattern.length > 0,
  })

  // Show suggestions when we have results and input is focused
  useEffect(() => {
    if (optionChosen) return 
    if (suggestions && suggestions.length > 0) {
      setIsSuggestionsOpen(true)
    } else {
      setIsSuggestionsOpen(false)
    }
  }, [suggestions])

  useEffect(() => {
    console.log(scheduledDate)
  }, [scheduledDate])

  const automationId = typeof params.id === "string" ? params.id : ""
  const automation = automations.find((a) => a.id === automationId) || automations[0]
  const router = useRouter()

  const handleRun = async () => {
    if (automation.id === "elk-data-view") {
      try {
        const sources = await getDataSources(pattern)
        setDataSources(sources)
        setShowConfirmDialog(true)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data sources",
          variant: "destructive",
        })
      }
      return
    }
  }

  const mutation = useMutation({
    mutationFn: submitAutomation,
    onSuccess: () => {
      toast({
        title: "Automation submitted",
        description: `${automation.name} is now submitted. You can check the status in the history tab.`,
      })
      router.push('/')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit automation: " + error.message,
        variant: "destructive",
      })
    }
  })

  const handleSubmit = () => {
    setShowConfirmDialog(false)
    mutation.mutate({ pattern, scheduledDate, user })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={automation.name} description={automation.description}>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/automations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </DashboardHeader>

      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Parameters</CardTitle>
              <CardDescription>Configure the parameters for this automation run</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-time">Schedule Execution</Label>
                <div className="flex gap-2 w-fit">
                  <Input
                    type="datetime-local"
                    id="scheduled-time"
                    className="w-[250px]"
                    value={scheduledDate ? new Date(scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      setScheduledDate(new Date(e.target.value))}
                    }
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select when you want this automation to run. Leave empty for immediate execution.
                </p>
              </div>

              {automation.id === "elk-data-view" ? (
                <>
                  <div className="space-y-2">
                  <Label htmlFor="index-pattern">Index Pattern</Label>
                  <div className="relative">
                    <Input
                      id="index-pattern"
                      placeholder="Enter index pattern..."
                      value={pattern}
                      onChange={(e) => {
                        setPattern(e.target.value)
                        setOptionChosen(false)
                        setSelectedIndex(0)
                      }}
                      onKeyDown={(e) => {
                        if (!suggestions) return
                        
                        if (e.key === "ArrowDown") {
                          e.preventDefault()
                          setSelectedIndex((prev) => 
                            prev < suggestions.length - 1 ? prev + 1 : prev
                          )
                        }
                        
                        if (e.key === "ArrowUp") {
                          e.preventDefault()
                          setSelectedIndex((prev) => prev > 0 ? prev - 1 : 0)
                        }
                        
                        if (e.key === "Enter" && suggestions[selectedIndex]) {
                          setPattern(suggestions[selectedIndex])
                          setIsSuggestionsOpen(false)
                          setOptionChosen(true)
                        }
                      }}
                    />
                    {isSuggestionsOpen && suggestions && suggestions.length > 0 && (
                      <div className="absolute w-full mt-1 border rounded-md bg-background shadow-lg z-50">
                        <div className="py-1">
                          {suggestions.map((suggestion: string, index: number) => (
                            <div
                              key={suggestion}
                              className={cn(
                                "px-4 py-2 text-sm cursor-pointer hover:bg-muted",
                                selectedIndex === index && "bg-accent hover:bg-accent"
                              )}
                              onClick={() => {
                                setPattern(suggestion)
                                setIsSuggestionsOpen(false)
                                setOptionChosen(true)
                              }}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter an index pattern to search for data streams
                  </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {automation.parameters?.map((param, index) => (
                    <div key={index} className="space-y-2">
                      <Label htmlFor={`param-${index}`}>{param.name}</Label>
                      {param.type === "select" ? (
                        <Select defaultValue={param.default}>
                          <SelectTrigger id={`param-${index}`}>
                            <SelectValue placeholder={`Select ${param.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {param.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : param.type === "textarea" ? (
                        <Textarea id={`param-${index}`} placeholder={param.placeholder} defaultValue={param.default} />
                      ) : (
                        <Input
                          id={`param-${index}`}
                          placeholder={param.placeholder}
                          defaultValue={param.default}
                          type={param.type}
                        />
                      )}
                      {param.description && <p className="text-sm text-muted-foreground">{param.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleRun} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Automation"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Run History</CardTitle>
              <CardDescription>Previous executions of this automation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automation.history?.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{new Date(entry.timestamp).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Run by: {entry.user}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Details</CardTitle>
              <CardDescription>Technical information about this automation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Created By</h3>
                  <p className="text-sm text-muted-foreground">{automation.createdBy}</p>
                </div>
                <div>
                  <h3 className="font-medium">Created On</h3>
                  <p className="text-sm text-muted-foreground">{new Date(automation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm text-muted-foreground mt-1">{automation.description}</p>
              </div>

              <div>
                <h3 className="font-medium">Technical Details</h3>
                <p className="text-sm text-muted-foreground mt-1">{automation.technicalDetails}</p>
              </div>

              <div>
                <h3 className="font-medium">Access Control</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">Teams with access:</h4>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Automation Run</DialogTitle>
          <DialogDescription>
            Please confirm the following details before proceeding
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Index Pattern</h4>
              <p className="text-sm text-muted-foreground">{pattern}</p>
            </div>
            <div>
              <h4 className="font-medium">Scheduled Time</h4>
              <p className="text-sm text-muted-foreground">
                {scheduledDate 
                  ? scheduledDate.toLocaleString()
                  : 'Immediate execution'}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Matching Data Sources</h4>
              <div className="mt-2 space-y-1">
                {dataSources.length > 0 ? (
                  dataSources.map((source, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {source}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No matching data sources found</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </DashboardShell>
  )
}
