import { NextResponse } from "next/server"

import {
    AUTH_COOKIE,
    SESSION_COOKIE,
} from "@/lib/server/session"

export async function POST() {
    const response = NextResponse.json({
        message: "Sesión cerrada correctamente.",
    })

    response.cookies.delete(AUTH_COOKIE)
    response.cookies.delete(SESSION_COOKIE)

    return response
}