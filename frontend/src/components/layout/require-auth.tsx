"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"

import { useAuth } from "@/providers/auth-provider"

export function RequireAuth({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login")
        }
    }, [loading, user, router])

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <LoaderCircle className="size-5 animate-spin text-blue-600" />
                    Cargando sesión...
                </div>
            </div>
        )
    }

    return children
}