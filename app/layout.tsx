import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import QueryClientProvider from "@/components/query-client-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Platform Automation",
  description: "Internal automation platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Credit-One-Bank-logo.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <SidebarProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </SidebarProvider>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
