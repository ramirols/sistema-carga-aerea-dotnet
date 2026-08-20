import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataPaginationProps {
    page: number
    totalPages: number
    totalItems: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
}

export function DataPagination({
    page,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: DataPaginationProps) {
    return (
        <div className="flex flex-col justify-between gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center">
            <p className="text-muted-foreground">
                {totalItems}{" "}
                {totalItems === 1 ? "registro" : "registros"}
            </p>

            <div className="flex items-center gap-3">
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) =>
                        onPageSizeChange(Number(value))
                    }
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                </Select>

                <p className="whitespace-nowrap text-muted-foreground">
                    Página {page} de {totalPages}
                </p>

                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        <ChevronLeft className="size-4" />
                        <span className="sr-only">Página anterior</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        <ChevronRight className="size-4" />
                        <span className="sr-only">Página siguiente</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}