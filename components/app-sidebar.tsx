"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, History, Home, LogOut, Play, Shield, Users, Database, ChevronsUpDown} from "lucide-react"
import CreditOneLogo from "@/public/Credit-One-Bank-logo.png"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "./auth-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout, assumeRole } = useAuth()

  const { isMobile } = useSidebar()

  const isAdmin = user?.role === "admin"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-between pl-4 py-6">
        <Link href="/" className="flex items-center gap-4">
          <SidebarMenuButton>
          <Database className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Platform Automation</span>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <div className="space-y-4">
            {/* Dashboard Group */}
            <div>
              <SidebarGroupLabel className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Dashboard</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span className="">Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/automations" || pathname.startsWith("/automations/")}>
                  <Link href="/automations">
                    <Play className="h-4 w-4" />
                    <span>Automations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>

            {/* Management Group */}
            <div>
              <SidebarGroupLabel className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Management</SidebarGroupLabel>
              {user?.assumeRole === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                    <Link href="/admin">
                      <BarChart className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/users"}>
                  <Link href="/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>

            {/* Monitoring & Compliance Group */}
            <div>
              <SidebarGroupLabel className="mb-2 px-2 text-sm font-semibold text-muted-foreground">Monitoring & Compliance</SidebarGroupLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/history"}>
                  <Link href="/history">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/audit"}>
                  <Link href="/audit">
                    <Shield className="h-4 w-4" />
                    <span>Audit</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </div>
          </div>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => user?.assumeRole === "admin" ? assumeRole("user") : assumeRole("admin")}>
                  <Shield className="mr-2 h-4 w-4" />
                  {user?.assumeRole === "admin" ? "Switch to User View" : "Switch to Admin View"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            )}
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
      </SidebarFooter>

      {/* Add the rail at the right edge of the sidebar */}
      <SidebarRail />
    </Sidebar>
  )
}
