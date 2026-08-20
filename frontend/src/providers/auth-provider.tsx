"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import { useRouter } from "next/navigation"

import { readApiError } from "@/lib/api/client"
import type {
    AuthSession,
    LoginRequest,
} from "@/types/api"

interface AuthContextValue {
    user: AuthSession | null
    loading: boolean
    login: (credentials: LoginRequest) => Promise<void>
    logout: () => Promise<void>
    refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()

    const [user, setUser] = useState<AuthSession | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshSession = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/session", {
                cache: "no-store",
            })

            if (!response.ok) {
                setUser(null)
                return
            }

            setUser((await response.json()) as AuthSession)
        } finally {
            setLoading(false)
        }
    }, [])

    const login = useCallback(async (credentials: LoginRequest) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        })

        if (!response.ok) {
            throw await readApiError(response)
        }

        setUser((await response.json()) as AuthSession)
    }, [])

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
        })

        setUser(null)
        router.replace("/login")
        router.refresh()
    }, [router])

    useEffect(() => {
        void refreshSession()
    }, [refreshSession])

    useEffect(() => {
        function handleSessionExpired() {
            setUser(null)
            router.replace("/login")
        }

        window.addEventListener(
            "session-expired",
            handleSessionExpired,
        )

        return () => {
            window.removeEventListener(
                "session-expired",
                handleSessionExpired,
            )
        }
    }, [router])

    const value = useMemo(
        () => ({
            user,
            loading,
            login,
            logout,
            refreshSession,
        }),
        [user, loading, login, logout, refreshSession],
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            "useAuth debe utilizarse dentro de AuthProvider.",
        )
    }

    return context
}