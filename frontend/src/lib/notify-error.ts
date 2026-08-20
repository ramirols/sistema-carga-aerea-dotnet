import { sileo } from "sileo"

import { ApiError } from "@/lib/api/client"

export function notifyError(
    error: unknown,
    title = "No se pudo completar la operación",
) {
    sileo.error({
        title,
        description:
            error instanceof ApiError
                ? error.message
                : "Ocurrió un error inesperado. Inténtalo nuevamente.",
    })
}