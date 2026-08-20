export function formatDate(value?: string | null): string {
    if (!value) return "—"

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date)
}

export function formatDateTime(value?: string | null): string {
    if (!value) return "—"

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

export function formatTime(value?: string | null): string {
    if (!value) return "—"

    return value.slice(0, 5)
}

export function formatWeight(value?: number | null): string {
    return `${Number(value ?? 0).toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} kg`
}