import "server-only"

import type { AuthSession } from "@/types/api"

export const AUTH_COOKIE = "sca_token"
export const SESSION_COOKIE = "sca_session"

export function encodeSession(session: AuthSession): string {
    return Buffer.from(JSON.stringify(session), "utf8").toString("base64url")
}

export function decodeSession(value: string): AuthSession | null {
    try {
        const decoded = Buffer.from(value, "base64url").toString("utf8")
        const session = JSON.parse(decoded) as AuthSession

        if (
            !session.nombreUsuario ||
            !session.rol ||
            !session.expiraEn
        ) {
            return null
        }

        return session
    } catch {
        return null
    }
}