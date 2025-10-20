
"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      {pathname.startsWith('/auth') ? (
        children
      ) : (
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto relative">
            <div className="fixed bottom-4 left-4 h-10 w-10 z-10 md:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </main>
        </div>
      )}
    </>
  )
}
