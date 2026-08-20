import { LoaderCircle, TriangleAlert } from "lucide-react"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    pending?: boolean
    onConfirm: () => void
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = "Eliminar",
    pending = false,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!pending) {
                    onOpenChange(nextOpen)
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                        <TriangleAlert className="size-5" />
                    </div>

                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Cancelar
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={pending}
                        onClick={onConfirm}
                    >
                        {pending && (
                            <LoaderCircle className="animate-spin" />
                        )}

                        {pending ? "Procesando..." : confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}