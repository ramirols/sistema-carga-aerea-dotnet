import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
    AUTH_COOKIE,
    decodeSession,
    SESSION_COOKIE,
} from "@/lib/server/session"

export async function GET() {
    const cookieStore = await cookies()

    const token = cookieStore.get(AUTH_COOKIE)?.value
    const encodedSession = cookieStore.get(SESSION_COOKIE)?.value

    if (!token || !encodedSession) {
        return NextResponse.json(
            { detail: "No existe una sesión activa." },
            { status: 401 },
        )
    }

    const session = decodeSession(encodedSession)

    if (!session || new Date(session.expiraEn).getTime() <= Date.now()) {
        cookieStore.delete(AUTH_COOKIE)
        cookieStore.delete(SESSION_COOKIE)

        return NextResponse.json(
            { detail: "La sesión ha expirado." },
            { status: 401 },
        )
    }

    return NextResponse.json(session)
}