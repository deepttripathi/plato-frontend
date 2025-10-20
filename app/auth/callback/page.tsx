"use client"

import { Suspense, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import CreditOneLogo from "@/public/Credit-One-Bank-logo.png"

export default function AuthCallbackPage() {
  const { handleToken } = useAuth()
  
  const router = useRouter()

  useEffect(() => {
    const processAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const token = searchParams.get('encrypted_token')
      if (token) {
        await handleToken(token)
        router.push('/')
      } else {
        router.push('/auth')
      }
    }
    
    processAuth()
  }, [handleToken, router])

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
            Authenticating
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Please wait while we complete your sign in
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground animate-pulse">Processing authentication...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
