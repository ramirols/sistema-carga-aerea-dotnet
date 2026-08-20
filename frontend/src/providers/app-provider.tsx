"use client"

import { useState } from "react"
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query"

import { Toaster } from "sileo"

import { AuthProvider } from "@/providers/auth-provider"

export function AppProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        retry: 0,
                    },
                },
            }),
    )

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}

                <Toaster
                    position="top-right"
                    theme="light"
                    options={{
                        duration: 4500,
                        roundness: 14,
                    }}
                />
            </AuthProvider>
        </QueryClientProvider>
    )
}