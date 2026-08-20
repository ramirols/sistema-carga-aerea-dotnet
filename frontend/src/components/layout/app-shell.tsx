"use client"

import {
    Bell,
    Search,
} from "lucide-react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"

export function AppShell({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth()

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "18rem",
                    "--sidebar-width-mobile": "18rem",
                } as React.CSSProperties
            }
        >
            <AppSidebar />

            <SidebarInset className="min-w-0 bg-slate-50">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-white/90 px-4 backdrop-blur-xl sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <SidebarTrigger className="-ml-1" />

                        <div className="hidden h-5 w-px bg-border sm:block" />

                        <p className="hidden truncate text-sm text-muted-foreground md:block">
                            Sistema de administración de carga aérea
                        </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="max-w-40 truncate text-sm font-medium">
                                {user?.nombreUsuario}
                            </p>
                            <p className="max-w-40 truncate text-xs text-muted-foreground">
                                {user?.rol}
                            </p>
                        </div>

                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                            {user?.nombreUsuario
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}