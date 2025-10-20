"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Users } from "lucide-react"
import { teams } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export function TeamManagement() {
  const [activeTeams, setActiveTeams] = useState(teams)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const filteredTeams = activeTeams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    if (name) {
      const newTeam = {
        id: `team-${Date.now()}`,
        name,
        description,
        memberCount: 0,
        automationCount: 0,
      }

      setActiveTeams([...activeTeams, newTeam])

      toast({
        title: "Team created",
        description: `Team "${name}" has been created successfully.`,
      })

      // Reset the form
      e.currentTarget.reset()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search teams..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddTeam}>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Add a new team to the platform. Teams can have their own set of automations and users.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" name="name" placeholder="Engineering" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Team responsible for engineering tasks"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Team</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Team Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Members</TableHead>
              <TableHead className="text-center">Automations</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary">
                        <Users className="mr-1 h-3 w-3" />
                        {team.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{team.description}</TableCell>
                  <TableCell className="text-center">{team.memberCount}</TableCell>
                  <TableCell className="text-center">{team.automationCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View team</DropdownMenuItem>
                        <DropdownMenuItem>Edit team</DropdownMenuItem>
                        <DropdownMenuItem>Manage members</DropdownMenuItem>
                        <DropdownMenuItem>Manage automations</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No teams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
