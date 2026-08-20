import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import {
    AUTH_COOKIE,
    SESSION_COOKIE,
} from "@/lib/server/session"

interface RouteContext {
    params: Promise<{
        path: string[]
    }>
}

async function forwardRequest(
    request: NextRequest,
    context: RouteContext,
) {
    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) {
        return NextResponse.json(
            {
                title: "Configuración incompleta",
                detail: "No se configuró BACKEND_URL.",
            },
            { status: 500 },
        )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE)?.value

    if (!token) {
        return NextResponse.json(
            {
                title: "No autorizado",
                detail: "Debe iniciar sesión para realizar esta operación.",
            },
            { status: 401 },
        )
    }

    const { path } = await context.params
    const targetUrl = new URL(`/api/${path.join("/")}`, backendUrl)

    request.nextUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.append(key, value)
    })

    const headers = new Headers({
        Accept: request.headers.get("accept") ?? "application/json",
        Authorization: `Bearer ${token}`,
    })

    const contentType = request.headers.get("content-type")

    if (contentType) {
        headers.set("Content-Type", contentType)
    }

    const canHaveBody = !["GET", "HEAD"].includes(request.method)

    const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: canHaveBody ? await request.arrayBuffer() : undefined,
        cache: "no-store",
    })

    const responseBody =
        backendResponse.status === 204
            ? null
            : await backendResponse.arrayBuffer()

    const response = new NextResponse(responseBody, {
        status: backendResponse.status,
        headers: {
            "Content-Type":
                backendResponse.headers.get("content-type") ??
                "application/json",
        },
    })

    if (backendResponse.status === 401) {
        response.cookies.delete(AUTH_COOKIE)
        response.cookies.delete(SESSION_COOKIE)
    }

    return response
}

export function GET(request: NextRequest, context: RouteContext) {
    return forwardRequest(request, context)
}

export function POST(request: NextRequest, context: RouteContext) {
    return forwardRequest(request, context)
}

export function PUT(request: NextRequest, context: RouteContext) {
    return forwardRequest(request, context)
}

export function PATCH(request: NextRequest, context: RouteContext) {
    return forwardRequest(request, context)
}

export function DELETE(request: NextRequest, context: RouteContext) {
    return forwardRequest(request, context)
}