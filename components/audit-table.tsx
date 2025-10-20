"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { auditLogs } from "@/lib/data"
import { useAuth } from "./auth-provider"

interface AuditTableProps {
  filter: "all" | "users" | "automations" | "system"
}

export function AuditTable({ filter }: AuditTableProps) {
  const [sortBy, setSortBy] = useState<"date" | "action" | "user">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { user } = useAuth()

  // Filter logs based on category and user's role
  const filteredLogs = auditLogs.filter((log) => {
    const categoryMatch = filter === "all" || log.category === filter
    // Admin sees all logs, regular users only see logs from their team
    const accessMatch = user?.assumeRole === "admin" || log.team === user?.team
    return categoryMatch && accessMatch
  })

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    } else if (sortBy === "action") {
      return sortOrder === "asc" ? a.action.localeCompare(b.action) : b.action.localeCompare(a.action)
    } else {
      return sortOrder === "asc" ? a.user.localeCompare(b.user) : b.user.localeCompare(a.user)
    }
  })

  const toggleSort = (column: "date" | "action" | "user") => {
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
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("action")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Action
                  {sortBy === "action" && (
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
            {sortedLogs.length > 0 ? (
              sortedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      {log.category}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.team}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
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
                        <DropdownMenuItem>Export log</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
