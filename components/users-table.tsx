"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { users } from "@/lib/data"
import { useAuth } from "./auth-provider"

interface UsersTableProps {
  filter: "all" | "team" | "admin"
  searchQuery: string
}

export function UsersTable({ filter, searchQuery }: UsersTableProps) {
  const [sortBy, setSortBy] = useState<"name" | "email" | "team">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const { user: currentUser } = useAuth()

  // Filter users based on filter type, search query, and user's role
  const filteredUsers = users.filter((user) => {
    // Filter by type
    const typeMatch =
      filter === "all" ||
      (filter === "team" && user.team === currentUser?.team) ||
      (filter === "admin" && user.role === "admin")

    // Filter by search query
    const searchMatch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.team.toLowerCase().includes(searchQuery.toLowerCase())

    // Admin sees all users, regular users only see users from their team
    const accessMatch = currentUser?.role === "admin" || user.team === currentUser?.team

    return typeMatch && searchMatch && accessMatch
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "email") {
      return sortOrder === "asc" ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email)
    } else {
      return sortOrder === "asc" ? a.team.localeCompare(b.team) : b.team.localeCompare(a.team)
    }
  })

  const toggleSort = (column: "name" | "email" | "team") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Name
                  {sortBy === "name" && (
                    <ChevronDown className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("email")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Email
                  {sortBy === "email" && (
                    <ChevronDown className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>Role</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("team")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Team
                  {sortBy === "team" && (
                    <ChevronDown className={`h-4 w-4 ${sortOrder === "desc" ? "" : "rotate-180"}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.team}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        {currentUser?.role === "admin" && <DropdownMenuItem>Delete user</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
