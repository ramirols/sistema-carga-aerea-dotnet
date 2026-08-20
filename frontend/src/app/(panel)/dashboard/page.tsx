"use client"

import {
    MapPinned,
    Package,
    Plane,
    TrendingUp,
    UsersRound,
    Weight,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api/client"
import {
    formatDate,
    formatTime,
    formatWeight,
} from "@/lib/formatters"
import type {
    DestinoResponse,
    EncomiendaResponse,
    PersonaResponse,
    VueloResponse,
} from "@/types/api"

const PIE_COLORS = [
    "#2563eb",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
]

function getFlightBadgeVariant(
    estado: string,
): "default" | "secondary" | "destructive" | "outline" {
    const normalized = estado.toLowerCase()

    if (normalized.includes("cancel")) {
        return "destructive"
    }

    if (
        normalized.includes("vuelo") ||
        normalized.includes("aterr")
    ) {
        return "default"
    }

    return "secondary"
}

export default function DashboardPage() {
    const vuelosQuery = useQuery({
        queryKey: ["vuelos"],
        queryFn: () => apiFetch<VueloResponse[]>("/Vuelos"),
    })

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

    const destinosQuery = useQuery({
        queryKey: ["destinos"],
        queryFn: () =>
            apiFetch<DestinoResponse[]>("/Destinos"),
    })

    const vuelos = vuelosQuery.data ?? []
    const encomiendas = encomiendasQuery.data ?? []

    const loading =
        vuelosQuery.isLoading ||
        encomiendasQuery.isLoading ||
        personasQuery.isLoading ||
        destinosQuery.isLoading

    const totalPesoAsignado = vuelos.reduce(
        (total, vuelo) => total + vuelo.pesoAsignado,
        0,
    )

    const totalPesoMaximo = vuelos.reduce(
        (total, vuelo) => total + vuelo.pesoMaximo,
        0,
    )

    const porcentajeOcupacion =
        totalPesoMaximo > 0
            ? (totalPesoAsignado / totalPesoMaximo) * 100
            : 0

    const vuelosProgramados = vuelos.filter((vuelo) =>
        vuelo.estado.toLowerCase().includes("programado"),
    ).length

    const vuelosChartData = vuelos.slice(0, 8).map((vuelo) => ({
        codigo: vuelo.codigoVuelo,
        asignado: vuelo.pesoAsignado,
        disponible: vuelo.pesoDisponible,
    }))

    const estadosMap = encomiendas.reduce<
        Record<string, number>
    >((accumulator, encomienda) => {
        accumulator[encomienda.estado] =
            (accumulator[encomienda.estado] ?? 0) + 1

        return accumulator
    }, {})

    const encomiendasChartData = Object.entries(estadosMap).map(
        ([name, value]) => ({
            name,
            value,
        }),
    )

    const recentFlights = [...vuelos]
        .sort((a, b) =>
            `${b.fechaVuelo}${b.horaVuelo}`.localeCompare(
                `${a.fechaVuelo}${a.horaVuelo}`,
            ),
        )
        .slice(0, 5)

    const cards = [
        {
            title: "Vuelos registrados",
            value: vuelos.length,
            description: `${vuelosProgramados} programados`,
            icon: Plane,
            iconClassName: "bg-blue-100 text-blue-700",
        },
        {
            title: "Encomiendas",
            value: encomiendas.length,
            description: "Registros totales",
            icon: Package,
            iconClassName: "bg-amber-100 text-amber-700",
        },
        {
            title: "Personas",
            value: personasQuery.data?.length ?? 0,
            description: "Remitentes y destinatarios",
            icon: UsersRound,
            iconClassName: "bg-emerald-100 text-emerald-700",
        },
        {
            title: "Destinos",
            value: destinosQuery.data?.length ?? 0,
            description: "Destinos disponibles",
            icon: MapPinned,
            iconClassName: "bg-violet-100 text-violet-700",
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Resumen operacional
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Consulta el estado general de los vuelos y la carga.
                    </p>
                </div>

                <Badge
                    variant="outline"
                    className="w-fit gap-2 rounded-full px-3 py-1.5"
                >
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Sistema operativo
                </Badge>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon

                    return (
                        <Card key={card.title} className="shadow-sm">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                                <div>
                                    <CardDescription>{card.title}</CardDescription>

                                    {loading ? (
                                        <Skeleton className="mt-3 h-9 w-20" />
                                    ) : (
                                        <CardTitle className="mt-2 text-3xl">
                                            {card.value}
                                        </CardTitle>
                                    )}
                                </div>

                                <div
                                    className={`flex size-11 items-center justify-center rounded-2xl ${card.iconClassName}`}
                                >
                                    <Icon className="size-5" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">
                                    Capacidad por vuelo
                                </CardTitle>
                                <CardDescription>
                                    Peso asignado y disponible en kilogramos.
                                </CardDescription>
                            </div>

                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                                <Weight className="size-5" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-80 w-full" />
                        ) : vuelosChartData.length === 0 ? (
                            <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                                No existen vuelos para mostrar.
                            </div>
                        ) : (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={vuelosChartData}
                                        margin={{
                                            top: 10,
                                            right: 10,
                                            left: -10,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="#e2e8f0"
                                        />

                                        <XAxis
                                            dataKey="codigo"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12 }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12 }}
                                        />

                                        <Tooltip
                                            cursor={{ fill: "#f8fafc" }}
                                            formatter={(value) =>
                                                `${Number(value).toFixed(2)} kg`
                                            }
                                        />

                                        <Legend />

                                        <Bar
                                            dataKey="asignado"
                                            name="Peso asignado"
                                            fill="#2563eb"
                                            radius={[6, 6, 0, 0]}
                                        />

                                        <Bar
                                            dataKey="disponible"
                                            name="Peso disponible"
                                            fill="#bae6fd"
                                            radius={[6, 6, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Estados de encomiendas
                        </CardTitle>
                        <CardDescription>
                            Distribución actual de los registros.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-80 w-full" />
                        ) : encomiendasChartData.length === 0 ? (
                            <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
                                No existen encomiendas.
                            </div>
                        ) : (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={encomiendasChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={58}
                                            outerRadius={92}
                                            paddingAngle={3}
                                        >
                                            {encomiendasChartData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={
                                                            PIE_COLORS[
                                                            index % PIE_COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <TrendingUp className="size-5" />
                            </div>

                            <div>
                                <CardTitle className="text-lg">
                                    Ocupación general
                                </CardTitle>
                                <CardDescription>
                                    Capacidad utilizada.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-32 w-full" />
                        ) : (
                            <>
                                <p className="text-4xl font-semibold">
                                    {porcentajeOcupacion.toFixed(1)}%
                                </p>

                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                                        style={{
                                            width: `${Math.min(
                                                porcentajeOcupacion,
                                                100,
                                            )}%`,
                                        }}
                                    />
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Asignado
                                        </p>
                                        <p className="mt-1 text-sm font-semibold">
                                            {formatWeight(totalPesoAsignado)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Capacidad total
                                        </p>
                                        <p className="mt-1 text-sm font-semibold">
                                            {formatWeight(totalPesoMaximo)}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Últimos vuelos
                        </CardTitle>
                        <CardDescription>
                            Vuelos ordenados por fecha y hora.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">Código</TableHead>
                                        <TableHead>Destino</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={4}>
                                                    <Skeleton className="h-8 w-full" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : recentFlights.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-28 text-center text-muted-foreground"
                                            >
                                                No existen vuelos registrados.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentFlights.map((vuelo) => (
                                            <TableRow key={vuelo.id}>
                                                <TableCell className="pl-6 font-medium">
                                                    {vuelo.codigoVuelo}
                                                </TableCell>

                                                <TableCell>{vuelo.destino}</TableCell>

                                                <TableCell>
                                                    <p>{formatDate(vuelo.fechaVuelo)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatTime(vuelo.horaVuelo)}
                                                    </p>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={getFlightBadgeVariant(
                                                            vuelo.estado,
                                                        )}
                                                    >
                                                        {vuelo.estado}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}