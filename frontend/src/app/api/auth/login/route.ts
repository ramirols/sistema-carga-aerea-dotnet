import { NextResponse } from "next/server"

import {
    AUTH_COOKIE,
    encodeSession,
    SESSION_COOKIE,
} from "@/lib/server/session"
import type {
    AuthSession,
    LoginRequest,
    LoginResponse,
} from "@/types/api"

function getErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
        return "Error desconocido al conectar con el backend."
    }

    if (error.cause instanceof Error) {
        return `${error.message}: ${error.cause.message}`
    }

    return error.message
}

export async function POST(request: Request) {
    const backendUrl = process.env.BACKEND_URL

    if (!backendUrl) {
        return NextResponse.json(
            {
                title: "Configuración incompleta",
                detail:
                    "No se encontró BACKEND_URL. Verifica que exista frontend/.env.local y reinicia Next.js.",
            },
            { status: 500 },
        )
    }

    let credentials: LoginRequest

    try {
        credentials = (await request.json()) as LoginRequest
    } catch {
        return NextResponse.json(
            {
                title: "Solicitud inválida",
                detail: "El cuerpo de la solicitud no contiene un JSON válido.",
            },
            { status: 400 },
        )
    }

    try {
        const loginUrl = new URL("/api/Auth/login", backendUrl)

        const backendResponse = await fetch(loginUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
            cache: "no-store",
        })

        if (!backendResponse.ok) {
            const contentType =
                backendResponse.headers.get("content-type") ??
                "application/problem+json"

            const body = await backendResponse.text()

            return new NextResponse(
                body ||
                JSON.stringify({
                    title: "Error de autenticación",
                    detail:
                        "El backend rechazó la solicitud de inicio de sesión.",
                }),
                {
                    status: backendResponse.status,
                    headers: {
                        "Content-Type": contentType,
                    },
                },
            )
        }

        const login = (await backendResponse.json()) as LoginResponse

        if (
            !login.token ||
            !login.nombreUsuario ||
            !login.rol ||
            !login.expiraEn
        ) {
            console.error(
                "La respuesta del backend no contiene todos los datos:",
                login,
            )

            return NextResponse.json(
                {
                    title: "Respuesta de autenticación inválida",
                    detail:
                        "El backend no devolvió token, usuario, rol y fecha de expiración.",
                },
                { status: 502 },
            )
        }

        const session: AuthSession = {
            nombreUsuario: login.nombreUsuario,
            rol: login.rol,
            expiraEn: login.expiraEn,
        }

        const expiration = new Date(login.expiraEn)

        if (Number.isNaN(expiration.getTime())) {
            return NextResponse.json(
                {
                    title: "Fecha de expiración inválida",
                    detail:
                        "El backend devolvió una fecha de expiración no reconocida.",
                },
                { status: 502 },
            )
        }

        const response = NextResponse.json(session)

        response.cookies.set(AUTH_COOKIE, login.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            expires: expiration,
        })

        response.cookies.set(
            SESSION_COOKIE,
            encodeSession(session),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                expires: expiration,
            },
        )

        return response
    } catch (error) {
        const message = getErrorMessage(error)

        console.error(
            `No se pudo conectar con el backend configurado en ${backendUrl}.`,
            error,
        )

        return NextResponse.json(
            {
                title: "Backend no disponible",
                detail:
                    process.env.NODE_ENV === "development"
                        ? `No se pudo conectar con ${backendUrl}. ${message}`
                        : "No se pudo establecer comunicación con el servidor.",
            },
            { status: 502 },
        )
    }
}