"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"

const SERVER_URL = "http://" + process.env.NEXT_PUBLIC_SERVER

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  assumeRole: "admin" | "user"
  team: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  initiateLogin: () => void
  logout: () => void
  handleToken: (token: string) => void
  authFetch: (endpoint: string, options?: RequestInit) => Promise<Response>
  assumeRole: (role: "admin" | "user") => void,
  getCurrentAssumedRole: () => "admin" | "user" | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const { data: session, isLoading, refetch: userFetch } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      // Get all cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as { [key: string]: string });
      
      console.log('Auth cookies received:', cookies);
      
      const token = cookies['token'];
      const response = await fetch(`${SERVER_URL}/user`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch session')
      }
      return response.json()
    },
    retry: false,
  })

  useEffect(() => {
    if (session?.user) {
      console.log(session.user)
      setUser({ 
        email: session.user.email, 
        name: session.user.name, 
        role: "admin", 
        assumeRole: "admin", 
        team: session.user.groups?.[0] || " ", 
        id: session.user.name 
      })
    } else {
      router.push('/auth')
    }
  }, [session, isLoading, router])

  const initiateLogin = () => {
    // Redirect to SAML login endpoint
    window.location.href = `${SERVER_URL}/saml/login`
  }

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${SERVER_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Logout failed')
      }
    },
    onSuccess: () => {
      setUser(null)
      router.push('/auth')
    },
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  const handleToken = async (encryptedToken: string) => {
    try {
      // Convert the base64 key to ArrayBuffer
      const keyData = process.env.NEXT_PUBLIC_BASE64_TOKEN_KEY || "";
      const keyBytes = atob(keyData);
      const keyArray = new Uint8Array(keyBytes.length);
      for (let i = 0; i < keyBytes.length; i++) {
        keyArray[i] = keyBytes.charCodeAt(i);
      }
      
      // Import the key
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyArray,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );
      
      // Decode the base64 encrypted token
      const encryptedBytes = atob(encryptedToken.replace(/-/g, '+').replace(/_/g, '/'));
      const encryptedArray = new Uint8Array(encryptedBytes.length);
      for (let i = 0; i < encryptedBytes.length; i++) {
        encryptedArray[i] = encryptedBytes.charCodeAt(i);
      }
      
      // Extract nonce and ciphertext
      const nonceLength = 12; // GCM nonce size
      const nonce = encryptedArray.slice(0, nonceLength);
      const ciphertext = encryptedArray.slice(nonceLength);
      
      // Decrypt
      const decryptedArray = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: nonce
        },
        key,
        ciphertext
      );
      
      // Convert decrypted array to string
      const decryptedToken = new TextDecoder().decode(decryptedArray);

      // Set decrypted token as HTTP-only cookie that expires in 24 hours
      document.cookie = `token=${decryptedToken}; path=/; max-age=${3600 * 24}; samesite=strict`
      await userFetch()
    } catch (error) {
      console.error('Error decrypting token:', error);
      throw new Error('Failed to handle token');
    }
  }

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    // Get all cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: string });

    const token = cookies['token'];

    // Merge the authorization header with any existing headers
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };

    // Construct the full URL if it's not already absolute
    const url = endpoint.startsWith('http') ? endpoint : `${SERVER_URL}${endpoint}`;

    // Return fetch with merged options
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers
    });
  };

  const assumeRole = (role: "admin" | "user") => {
    if (user?.role === "admin") {
      setUser(user => user ? { ...user, assumeRole: role } : null);
    }
  };

  const getCurrentAssumedRole = () => {
    return user?.assumeRole || null;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        initiateLogin, 
        logout, 
        handleToken,
        authFetch,
        assumeRole,
        getCurrentAssumedRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

export function useAssumeRole() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAssumeRole must be used within an AuthProvider")
  }

  return {
    assumeRole: context.assumeRole,
    getCurrentAssumedRole: context.getCurrentAssumedRole,
    canAssumeRole: context.user?.role === "admin"
  }
}
