"use client"

import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"
import {
    CalendarClock,
    CirclePlay,
    CircleX,
    EllipsisVertical,
    Gauge,
    LoaderCircle,
    PackagePlus,
    Pencil,
    Plane,
    PlaneLanding,
    Plus,
    Search,
    Trash2,
} from "lucide-react"
import { sileo } from "sileo"
import { z } from "zod"

import { apiFetch } from "@/lib/api/client"
import { formatDate, formatTime, formatWeight } from "@/lib/formatters"
import { notifyError } from "@/lib/notify-error"
import type {
    AsignarEncomiendasRequest,
    DestinoResponse,
    EncomiendaResponse,
    VueloRequest,
    VueloResponse,
} from "@/types/api"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const vueloSchema = z.object({
    codigoVuelo: z
        .string()
        .trim()
        .min(1, "El código del vuelo es obligatorio.")
        .max(10, "El código no puede superar los 10 caracteres."),
    destinoId: z
        .number()
        .int()
        .min(1, "Debe seleccionar un destino."),
    fechaVuelo: z
        .string()
        .min(1, "La fecha del vuelo es obligatoria."),
    horaVuelo: z
        .string()
        .min(1, "La hora del vuelo es obligatoria."),
    pesoMaximo: z
        .number()
        .positive("El peso máximo debe ser mayor que cero."),
})

type VueloFormValues = z.infer<typeof vueloSchema>

type FlightAction =
    | "iniciar"
    | "aterrizar"
    | "cancelar"
    | "eliminar"

interface ConfirmationState {
    vuelo: VueloResponse
    action: FlightAction
    title: string
    description: string
    confirmLabel: string
    destructive?: boolean
}

const PAGE_SIZE = 8

const defaultValues: VueloFormValues = {
    codigoVuelo: "",
    destinoId: 0,
    fechaVuelo: "",
    horaVuelo: "",
    pesoMaximo: 0,
}

function normalize(value: string) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase()
}

function isProgramado(vuelo: VueloResponse) {
    return normalize(vuelo.estado) === "programado"
}

function isEnVuelo(vuelo: VueloResponse) {
    return normalize(vuelo.estado) === "envuelo"
}

function getStatusClasses(estado: string) {
    switch (normalize(estado)) {
        case "programado":
            return "border-blue-200 bg-blue-50 text-blue-700"
        case "envuelo":
            return "border-amber-200 bg-amber-50 text-amber-700"
        case "aterrizado":
            return "border-emerald-200 bg-emerald-50 text-emerald-700"
        case "cancelado":
            return "border-red-200 bg-red-50 text-red-700"
        default:
            return "border-slate-200 bg-slate-50 text-slate-700"
    }
}

function getCapacityPercentage(vuelo: VueloResponse) {
    if (vuelo.pesoMaximo <= 0) return 0

    return Math.min(
        100,
        Math.max(0, (vuelo.pesoAsignado / vuelo.pesoMaximo) * 100),
    )
}

function CapacityBar({
    percentage,
    warning = false,
}: {
    percentage: number
    warning?: boolean
}) {
    return (
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
                className={
                    warning
                        ? "h-full rounded-full bg-red-500 transition-all"
                        : percentage >= 85
                            ? "h-full rounded-full bg-amber-500 transition-all"
                            : "h-full rounded-full bg-blue-600 transition-all"
                }
                style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
        </div>
    )
}

function SummaryCard({
    title,
    value,
    description,
    icon: Icon,
    iconClassName,
}: {
    title: string
    value: string | number
    description: string
    icon: typeof Plane
    iconClassName: string
}) {
    return (
        <Card className="shadow-none">
            <CardContent className="flex items-start justify-between p-5">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight">
                        {value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex size-10 items-center justify-center rounded-xl ${iconClassName}`}
                >
                    <Icon className="size-5" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function VuelosPage() {
    const queryClient = useQueryClient()

    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)

    const [formOpen, setFormOpen] = useState(false)
    const [editingFlight, setEditingFlight] =
        useState<VueloResponse | null>(null)

    const [assigningFlight, setAssigningFlight] =
        useState<VueloResponse | null>(null)
    const [assignmentSearch, setAssignmentSearch] = useState("")
    const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([])

    const [confirmation, setConfirmation] =
        useState<ConfirmationState | null>(null)

    const form = useForm<VueloFormValues>({
        resolver: zodResolver(vueloSchema),
        defaultValues,
    })

    const vuelosQuery = useQuery({
        queryKey: ["vuelos"],
        queryFn: () => apiFetch<VueloResponse[]>("/Vuelos"),
    })

    const destinosQuery = useQuery({
        queryKey: ["destinos"],
        queryFn: () => apiFetch<DestinoResponse[]>("/Destinos"),
    })

    const encomiendasQuery = useQuery({
        queryKey: ["encomiendas"],
        queryFn: () => apiFetch<EncomiendaResponse[]>("/Encomiendas"),
    })

    const vuelos = vuelosQuery.data ?? []
    const destinos = destinosQuery.data ?? []
    const encomiendas = encomiendasQuery.data ?? []

    const filteredFlights = useMemo(() => {
        const term = normalize(search)

        if (!term) return vuelos

        return vuelos.filter((vuelo: any) => {
            return (
                normalize(vuelo.codigoVuelo).includes(term) ||
                normalize(vuelo.destino).includes(term) ||
                normalize(vuelo.estado).includes(term) ||
                normalize(vuelo.fechaVuelo).includes(term)
            )
        })
    }, [search, vuelos])

    const totalPages = Math.max(
        1,
        Math.ceil(filteredFlights.length / PAGE_SIZE),
    )

    const currentPage = Math.min(page, totalPages)

    const paginatedFlights = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE
        return filteredFlights.slice(start, start + PAGE_SIZE)
    }, [currentPage, filteredFlights])

    const availablePackages = useMemo(() => {
        return encomiendas.filter((encomienda: any) => {
            const estado = normalize(encomienda.estado)

            return (
                encomienda.vueloId == null &&
                (estado === "enalmacen" || estado.includes("almacen"))
            )
        })
    }, [encomiendas])

    const filteredAvailablePackages = useMemo(() => {
        const term = normalize(assignmentSearch)

        if (!term) return availablePackages

        return availablePackages.filter((encomienda: any) => {
            return (
                normalize(encomienda.codigo).includes(term) ||
                normalize(encomienda.descripcion).includes(term) ||
                normalize(encomienda.remitente).includes(term) ||
                normalize(encomienda.destinatario).includes(term)
            )
        })
    }, [assignmentSearch, availablePackages])

    const selectedWeight = useMemo(() => {
        const selected = new Set(selectedPackageIds)

        return availablePackages.reduce((total: any, encomienda: any) => {
            return selected.has(encomienda.id)
                ? total + encomienda.peso
                : total
        }, 0)
    }, [availablePackages, selectedPackageIds])

    const projectedWeight = assigningFlight
        ? assigningFlight.pesoAsignado + selectedWeight
        : 0

    const projectedPercentage = assigningFlight
        ? Math.min(
            100,
            (projectedWeight / assigningFlight.pesoMaximo) * 100,
        )
        : 0

    const exceedsCapacity = assigningFlight
        ? selectedWeight > assigningFlight.pesoDisponible
        : false

    const saveMutation = useMutation({
        mutationFn: async (values: VueloFormValues) => {
            const request: VueloRequest = {
                ...values,
                codigoVuelo: values.codigoVuelo.trim().toUpperCase(),
                horaVuelo:
                    values.horaVuelo.length === 5
                        ? `${values.horaVuelo}:00`
                        : values.horaVuelo,
            }

            if (editingFlight) {
                return apiFetch<VueloResponse>(
                    `/Vuelos/${editingFlight.id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(request),
                    },
                )
            }

            return apiFetch<VueloResponse>("/Vuelos", {
                method: "POST",
                body: JSON.stringify(request),
            })
        },
        onSuccess: async () => {
            sileo.success({
                title: editingFlight
                    ? "Vuelo actualizado"
                    : "Vuelo creado",
                description: editingFlight
                    ? "Los datos del vuelo fueron actualizados."
                    : "El vuelo fue registrado correctamente.",
            })

            setFormOpen(false)
            setEditingFlight(null)
            form.reset(defaultValues)

            await queryClient.invalidateQueries({
                queryKey: ["vuelos"],
            })
        },
        onError: notifyError,
    })

    const actionMutation = useMutation({
        mutationFn: async ({
            vuelo,
            action,
        }: {
            vuelo: VueloResponse
            action: FlightAction
        }) => {
            if (action === "eliminar") {
                return apiFetch<void>(`/Vuelos/${vuelo.id}`, {
                    method: "DELETE",
                })
            }

            return apiFetch<VueloResponse>(
                `/Vuelos/${vuelo.id}/${action}`,
                {
                    method: "POST",
                },
            )
        },
        onSuccess: async (_, variables) => {
            const messages: Record<FlightAction, string> = {
                iniciar: "El vuelo fue iniciado correctamente.",
                aterrizar: "El vuelo fue marcado como aterrizado.",
                cancelar: "El vuelo fue cancelado.",
                eliminar: "El vuelo fue eliminado.",
            }

            sileo.success({
                title: "Operación completada",
                description: messages[variables.action],
            })

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["vuelos"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["encomiendas"],
                }),
            ])
        },
        onError: notifyError,
    })

    const assignMutation = useMutation({
        mutationFn: async ({
            flightId,
            packageIds,
        }: {
            flightId: number
            packageIds: number[]
        }) => {
            const request: AsignarEncomiendasRequest = {
                encomiendaIds: packageIds,
            }

            return apiFetch<VueloResponse>(
                `/Vuelos/${flightId}/encomiendas`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                },
            )
        },
        onSuccess: async () => {
            sileo.success({
                title: "Encomiendas asignadas",
                description:
                    "La carga seleccionada fue agregada al vuelo.",
            })

            setAssigningFlight(null)
            setSelectedPackageIds([])
            setAssignmentSearch("")

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["vuelos"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["encomiendas"],
                }),
            ])
        },
        onError: notifyError,
    })

    function openCreateDialog() {
        setEditingFlight(null)
        form.reset(defaultValues)
        setFormOpen(true)
    }

    function openEditDialog(vuelo: VueloResponse) {
        setEditingFlight(vuelo)

        form.reset({
            codigoVuelo: vuelo.codigoVuelo,
            destinoId: vuelo.destinoId,
            fechaVuelo: vuelo.fechaVuelo,
            horaVuelo: vuelo.horaVuelo.slice(0, 5),
            pesoMaximo: vuelo.pesoMaximo,
        })

        setFormOpen(true)
    }

    function openAssignmentDialog(vuelo: VueloResponse) {
        setAssigningFlight(vuelo)
        setSelectedPackageIds([])
        setAssignmentSearch("")
    }

    function togglePackage(id: number, checked: boolean) {
        setSelectedPackageIds((current) => {
            if (checked) {
                return current.includes(id) ? current : [...current, id]
            }

            return current.filter((packageId) => packageId !== id)
        })
    }

    function requestAction(
        vuelo: VueloResponse,
        action: FlightAction,
    ) {
        const configurations: Record<
            FlightAction,
            Omit<ConfirmationState, "vuelo" | "action">
        > = {
            iniciar: {
                title: "¿Iniciar el vuelo?",
                description: `El vuelo ${vuelo.codigoVuelo} cambiará al estado En vuelo.`,
                confirmLabel: "Iniciar vuelo",
            },
            aterrizar: {
                title: "¿Registrar el aterrizaje?",
                description: `El vuelo ${vuelo.codigoVuelo} se marcará como aterrizado.`,
                confirmLabel: "Registrar aterrizaje",
            },
            cancelar: {
                title: "¿Cancelar el vuelo?",
                description:
                    "Esta operación cancelará el vuelo y podría afectar las encomiendas asignadas.",
                confirmLabel: "Cancelar vuelo",
                destructive: true,
            },
            eliminar: {
                title: "¿Eliminar el vuelo?",
                description:
                    "El vuelo será eliminado permanentemente. Esta acción no se puede deshacer.",
                confirmLabel: "Eliminar vuelo",
                destructive: true,
            },
        }

        setConfirmation({
            vuelo,
            action,
            ...configurations[action],
        })
    }

    function confirmAction() {
        if (!confirmation) return

        const data = {
            vuelo: confirmation.vuelo,
            action: confirmation.action,
        }

        setConfirmation(null)
        actionMutation.mutate(data)
    }

    function submitAssignment() {
        if (
            !assigningFlight ||
            selectedPackageIds.length === 0 ||
            exceedsCapacity
        ) {
            return
        }

        assignMutation.mutate({
            flightId: assigningFlight.id,
            packageIds: selectedPackageIds,
        })
    }

    const programmedCount = vuelos.filter(isProgramado).length
    const flyingCount = vuelos.filter(isEnVuelo).length
    const totalAssignedWeight = vuelos.reduce(
        (total, vuelo) => total + vuelo.pesoAsignado,
        0,
    )

    return (
        <div className="space-y-6">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="mb-1 flex items-center gap-2 text-sm text-blue-600">
                        <Plane className="size-4" />
                        Operaciones aéreas
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                        Vuelos
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Programa vuelos, administra su carga y controla el
                        ciclo operativo.
                    </p>
                </div>

                <Button
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={openCreateDialog}
                >
                    <Plus className="size-4" />
                    Nuevo vuelo
                </Button>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total de vuelos"
                    value={vuelos.length}
                    description="Vuelos registrados"
                    icon={Plane}
                    iconClassName="bg-blue-50 text-blue-600"
                />

                <SummaryCard
                    title="Programados"
                    value={programmedCount}
                    description="Pendientes de iniciar"
                    icon={CalendarClock}
                    iconClassName="bg-violet-50 text-violet-600"
                />

                <SummaryCard
                    title="En vuelo"
                    value={flyingCount}
                    description="Operaciones activas"
                    icon={CirclePlay}
                    iconClassName="bg-amber-50 text-amber-600"
                />

                <SummaryCard
                    title="Carga asignada"
                    value={formatWeight(totalAssignedWeight)}
                    description="Peso total programado"
                    icon={Gauge}
                    iconClassName="bg-emerald-50 text-emerald-600"
                />
            </section>

            <Card className="overflow-hidden shadow-none">
                <CardHeader className="border-b bg-white">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <CardTitle className="text-base">
                                Programación de vuelos
                            </CardTitle>

                            <CardDescription>
                                {filteredFlights.length} resultado
                                {filteredFlights.length === 1 ? "" : "s"}
                            </CardDescription>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value)
                                    setPage(1)
                                }}
                                placeholder="Buscar código, destino o estado..."
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {vuelosQuery.isError ? (
                        <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                            <CircleX className="mb-3 size-10 text-red-500" />

                            <p className="font-medium">
                                No fue posible cargar los vuelos
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Verifica la conexión con el backend e inténtalo
                                nuevamente.
                            </p>

                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => void vuelosQuery.refetch()}
                            >
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/70">
                                            <TableHead>Vuelo</TableHead>
                                            <TableHead>Destino</TableHead>
                                            <TableHead>Salida</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="min-w-56">
                                                Capacidad
                                            </TableHead>
                                            <TableHead className="w-14">
                                                <span className="sr-only">
                                                    Acciones
                                                </span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {vuelosQuery.isLoading &&
                                            Array.from({ length: 6 }).map((_, index) => (
                                                <TableRow key={index}>
                                                    {Array.from({ length: 6 }).map(
                                                        (_, cellIndex) => (
                                                            <TableCell key={cellIndex}>
                                                                <Skeleton className="h-5 w-full max-w-32" />
                                                            </TableCell>
                                                        ),
                                                    )}
                                                </TableRow>
                                            ))}

                                        {!vuelosQuery.isLoading &&
                                            paginatedFlights.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={6}
                                                        className="h-64 text-center"
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <Plane className="mb-3 size-10 text-slate-300" />

                                                            <p className="font-medium">
                                                                No se encontraron vuelos
                                                            </p>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                Cambia la búsqueda o registra un
                                                                nuevo vuelo.
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}

                                        {!vuelosQuery.isLoading &&
                                            paginatedFlights.map((vuelo) => {
                                                const percentage =
                                                    getCapacityPercentage(vuelo)
                                                const programmed = isProgramado(vuelo)
                                                const flying = isEnVuelo(vuelo)

                                                return (
                                                    <TableRow key={vuelo.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                                    <Plane className="size-4" />
                                                                </div>

                                                                <div>
                                                                    <p className="font-semibold text-slate-950">
                                                                        {vuelo.codigoVuelo}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        ID #{vuelo.id}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <p className="font-medium">
                                                                {vuelo.destino}
                                                            </p>
                                                        </TableCell>

                                                        <TableCell>
                                                            <p className="font-medium">
                                                                {formatDate(vuelo.fechaVuelo)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatTime(vuelo.horaVuelo)}
                                                            </p>
                                                        </TableCell>

                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={getStatusClasses(
                                                                    vuelo.estado,
                                                                )}
                                                            >
                                                                {vuelo.estado}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between gap-4 text-xs">
                                                                    <span className="font-medium">
                                                                        {formatWeight(
                                                                            vuelo.pesoAsignado,
                                                                        )}
                                                                    </span>

                                                                    <span className="text-muted-foreground">
                                                                        de{" "}
                                                                        {formatWeight(
                                                                            vuelo.pesoMaximo,
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <CapacityBar
                                                                    percentage={percentage}
                                                                />

                                                                <p className="text-xs text-muted-foreground">
                                                                    {formatWeight(
                                                                        vuelo.pesoDisponible,
                                                                    )}{" "}
                                                                    disponibles
                                                                </p>
                                                            </div>
                                                        </TableCell>

                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    render={
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            aria-label={`Acciones de ${vuelo.codigoVuelo}`}
                                                                        />
                                                                    }
                                                                >
                                                                    <EllipsisVertical className="size-4" />
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="w-56"
                                                                >
                                                                    <DropdownMenuLabel>
                                                                        Gestionar vuelo
                                                                    </DropdownMenuLabel>

                                                                    <DropdownMenuItem
                                                                        disabled={!programmed}
                                                                        onClick={() =>
                                                                            openEditDialog(vuelo)
                                                                        }
                                                                    >
                                                                        <Pencil className="size-4" />
                                                                        Editar información
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        disabled={!programmed}
                                                                        onClick={() =>
                                                                            openAssignmentDialog(vuelo)
                                                                        }
                                                                    >
                                                                        <PackagePlus className="size-4" />
                                                                        Asignar encomiendas
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuSeparator />

                                                                    <DropdownMenuItem
                                                                        disabled={!programmed}
                                                                        onClick={() =>
                                                                            requestAction(
                                                                                vuelo,
                                                                                "iniciar",
                                                                            )
                                                                        }
                                                                    >
                                                                        <CirclePlay className="size-4 text-blue-600" />
                                                                        Iniciar vuelo
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        disabled={!flying}
                                                                        onClick={() =>
                                                                            requestAction(
                                                                                vuelo,
                                                                                "aterrizar",
                                                                            )
                                                                        }
                                                                    >
                                                                        <PlaneLanding className="size-4 text-emerald-600" />
                                                                        Registrar aterrizaje
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuItem
                                                                        disabled={!programmed}
                                                                        onClick={() =>
                                                                            requestAction(
                                                                                vuelo,
                                                                                "cancelar",
                                                                            )
                                                                        }
                                                                        className="text-amber-700"
                                                                    >
                                                                        <CircleX className="size-4" />
                                                                        Cancelar vuelo
                                                                    </DropdownMenuItem>

                                                                    <DropdownMenuSeparator />

                                                                    <DropdownMenuItem
                                                                        disabled={!programmed}
                                                                        onClick={() =>
                                                                            requestAction(
                                                                                vuelo,
                                                                                "eliminar",
                                                                            )
                                                                        }
                                                                        className="text-red-600 focus:text-red-600"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                    </TableBody>
                                </Table>
                            </div>

                            {!vuelosQuery.isLoading &&
                                filteredFlights.length > 0 && (
                                    <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row">
                                        <p className="text-sm text-muted-foreground">
                                            Mostrando{" "}
                                            {(currentPage - 1) * PAGE_SIZE + 1}–
                                            {Math.min(
                                                currentPage * PAGE_SIZE,
                                                filteredFlights.length,
                                            )}{" "}
                                            de {filteredFlights.length}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage <= 1}
                                                onClick={() =>
                                                    setPage((current) =>
                                                        Math.max(1, current - 1),
                                                    )
                                                }
                                            >
                                                Anterior
                                            </Button>

                                            <div className="flex h-8 min-w-20 items-center justify-center rounded-md border px-3 text-sm">
                                                {currentPage} de {totalPages}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={currentPage >= totalPages}
                                                onClick={() =>
                                                    setPage((current) =>
                                                        Math.min(
                                                            totalPages,
                                                            current + 1,
                                                        ),
                                                    )
                                                }
                                            >
                                                Siguiente
                                            </Button>
                                        </div>
                                    </div>
                                )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Crear o editar vuelo */}
            <Dialog
                open={formOpen}
                onOpenChange={(open) => {
                    if (saveMutation.isPending) return

                    setFormOpen(open)

                    if (!open) {
                        setEditingFlight(null)
                        form.reset(defaultValues)
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFlight ? "Editar vuelo" : "Nuevo vuelo"}
                        </DialogTitle>

                        <DialogDescription>
                            {editingFlight
                                ? "Actualiza la programación y capacidad del vuelo."
                                : "Registra la programación de un nuevo vuelo."}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="flight-form"
                        onSubmit={form.handleSubmit((values) =>
                            saveMutation.mutate(values),
                        )}
                    >
                        <FieldGroup className="grid gap-5 py-2 sm:grid-cols-2">
                            <Controller
                                control={form.control}
                                name="codigoVuelo"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Código de vuelo
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Ej. CA-102"
                                            maxLength={10}
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
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
                                control={form.control}
                                name="destinoId"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Destino</FieldLabel>

                                        <Select
                                            value={
                                                field.value > 0
                                                    ? String(field.value)
                                                    : ""
                                            }
                                            onValueChange={(value) =>
                                                field.onChange(Number(value))
                                            }
                                            disabled={destinosQuery.isLoading}
                                        >
                                            <SelectTrigger
                                                aria-invalid={fieldState.invalid}
                                            >
                                                <SelectValue placeholder="Seleccionar destino" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {destinos.map((destino) => (
                                                    <SelectItem
                                                        key={destino.id}
                                                        value={String(destino.id)}
                                                    >
                                                        {destino.codigoIATA} ·{" "}
                                                        {destino.nombre}
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
                                control={form.control}
                                name="fechaVuelo"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Fecha del vuelo
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="date"
                                            aria-invalid={fieldState.invalid}
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
                                control={form.control}
                                name="horaVuelo"
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Hora del vuelo
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="time"
                                            aria-invalid={fieldState.invalid}
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
                                control={form.control}
                                name="pesoMaximo"
                                render={({ field, fieldState }) => (
                                    <Field
                                        className="sm:col-span-2"
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            Capacidad máxima
                                        </FieldLabel>

                                        <div className="relative">
                                            <Input
                                                id={field.name}
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                value={
                                                    Number.isNaN(field.value)
                                                        ? ""
                                                        : field.value
                                                }
                                                onChange={(event) =>
                                                    field.onChange(
                                                        event.target.value === ""
                                                            ? Number.NaN
                                                            : event.target.valueAsNumber,
                                                    )
                                                }
                                                aria-invalid={fieldState.invalid}
                                                className="pr-12"
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                kg
                                            </span>
                                        </div>

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={saveMutation.isPending}
                            onClick={() => setFormOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="flight-form"
                            disabled={saveMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {saveMutation.isPending && (
                                <LoaderCircle className="size-4 animate-spin" />
                            )}

                            {editingFlight
                                ? "Guardar cambios"
                                : "Crear vuelo"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Asignar encomiendas */}
            <Dialog
                open={Boolean(assigningFlight)}
                onOpenChange={(open) => {
                    if (!open && !assignMutation.isPending) {
                        setAssigningFlight(null)
                        setSelectedPackageIds([])
                        setAssignmentSearch("")
                    }
                }}
            >
                <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            Asignar encomiendas
                        </DialogTitle>

                        <DialogDescription>
                            Selecciona la carga disponible para el vuelo{" "}
                            <strong>
                                {assigningFlight?.codigoVuelo}
                            </strong>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    {assigningFlight && (
                        <>
                            <div className="grid gap-3 rounded-xl border bg-slate-50 p-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Capacidad
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {formatWeight(
                                            assigningFlight.pesoMaximo,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Ya asignado
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {formatWeight(
                                            assigningFlight.pesoAsignado,
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Disponible
                                    </p>
                                    <p className="mt-1 font-semibold text-blue-700">
                                        {formatWeight(
                                            assigningFlight.pesoDisponible,
                                        )}
                                    </p>
                                </div>

                                <div className="space-y-2 sm:col-span-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span>
                                            Proyección:{" "}
                                            {formatWeight(projectedWeight)}
                                        </span>
                                        <span>
                                            {projectedPercentage.toFixed(0)}%
                                        </span>
                                    </div>

                                    <CapacityBar
                                        percentage={projectedPercentage}
                                        warning={exceedsCapacity}
                                    />

                                    <p
                                        className={
                                            exceedsCapacity
                                                ? "text-xs font-medium text-red-600"
                                                : "text-xs text-muted-foreground"
                                        }
                                    >
                                        Seleccionado:{" "}
                                        {formatWeight(selectedWeight)} · Restante:{" "}
                                        {formatWeight(
                                            assigningFlight.pesoDisponible -
                                            selectedWeight,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    value={assignmentSearch}
                                    onChange={(event) =>
                                        setAssignmentSearch(event.target.value)
                                    }
                                    placeholder="Buscar encomienda..."
                                    className="pl-9"
                                />
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border">
                                {encomiendasQuery.isLoading ? (
                                    <div className="space-y-3 p-4">
                                        {Array.from({ length: 4 }).map(
                                            (_, index) => (
                                                <Skeleton
                                                    key={index}
                                                    className="h-20 w-full"
                                                />
                                            ),
                                        )}
                                    </div>
                                ) : filteredAvailablePackages.length === 0 ? (
                                    <div className="flex min-h-52 flex-col items-center justify-center p-6 text-center">
                                        <PackagePlus className="mb-3 size-10 text-slate-300" />

                                        <p className="font-medium">
                                            No hay encomiendas disponibles
                                        </p>

                                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                            Las encomiendas deben encontrarse en almacén
                                            y no estar asignadas a otro vuelo.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {filteredAvailablePackages.map(
                                            (encomienda) => {
                                                const selected =
                                                    selectedPackageIds.includes(
                                                        encomienda.id,
                                                    )

                                                const wouldExceed =
                                                    !selected &&
                                                    selectedWeight +
                                                    encomienda.peso >
                                                    assigningFlight.pesoDisponible

                                                return (
                                                    <label
                                                        key={encomienda.id}
                                                        className={`flex cursor-pointer items-start gap-3 p-4 transition-colors ${selected
                                                            ? "bg-blue-50/70"
                                                            : "hover:bg-slate-50"
                                                            } ${wouldExceed
                                                                ? "cursor-not-allowed opacity-50"
                                                                : ""
                                                            }`}
                                                    >
                                                        <Checkbox
                                                            checked={selected}
                                                            disabled={
                                                                wouldExceed ||
                                                                assignMutation.isPending
                                                            }
                                                            onCheckedChange={(checked) =>
                                                                togglePackage(
                                                                    encomienda.id,
                                                                    checked === true,
                                                                )
                                                            }
                                                            className="mt-1"
                                                        />

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                                                                <p className="font-semibold">
                                                                    {encomienda.codigo}
                                                                </p>

                                                                <Badge variant="outline">
                                                                    {formatWeight(
                                                                        encomienda.peso,
                                                                    )}
                                                                </Badge>
                                                            </div>

                                                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                                                {encomienda.descripcion}
                                                            </p>

                                                            <p className="mt-2 text-xs text-muted-foreground">
                                                                {encomienda.remitente} →{" "}
                                                                {encomienda.destinatario}
                                                            </p>
                                                        </div>
                                                    </label>
                                                )
                                            },
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={assignMutation.isPending}
                            onClick={() => setAssigningFlight(null)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="button"
                            disabled={
                                assignMutation.isPending ||
                                selectedPackageIds.length === 0 ||
                                exceedsCapacity
                            }
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={submitAssignment}
                        >
                            {assignMutation.isPending ? (
                                <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                                <PackagePlus className="size-4" />
                            )}

                            Asignar {selectedPackageIds.length || ""}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmaciones operativas */}
            <AlertDialog
                open={Boolean(confirmation)}
                onOpenChange={(open) => {
                    if (!open) setConfirmation(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmation?.title}
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {confirmation?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Volver
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={confirmAction}
                            className={
                                confirmation?.destructive
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }
                        >
                            {confirmation?.confirmLabel}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}