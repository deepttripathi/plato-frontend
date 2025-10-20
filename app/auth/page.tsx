"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import CreditOneLogo from "@/public/Credit-One-Bank-logo.png"

export default function AuthPage() {
  const { user, initiateLogin, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <div className="flex min-h-screen h-screen w-screen items-center justify-center bg-gradient-to-br from-background to-accent/20">
      <div className="absolute top-8 left-8">
        <Image
          src={CreditOneLogo}
          alt="Logo"
          width={150}
          height={40}
          className="dark:brightness-0 dark:invert"
        />
      </div>
      <Card className="w-[400px] shadow-lg">
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Sign in to access the Platform Automation Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={initiateLogin} 
            className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in with SSO"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
