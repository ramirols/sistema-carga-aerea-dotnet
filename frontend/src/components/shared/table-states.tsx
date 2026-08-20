import { Inbox, LoaderCircle } from "lucide-react"

export function TableLoading() {
    return (
        <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-muted-foreground">
            <LoaderCircle className="size-5 animate-spin text-blue-600" />
            Cargando información...
        </div>
    )
}

export function TableEmpty({
    message = "No se encontraron registros.",
}: {
    message?: string
}) {
    return (
        <div className="flex min-h-56 flex-col items-center justify-center text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Inbox className="size-6" />
            </div>

            <p className="mt-4 text-sm font-medium">{message}</p>
            <p className="mt-1 text-xs text-muted-foreground">
                Los registros aparecerán en esta sección.
            </p>
        </div>
    )
}