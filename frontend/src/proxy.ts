import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = [
    "/dashboard",
    "/destinos",
    "/encomiendas",
    "/personas",
    "/vuelos",
    "/usuarios",
    "/roles",
    "/estados-encomienda",
    "/estados-vuelo",
]

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const hasSession = Boolean(
        request.cookies.get("sca_token")?.value,
    )

    const isProtectedRoute = protectedRoutes.some(
        (route) =>
            pathname === route || pathname.startsWith(`${route}/`),
    )

    if (isProtectedRoute && !hasSession) {
        return NextResponse.redirect(
            new URL("/login", request.url),
        )
    }

    if (pathname === "/login" && hasSession) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url),
        )
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/destinos/:path*",
        "/encomiendas/:path*",
        "/personas/:path*",
        "/vuelos/:path*",
        "/usuarios/:path*",
        "/roles/:path*",
        "/estados-encomienda/:path*",
        "/estados-vuelo/:path*",
        "/login",
    ],
}