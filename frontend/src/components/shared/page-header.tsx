import type { LucideIcon } from "lucide-react"

interface PageHeaderProps {
    title: string
    description: string
    icon?: LucideIcon
    actions?: React.ReactNode
}

export function PageHeader({
    title,
    description,
    icon: Icon,
    actions,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
                {Icon && (
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                        <Icon className="size-5" />
                    </div>
                )}

                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            {actions && <div>{actions}</div>}
        </div>
    )
}