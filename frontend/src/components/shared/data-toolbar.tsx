import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

interface DataToolbarProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    actions?: React.ReactNode
}

export function DataToolbar({
    value,
    onChange,
    placeholder = "Buscar...",
    actions,
}: DataToolbarProps) {
    return (
        <div className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="bg-white pl-9"
                />
            </div>

            {actions}
        </div>
    )
}