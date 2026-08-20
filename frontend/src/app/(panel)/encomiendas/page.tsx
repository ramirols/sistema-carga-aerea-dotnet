"use client"

import {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    LoaderCircle,
    Package,
    PackageMinus,
    Pencil,
    Plane,
    Plus,
    Trash2,
    Weight,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useTablePagination } from "@/hooks/use-table-pagination"
import { apiFetch } from "@/lib/api/client"
import {
    formatDateTime,
    formatWeight,
} from "@/lib/formatters"
import { notifyError } from "@/lib/notify-error"
import type {
    EncomiendaRequest,
    EncomiendaResponse,
    PersonaResponse,
} from "@/types/api"

const schema = z.object({
    codigo: z
        .string()
        .trim()
        .min(3, "El código debe tener al menos 3 caracteres.")
        .max(30, "Máximo 30 caracteres."),
    descripcion: z
        .string()
        .trim()
        .min(3, "La descripción es obligatoria.")
        .max(120, "Máximo 120 caracteres."),
    peso: z
        .number()
        .positive("El peso debe ser mayor que cero."),
    remitenteId: z
        .number()
        .int()
        .positive("Selecciona un remitente."),
    destinatarioId: z
        .number()
        .int()
        .positive("Selecciona un destinatario."),
})

type EncomiendaFormValues = z.infer<typeof schema>

function getStatusClassName(estado: string): string {
    const normalized = estado.toLowerCase()

    if (normalized.includes("almacen")) {
        return "border-amber-200 bg-amber-50 text-amber-700"
    }

    if (normalized.includes("asign")) {
        return "border-blue-200 bg-blue-50 text-blue-700"
    }

    if (normalized.includes("embarc")) {
        return "border-emerald-200 bg-emerald-50 text-emerald-700"
    }

    return ""
}

export default function EncomiendasPage() {
    const queryClient = useQueryClient()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [releaseOpen, setReleaseOpen] = useState(false)

    const [selected, setSelected] =
        useState<EncomiendaResponse | null>(null)

    const encomiendasQuery = useQuery({
        queryKey: ["encomiendas"],
        queryFn: () =>
            apiFetch<EncomiendaResponse[]>("/Encomiendas"),
    })

    const personasQuery = useQuery({
        queryKey: ["personas"],
        queryFn: () =>
            apiFetch<PersonaResponse[]>("/Personas"),
    })

    const form = useForm<EncomiendaFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            codigo: "",
            descripcion: "",
            peso: 0,
            remitenteId: 0,
            destinatarioId: 0,
        },
    })

    useEffect(() => {
        if (!dialogOpen) return

        form.reset({
            codigo: selected?.codigo ?? "",
            descripcion: selected?.descripcion ?? "",
            peso: selected?.peso ?? 0,
            remitenteId: selected?.remitenteId ?? 0,
            destinatarioId: selected?.destinatarioId ?? 0,
        })
    }, [dialogOpen, selected, form])

    const saveMutation = useMutation({
        mutationFn: (values: EncomiendaFormValues) => {
            const request: EncomiendaRequest = values

            if (selected) {
                return apiFetch<EncomiendaResponse>(
                    `/Encomiendas/${selected.id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(request),
                    },
                )
            }

            return apiFetch<EncomiendaResponse>(
                "/Encomiendas",
                {
                    method: "POST",
                    body: JSON.stringify(request),
                },
            )
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["encomiendas"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["vuelos"],
                }),
            ])

            sileo.success({
                title: selected
                    ? "Encomienda actualizada"
                    : "Encomienda registrada",
                description:
                    "La información se guardó correctamente.",
            })

            setDialogOpen(false)
            setSelected(null)
        },
        onError: (error) => notifyError(error),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            apiFetch<void>(`/Encomiendas/${id}`, {
                method: "DELETE",
            }),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["encomiendas"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["vuelos"],
                }),
            ])

            sileo.success({
                title: "Encomienda eliminada",
                description:
                    "El registro fue eliminado correctamente.",
            })

            setDeleteOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(
                error,
                "No se pudo eliminar la encomienda",
            ),
    })

    const releaseMutation = useMutation({
        mutationFn: (id: number) =>
            apiFetch<EncomiendaResponse>(
                `/Encomiendas/${id}/vuelo`,
                {
                    method: "DELETE",
                },
            ),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["encomiendas"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["vuelos"],
                }),
            ])

            sileo.success({
                title: "Encomienda liberada",
                description:
                    "La encomienda regresó al almacén.",
            })

            setReleaseOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(
                error,
                "No se pudo liberar la encomienda",
            ),
    })

    const filter = useCallback(
        (
            encomienda: EncomiendaResponse,
            search: string,
        ) =>
            encomienda.codigo.toLowerCase().includes(search) ||
            encomienda.descripcion
                .toLowerCase()
                .includes(search) ||
            encomienda.remitente
                .toLowerCase()
                .includes(search) ||
            encomienda.destinatario
                .toLowerCase()
                .includes(search) ||
            encomienda.estado.toLowerCase().includes(search) ||
            encomienda.vueloCodigo
                ?.toLowerCase()
                .includes(search) === true,
        [],
    )

    const pagination = useTablePagination({
        data: encomiendasQuery.data ?? [],
        filter,
    })

    function openCreate() {
        setSelected(null)
        setDialogOpen(true)
    }

    function openEdit(encomienda: EncomiendaResponse) {
        setSelected(encomienda)
        setDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Encomiendas"
                description="Registra y controla la carga transportada."
                icon={Package}
                actions={
                    <Button onClick={openCreate}>
                        <Plus />
                        Nueva encomienda
                    </Button>
                }
            />

            <Card className="overflow-hidden py-0">
                <DataToolbar
                    value={pagination.search}
                    onChange={pagination.setSearch}
                    placeholder="Buscar por código, persona, estado o vuelo..."
                />

                <CardContent className="p-0">
                    {encomiendasQuery.isLoading ? (
                        <TableLoading />
                    ) : pagination.paginatedData.length === 0 ? (
                        <TableEmpty message="No se encontraron encomiendas." />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">
                                            Encomienda
                                        </TableHead>
                                        <TableHead>Personas</TableHead>
                                        <TableHead>Peso</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Vuelo</TableHead>
                                        <TableHead>Registro</TableHead>
                                        <TableHead className="w-36 text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pagination.paginatedData.map(
                                        (encomienda) => (
                                            <TableRow key={encomienda.id}>
                                                <TableCell className="pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                                                            <Package className="size-4" />
                                                        </div>

                                                        <div>
                                                            <p className="font-mono text-sm font-semibold">
                                                                {encomienda.codigo}
                                                            </p>
                                                            <p className="max-w-52 truncate text-xs text-muted-foreground">
                                                                {encomienda.descripcion}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="space-y-1 text-sm">
                                                        <p>
                                                            <span className="text-muted-foreground">
                                                                De:
                                                            </span>{" "}
                                                            {encomienda.remitente}
                                                        </p>
                                                        <p>
                                                            <span className="text-muted-foreground">
                                                                Para:
                                                            </span>{" "}
                                                            {encomienda.destinatario}
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <p className="flex items-center gap-1.5 font-medium">
                                                        <Weight className="size-4 text-muted-foreground" />
                                                        {formatWeight(
                                                            encomienda.peso,
                                                        )}
                                                    </p>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={getStatusClassName(
                                                            encomienda.estado,
                                                        )}
                                                    >
                                                        {encomienda.estado}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    {encomienda.vueloCodigo ? (
                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-1.5 font-mono"
                                                        >
                                                            <Plane className="size-3" />
                                                            {encomienda.vueloCodigo}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">
                                                            Sin vuelo
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap text-sm">
                                                    {formatDateTime(
                                                        encomienda.fechaRegistro,
                                                    )}
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Editar"
                                                            onClick={() =>
                                                                openEdit(encomienda)
                                                            }
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>

                                                        {encomienda.vueloCodigo && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                title="Liberar de vuelo"
                                                                className="text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                                                                onClick={() => {
                                                                    setSelected(encomienda)
                                                                    setReleaseOpen(true)
                                                                }}
                                                            >
                                                                <PackageMinus className="size-4" />
                                                            </Button>
                                                        )}

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Eliminar"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => {
                                                                setSelected(encomienda)
                                                                setDeleteOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
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
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selected
                                ? "Editar encomienda"
                                : "Nueva encomienda"}
                        </DialogTitle>

                        <DialogDescription>
                            Registra los datos de la carga y las personas
                            involucradas.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="encomienda-form"
                        className="grid gap-5 py-2 sm:grid-cols-2"
                        onSubmit={form.handleSubmit((values) =>
                            saveMutation.mutate(values),
                        )}
                    >
                        <Controller
                            name="codigo"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Código
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="ENC-00001"
                                        className="font-mono uppercase"
                                        onChange={(event) =>
                                            field.onChange(
                                                event.target.value.toUpperCase(),
                                            )
                                        }
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="peso"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Peso en kilogramos
                                    </FieldLabel>

                                    <Input
                                        id={field.name}
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={field.value || ""}
                                        onChange={(event) =>
                                            field.onChange(
                                                Number(event.target.value),
                                            )
                                        }
                                        aria-invalid={fieldState.invalid}
                                        placeholder="0.00"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="descripcion"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field
                                    className="sm:col-span-2"
                                    data-invalid={fieldState.invalid}
                                >
                                    <FieldLabel htmlFor={field.name}>
                                        Descripción
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        rows={3}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Describe el contenido de la encomienda"
                                        className="resize-none"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="remitenteId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Remitente</FieldLabel>

                                    <Select
                                        value={
                                            field.value > 0
                                                ? String(field.value)
                                                : ""
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Selecciona el remitente" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {personasQuery.data?.map((persona) => (
                                                <SelectItem
                                                    key={persona.id}
                                                    value={String(persona.id)}
                                                >
                                                    {persona.nombre} —{" "}
                                                    {persona.documento}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="destinatarioId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Destinatario</FieldLabel>

                                    <Select
                                        value={
                                            field.value > 0
                                                ? String(field.value)
                                                : ""
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Selecciona el destinatario" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {personasQuery.data?.map((persona) => (
                                                <SelectItem
                                                    key={persona.id}
                                                    value={String(persona.id)}
                                                >
                                                    {persona.nombre} —{" "}
                                                    {persona.documento}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

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
                            form="encomienda-form"
                            disabled={saveMutation.isPending}
                        >
                            {saveMutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Guardar encomienda
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Eliminar encomienda"
                description={`¿Seguro que deseas eliminar “${selected?.codigo ?? ""}”? Esta acción no se puede deshacer.`}
                pending={deleteMutation.isPending}
                onConfirm={() => {
                    if (selected) {
                        deleteMutation.mutate(selected.id)
                    }
                }}
            />

            <ConfirmDialog
                open={releaseOpen}
                onOpenChange={setReleaseOpen}
                title="Liberar encomienda"
                description={`La encomienda “${selected?.codigo ?? ""}” será retirada del vuelo ${selected?.vueloCodigo ?? ""} y regresará al almacén.`}
                confirmLabel="Liberar"
                pending={releaseMutation.isPending}
                onConfirm={() => {
                    if (selected) {
                        releaseMutation.mutate(selected.id)
                    }
                }}
            />
        </div>
    )
}