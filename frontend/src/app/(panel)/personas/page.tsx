"use client"

import {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    LoaderCircle,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    UsersRound,
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

import { DataPagination } from "@/components/shared/data-pagination"
import { DataToolbar } from "@/components/shared/data-toolbar"
import { PageHeader } from "@/components/shared/page-header"
import {
    TableEmpty,
    TableLoading,
} from "@/components/shared/table-states"
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
    ActualizarPersonaRequest,
    CrearPersonaRequest,
    PersonaResponse,
} from "@/types/api"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const schema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre es obligatorio.")
        .max(150, "Máximo 150 caracteres."),
    documento: z
        .string()
        .trim()
        .min(6, "El documento debe tener al menos 6 caracteres.")
        .max(20, "Máximo 20 caracteres."),
    telefono: z
        .string()
        .trim()
        .max(30, "Máximo 30 caracteres."),
    email: z
        .string()
        .trim()
        .refine(
            (value) => value === "" || emailRegex.test(value),
            "El correo no tiene un formato válido.",
        ),
    direccion: z
        .string()
        .trim()
        .max(250, "Máximo 250 caracteres."),
})

type PersonaFormValues = z.infer<typeof schema>

export default function PersonasPage() {
    const queryClient = useQueryClient()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selected, setSelected] =
        useState<PersonaResponse | null>(null)

    const query = useQuery({
        queryKey: ["personas"],
        queryFn: () =>
            apiFetch<PersonaResponse[]>("/Personas"),
    })

    const form = useForm<PersonaFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nombre: "",
            documento: "",
            telefono: "",
            email: "",
            direccion: "",
        },
    })

    useEffect(() => {
        if (!dialogOpen) return

        form.reset({
            nombre: selected?.nombre ?? "",
            documento: selected?.documento ?? "",
            telefono: selected?.telefono ?? "",
            email: selected?.email ?? "",
            direccion: selected?.direccion ?? "",
        })
    }, [dialogOpen, selected, form])

    const mutation = useMutation({
        mutationFn: (values: PersonaFormValues) => {
            if (selected) {
                const request: ActualizarPersonaRequest = {
                    nombre: values.nombre,
                    telefono: values.telefono || null,
                    email: values.email || null,
                    direccion: values.direccion || null,
                }

                return apiFetch<PersonaResponse>(
                    `/Personas/${selected.id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(request),
                    },
                )
            }

            const request: CrearPersonaRequest = {
                nombre: values.nombre,
                documento: values.documento,
                telefono: values.telefono || null,
                email: values.email || null,
                direccion: values.direccion || null,
            }

            return apiFetch<PersonaResponse>("/Personas", {
                method: "POST",
                body: JSON.stringify(request),
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["personas"],
            })

            sileo.success({
                title: selected
                    ? "Persona actualizada"
                    : "Persona registrada",
                description: "La información se guardó correctamente.",
            })

            setDialogOpen(false)
            setSelected(null)
        },
        onError: (error) => notifyError(error),
    })

    const filter = useCallback(
        (persona: PersonaResponse, search: string) =>
            persona.nombre.toLowerCase().includes(search) ||
            persona.documento.toLowerCase().includes(search) ||
            persona.email?.toLowerCase().includes(search) === true ||
            persona.telefono?.toLowerCase().includes(search) === true,
        [],
    )

    const pagination = useTablePagination({
        data: query.data ?? [],
        filter,
    })

    return (
        <div className="space-y-6">
            <PageHeader
                title="Personas"
                description="Administra remitentes y destinatarios."
                icon={UsersRound}
                actions={
                    <Button
                        onClick={() => {
                            setSelected(null)
                            setDialogOpen(true)
                        }}
                    >
                        <Plus />
                        Nueva persona
                    </Button>
                }
            />

            <Card className="overflow-hidden py-0">
                <DataToolbar
                    value={pagination.search}
                    onChange={pagination.setSearch}
                    placeholder="Buscar por nombre, documento o contacto..."
                />

                <CardContent className="p-0">
                    {query.isLoading ? (
                        <TableLoading />
                    ) : pagination.paginatedData.length === 0 ? (
                        <TableEmpty message="No se encontraron personas." />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Persona</TableHead>
                                        <TableHead>Contacto</TableHead>
                                        <TableHead>Dirección</TableHead>
                                        <TableHead className="w-24 text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pagination.paginatedData.map((persona) => (
                                        <TableRow key={persona.id}>
                                            <TableCell className="pl-6">
                                                <div>
                                                    <p className="font-medium">
                                                        {persona.nombre}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Documento: {persona.documento}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <div className="space-y-1.5 text-sm">
                                                    <p className="flex items-center gap-2">
                                                        <Phone className="size-3.5 text-muted-foreground" />
                                                        {persona.telefono ?? "Sin teléfono"}
                                                    </p>

                                                    <p className="flex items-center gap-2">
                                                        <Mail className="size-3.5 text-muted-foreground" />
                                                        {persona.email ?? "Sin correo"}
                                                    </p>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <p className="flex max-w-72 items-start gap-2 text-sm">
                                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                                    {persona.direccion ?? "Sin dirección"}
                                                </p>
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelected(persona)
                                                            setDialogOpen(true)
                                                        }}
                                                    >
                                                        <Pencil className="size-4" />
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
                    if (!mutation.isPending) {
                        setDialogOpen(open)

                        if (!open) setSelected(null)
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selected ? "Editar persona" : "Nueva persona"}
                        </DialogTitle>

                        <DialogDescription>
                            Registra los datos del remitente o destinatario.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="persona-form"
                        className="grid gap-5 py-2 sm:grid-cols-2"
                        onSubmit={form.handleSubmit((values) =>
                            mutation.mutate(values),
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
                                        Nombre completo
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Nombre y apellidos"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="documento"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Documento
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        disabled={Boolean(selected)}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="DNI, CE o pasaporte"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="telefono"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Teléfono
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="+51 999 999 999"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Correo electrónico
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="correo@ejemplo.com"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="direccion"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Dirección
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Dirección de residencia"
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
                            disabled={mutation.isPending}
                            onClick={() => setDialogOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="persona-form"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}