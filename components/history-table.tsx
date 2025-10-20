"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal, RefreshCw, XCircle, CheckCircle } from "lucide-react"
import { historyEntries } from "@/lib/data"
import { useAuth } from "./auth-provider"

interface HistoryTableProps {
  filter: "all" | "success" | "failed" | "running"
}

export function HistoryTable({ filter }: HistoryTableProps) {
  const [sortBy, setSortBy] = useState<"date" | "automation" | "user">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { user } = useAuth()

  // Filter entries based on status and user's team if not admin
  const filteredEntries = historyEntries.filter((entry) => {
    const statusMatch = filter === "all" || entry.status === filter
    const teamMatch = user?.role === "admin" || entry.team === user?.team
    return statusMatch && teamMatch
  })

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    } else if (sortBy === "automation") {
      return sortOrder === "asc"
        ? a.automationName.localeCompare(b.automationName)
        : b.automationName.localeCompare(a.automationName)
    } else {
      return sortOrder === "asc" ? a.user.localeCompare(b.user) : b.user.localeCompare(a.user)
    }
  })

  const toggleSort = (column: "date" | "automation" | "user") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("automation")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Automation
                  {sortBy === "automation" && (
                    <ChevronDown className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("user")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  User
                  {sortBy === "user" && (
                    <ChevronDown className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Team</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("date")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Date
                  {sortBy === "date" && (
                    <ChevronDown className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.length > 0 ? (
              sortedEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {entry.status === "success" ? (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : entry.status === "failed" ? (
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4 text-yellow-500 animate-spin" />
                      )}
                      <span
                        className={
                          entry.status === "success"
                            ? "text-green-500"
                            : entry.status === "failed"
                              ? "text-red-500"
                              : "text-yellow-500"
                        }
                      >
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.automationName}</TableCell>
                  <TableCell>{entry.user}</TableCell>
                  <TableCell>{entry.team}</TableCell>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>View logs</DropdownMenuItem>
                        <DropdownMenuItem>Run again</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No history entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
