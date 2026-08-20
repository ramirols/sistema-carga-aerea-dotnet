"use client"

import {
    useCallback,
    useEffect,
    useState,
} from "react"
import type { LucideIcon } from "lucide-react"
import {
    LoaderCircle,
    LockKeyhole,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { sileo } from "sileo"
import { z } from "zod"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataPagination } from "@/components/shared/data-pagination"
import { DataToolbar } from "@/components/shared/data-toolbar"
import { PageHeader } from "@/components/shared/page-header"
import { TableEmpty, TableLoading } from "@/components/shared/table-states"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTablePagination } from "@/hooks/use-table-pagination"
import { apiFetch } from "@/lib/api/client"
import { notifyError } from "@/lib/notify-error"

interface CatalogItem {
    id: number
    nombre: string
    esDelSistema: boolean
}

interface CatalogCrudPageProps {
    title: string
    description: string
    singularName: string
    endpoint: string
    queryKey: string
    icon: LucideIcon
}

const schema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres.")
        .max(80, "El nombre no debe superar 80 caracteres."),
})

type CatalogFormValues = z.infer<typeof schema>

export function CatalogCrudPage({
    title,
    description,
    singularName,
    endpoint,
    queryKey,
    icon,
}: CatalogCrudPageProps) {
    const queryClient = useQueryClient()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selected, setSelected] =
        useState<CatalogItem | null>(null)

    const query = useQuery({
        queryKey: [queryKey],
        queryFn: () => apiFetch<CatalogItem[]>(endpoint),
    })

    const form = useForm<CatalogFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nombre: "",
        },
    })

    useEffect(() => {
        if (!dialogOpen) return

        form.reset({
            nombre: selected?.nombre ?? "",
        })
    }, [dialogOpen, selected, form])

    const saveMutation = useMutation({
        mutationFn: (values: CatalogFormValues) => {
            if (selected) {
                return apiFetch<CatalogItem>(
                    `${endpoint}/${selected.id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(values),
                    },
                )
            }

            return apiFetch<CatalogItem>(endpoint, {
                method: "POST",
                body: JSON.stringify(values),
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKey],
            })

            sileo.success({
                title: selected
                    ? `${singularName} actualizado`
                    : `${singularName} creado`,
                description: "Los cambios se guardaron correctamente.",
            })

            setDialogOpen(false)
            setSelected(null)
        },
        onError: (error) => notifyError(error),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            apiFetch<void>(`${endpoint}/${id}`, {
                method: "DELETE",
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [queryKey],
            })

            sileo.success({
                title: `${singularName} eliminado`,
                description: "El registro fue eliminado correctamente.",
            })

            setDeleteOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(error, "No se pudo eliminar el registro"),
    })

    const filter = useCallback(
        (item: CatalogItem, search: string) =>
            item.nombre.toLowerCase().includes(search),
        [],
    )

    const pagination = useTablePagination({
        data: query.data ?? [],
        filter,
    })

    function openCreate() {
        setSelected(null)
        setDialogOpen(true)
    }

    function openEdit(item: CatalogItem) {
        setSelected(item)
        setDialogOpen(true)
    }

    function openDelete(item: CatalogItem) {
        setSelected(item)
        setDeleteOpen(true)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={title}
                description={description}
                icon={icon}
                actions={
                    <Button onClick={openCreate}>
                        <Plus />
                        Nuevo {singularName.toLowerCase()}
                    </Button>
                }
            />

            <Card className="overflow-hidden py-0">
                <DataToolbar
                    value={pagination.search}
                    onChange={pagination.setSearch}
                    placeholder={`Buscar ${singularName.toLowerCase()}...`}
                />

                <CardContent className="p-0">
                    {query.isLoading ? (
                        <TableLoading />
                    ) : pagination.paginatedData.length === 0 ? (
                        <TableEmpty />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="w-32 text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pagination.paginatedData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="pl-6 text-muted-foreground">
                                                #{item.id}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {item.nombre}
                                            </TableCell>

                                            <TableCell>
                                                {item.esDelSistema ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1.5"
                                                    >
                                                        <LockKeyhole className="size-3" />
                                                        Sistema
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        Personalizado
                                                    </Badge>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={item.esDelSistema}
                                                        onClick={() => openEdit(item)}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={item.esDelSistema}
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => openDelete(item)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

                <DataPagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={pagination.setPage}
                    onPageSizeChange={pagination.setPageSize}
                />
            </Card>

            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    if (!saveMutation.isPending) {
                        setDialogOpen(open)

                        if (!open) {
                            setSelected(null)
                        }
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selected
                                ? `Editar ${singularName.toLowerCase()}`
                                : `Nuevo ${singularName.toLowerCase()}`}
                        </DialogTitle>

                        <DialogDescription>
                            Completa la información solicitada.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="catalog-form"
                        onSubmit={form.handleSubmit((values) =>
                            saveMutation.mutate(values),
                        )}
                        className="py-2"
                    >
                        <Controller
                            name="nombre"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Nombre
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder={`Nombre del ${singularName.toLowerCase()}`}
                                        autoFocus
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </form>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={saveMutation.isPending}
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="catalog-form"
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}

                            {saveMutation.isPending
                                ? "Guardando..."
                                : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={`Eliminar ${singularName.toLowerCase()}`}
                description={`¿Seguro que deseas eliminar “${selected?.nombre ?? ""}”? Esta acción no se puede deshacer.`}
                pending={deleteMutation.isPending}
                onConfirm={() => {
                    if (selected) {
                        deleteMutation.mutate(selected.id)
                    }
                }}
            />
        </div>
    )
}