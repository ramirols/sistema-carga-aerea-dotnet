"use client"

import {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    LoaderCircle,
    MapPinned,
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
import {
    TableEmpty,
    TableLoading,
} from "@/components/shared/table-states"
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
import type {
    DestinoRequest,
    DestinoResponse,
} from "@/types/api"

const schema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre es obligatorio.")
        .max(150, "Máximo 150 caracteres."),
    codigoIATA: z
        .string()
        .trim()
        .length(3, "El código IATA debe tener 3 letras.")
        .regex(/^[A-Za-z]{3}$/, "Solo se permiten letras."),
    pais: z
        .string()
        .trim()
        .min(2, "El país es obligatorio.")
        .max(100, "Máximo 100 caracteres."),
})

type DestinoFormValues = z.infer<typeof schema>

export default function DestinosPage() {
    const queryClient = useQueryClient()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selected, setSelected] =
        useState<DestinoResponse | null>(null)

    const query = useQuery({
        queryKey: ["destinos"],
        queryFn: () =>
            apiFetch<DestinoResponse[]>("/Destinos"),
    })

    const form = useForm<DestinoFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nombre: "",
            codigoIATA: "",
            pais: "",
        },
    })

    useEffect(() => {
        if (!dialogOpen) return

        form.reset({
            nombre: selected?.nombre ?? "",
            codigoIATA: selected?.codigoIATA ?? "",
            pais: selected?.pais ?? "",
        })
    }, [dialogOpen, selected, form])

    const saveMutation = useMutation({
        mutationFn: (values: DestinoFormValues) => {
            const request: DestinoRequest = {
                ...values,
                codigoIATA: values.codigoIATA.toUpperCase(),
            }

            if (selected) {
                return apiFetch<DestinoResponse>(
                    `/Destinos/${selected.id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(request),
                    },
                )
            }

            return apiFetch<DestinoResponse>("/Destinos", {
                method: "POST",
                body: JSON.stringify(request),
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["destinos"],
            })

            sileo.success({
                title: selected
                    ? "Destino actualizado"
                    : "Destino creado",
                description: "La información se guardó correctamente.",
            })

            setDialogOpen(false)
            setSelected(null)
        },
        onError: (error) => notifyError(error),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            apiFetch<void>(`/Destinos/${id}`, {
                method: "DELETE",
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["destinos"],
            })

            sileo.success({
                title: "Destino eliminado",
                description: "El destino fue eliminado correctamente.",
            })

            setDeleteOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(error, "No se pudo eliminar el destino"),
    })

    const filter = useCallback(
        (destino: DestinoResponse, search: string) =>
            destino.nombre.toLowerCase().includes(search) ||
            destino.codigoIATA.toLowerCase().includes(search) ||
            destino.pais.toLowerCase().includes(search),
        [],
    )

    const pagination = useTablePagination({
        data: query.data ?? [],
        filter,
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Destinos"
                description="Administra los destinos disponibles para los vuelos."
                icon={MapPinned}
                actions={
                    <Button
                        onClick={() => {
                            setSelected(null)
                            setDialogOpen(true)
                        }}
                    >
                        <Plus />
                        Nuevo destino
                    </Button>
                }
            />

            <Card className="overflow-hidden py-0">
                <DataToolbar
                    value={pagination.search}
                    onChange={pagination.setSearch}
                    placeholder="Buscar por nombre, IATA o país..."
                />

                <CardContent className="p-0">
                    {query.isLoading ? (
                        <TableLoading />
                    ) : pagination.paginatedData.length === 0 ? (
                        <TableEmpty message="No se encontraron destinos." />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Destino</TableHead>
                                        <TableHead>Código IATA</TableHead>
                                        <TableHead>País</TableHead>
                                        <TableHead className="w-32 text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pagination.paginatedData.map((destino) => (
                                        <TableRow key={destino.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                                        <MapPinned className="size-4" />
                                                    </div>

                                                    <div>
                                                        <p className="font-medium">
                                                            {destino.nombre}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            ID #{destino.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="font-mono"
                                                >
                                                    {destino.codigoIATA}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>{destino.pais}</TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelected(destino)
                                                            setDialogOpen(true)
                                                        }}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => {
                                                            setSelected(destino)
                                                            setDeleteOpen(true)
                                                        }}
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

                        if (!open) setSelected(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Editar destino" : "Nuevo destino"}
                        </DialogTitle>

                        <DialogDescription>
                            Registra la ubicación y su código aeroportuario.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="destino-form"
                        className="grid gap-5 py-2 sm:grid-cols-2"
                        onSubmit={form.handleSubmit((values) =>
                            saveMutation.mutate(values),
                        )}
                    >
                        <Controller
                            name="nombre"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="sm:col-span-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        Nombre
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Aeropuerto Internacional Jorge Chávez"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="codigoIATA"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Código IATA
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        value={field.value.toUpperCase()}
                                        onChange={(event) =>
                                            field.onChange(
                                                event.target.value
                                                    .toUpperCase()
                                                    .slice(0, 3),
                                            )
                                        }
                                        aria-invalid={fieldState.invalid}
                                        placeholder="LIM"
                                        className="font-mono uppercase"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="pais"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        País
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Perú"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
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
                            form="destino-form"
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Eliminar destino"
                description={`¿Seguro que deseas eliminar “${selected?.nombre ?? ""}”? No será posible eliminarlo si está siendo utilizado por un vuelo.`}
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