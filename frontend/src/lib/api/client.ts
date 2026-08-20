import type { ValidationProblemDetails } from "@/types/api"

export class ApiError extends Error {
    status: number
    errors?: Record<string, string[]>

    constructor(
        message: string,
        status: number,
        errors?: Record<string, string[]>,
    ) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.errors = errors
    }
}

export async function readApiError(
    response: Response,
): Promise<ApiError> {
    let problem: ValidationProblemDetails | null = null

    try {
        problem = (await response.json()) as ValidationProblemDetails
    } catch {
        return new ApiError(
            "No se pudo completar la operación.",
            response.status,
        )
    }

    const firstValidationMessage = problem.errors
        ? Object.values(problem.errors).flat()[0]
        : undefined

    return new ApiError(
        firstValidationMessage ??
        problem.detail ??
        problem.title ??
        "No se pudo completar la operación.",
        response.status,
        problem.errors,
    )
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`

    const headers = new Headers(options.headers)

    headers.set("Accept", "application/json")

    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json")
    }

    const response = await fetch(`/api/backend${normalizedPath}`, {
        ...options,
        headers,
        cache: "no-store",
    })

    if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
            window.dispatchEvent(new Event("session-expired"))
        }

        throw await readApiError(response)
    }

    if (response.status === 204) {
        return undefined as T
    }

    return (await response.json()) as T
}