import Link from "next/link"
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    CircleGauge,
    Clock3,
    CloudCog,
    MapPinned,
    PackageCheck,
    Plane,
    Route,
    ShieldCheck,
    UsersRound,
    Weight,
} from "lucide-react"

const services = [
    {
        icon: Plane,
        title: "Gestión de vuelos",
        description:
            "Programa, actualiza, inicia, aterriza o cancela vuelos desde una plataforma centralizada.",
    },
    {
        icon: PackageCheck,
        title: "Control de encomiendas",
        description:
            "Registra y asigna encomiendas respetando automáticamente la capacidad disponible.",
    },
    {
        icon: Weight,
        title: "Control de peso",
        description:
            "Visualiza el peso máximo, asignado y disponible de cada vuelo en tiempo real.",
    },
]

const steps = [
    {
        number: "01",
        title: "Registro",
        description:
            "Se registran personas, destinos, vuelos y encomiendas.",
    },
    {
        number: "02",
        title: "Asignación",
        description:
            "Las encomiendas se asignan según la capacidad del vuelo.",
    },
    {
        number: "03",
        title: "Seguimiento",
        description:
            "El personal supervisa estados y operaciones desde el panel.",
    },
    {
        number: "04",
        title: "Finalización",
        description:
            "El vuelo aterriza y el proceso queda actualizado.",
    },
]

const benefits = [
    "Información centralizada",
    "Menos errores operativos",
    "Control de capacidad",
    "Acceso protegido por roles",
    "Seguimiento de estados",
    "Interfaz adaptable a celulares",
]

export default function LandingPage() {
    return (
        <main>
            <section
                id="inicio"
                className="relative flex min-h-screen items-center overflow-hidden bg-slate-950 pt-18 text-white"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.35),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(14,165,233,0.20),transparent_32%)]" />

                <div className="absolute right-[-10%] top-[18%] size-[560px] rounded-full border border-white/5" />
                <div className="absolute right-[-5%] top-[25%] size-[420px] rounded-full border border-white/5" />

                <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                            <CircleGauge className="size-4" />
                            Gestión aérea centralizada
                        </div>

                        <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                            Controla cada operación de carga aérea con precisión.
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                            Administra vuelos, destinos, personas y encomiendas
                            desde una plataforma rápida, segura y fácil de usar.
                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/login"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500"
                            >
                                Ingresar al sistema
                                <ArrowRight className="size-4" />
                            </Link>

                            <Link
                                href="#servicios"
                                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Conocer la plataforma
                            </Link>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-400">
                            <p className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-blue-400" />
                                Acceso seguro
                            </p>

                            <p className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-blue-400" />
                                Información actualizada
                            </p>

                            <p className="flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-blue-400" />
                                Diseño responsive
                            </p>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-xl">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div>
                                    <p className="text-sm font-medium">
                                        Resumen operacional
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Información en tiempo real
                                    </p>
                                </div>

                                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                                    Operativo
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-2 gap-4">
                                {[
                                    ["Vuelos activos", "12", Plane],
                                    ["Encomiendas", "248", PackageCheck],
                                    ["Capacidad", "82%", Weight],
                                    ["Destinos", "16", MapPinned],
                                ].map(([label, value, Icon]) => (
                                    <div
                                        key={label as string}
                                        className="rounded-2xl border border-white/10 bg-slate-950/35 p-5"
                                    >
                                        <Icon className="size-5 text-blue-400" />
                                        <p className="mt-5 text-3xl font-semibold">
                                            {value as string}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {label as string}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Capacidad utilizada</p>
                                    <p className="text-sm font-semibold text-blue-300">
                                        82%
                                    </p>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b bg-white">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
                    {[
                        ["100%", "Control centralizado"],
                        ["24/7", "Disponibilidad"],
                        ["2", "Roles de acceso"],
                        ["+99%", "Trazabilidad operativa"],
                    ].map(([value, label]) => (
                        <div key={label} className="text-center">
                            <p className="text-3xl font-semibold text-blue-600">
                                {value}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="servicios" className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                            Servicios
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                            Todo lo necesario para controlar la operación.
                        </h2>

                        <p className="mt-5 leading-7 text-slate-600">
                            Cada módulo se encuentra conectado para mantener la
                            información consistente durante todo el proceso.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-6 md:grid-cols-3">
                        {services.map((service) => {
                            const Icon = service.icon

                            return (
                                <article
                                    key={service.title}
                                    className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                        <Icon className="size-6" />
                                    </div>

                                    <h3 className="mt-6 text-xl font-semibold">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-600">
                                        {service.description}
                                    </p>
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section id="proceso" className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                                Proceso
                            </p>

                            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                                Un flujo sencillo y controlado.
                            </h2>

                            <p className="mt-5 leading-7 text-slate-600">
                                El sistema acompaña la operación desde el registro
                                inicial hasta el aterrizaje del vuelo.
                            </p>

                            <Route className="mt-10 size-24 text-blue-100" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {steps.map((step) => (
                                <article
                                    key={step.number}
                                    className="rounded-3xl border border-slate-200 p-7"
                                >
                                    <p className="text-sm font-semibold text-blue-600">
                                        {step.number}
                                    </p>
                                    <h3 className="mt-4 text-xl font-semibold">
                                        {step.title}
                                    </h3>
                                    <p className="mt-3 leading-7 text-slate-600">
                                        {step.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="tecnologia"
                className="overflow-hidden bg-slate-950 py-24 text-white"
            >
                <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            [ShieldCheck, "Acceso JWT", "Autenticación segura"],
                            [CloudCog, "API central", "Información conectada"],
                            [BarChart3, "Indicadores", "Decisiones rápidas"],
                            [Clock3, "Tiempo real", "Estados actualizados"],
                        ].map(([Icon, title, description]) => (
                            <div
                                key={title as string}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6"
                            >
                                <Icon className="size-6 text-blue-400" />
                                <p className="mt-5 font-semibold">{title as string}</p>
                                <p className="mt-2 text-sm text-slate-400">
                                    {description as string}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                            Tecnología
                        </p>

                        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                            Información segura, consistente y disponible.
                        </h2>

                        <p className="mt-6 leading-8 text-slate-300">
                            La plataforma combina una API desarrollada en .NET,
                            autenticación JWT y una interfaz moderna desarrollada
                            con Next.js.
                        </p>

                        <div className="mt-8 space-y-4">
                            {[
                                "Sesiones protegidas mediante cookies HttpOnly",
                                "Operaciones autorizadas según el rol",
                                "Validación tanto en frontend como backend",
                                "Manejo centralizado de errores",
                            ].map((item) => (
                                <p
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-slate-300"
                                >
                                    <CheckCircle2 className="size-5 text-emerald-400" />
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="beneficios" className="bg-slate-50 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid items-center gap-14 lg:grid-cols-2">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                                Beneficios
                            </p>

                            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                                Mayor control con menos trabajo manual.
                            </h2>

                            <p className="mt-5 max-w-xl leading-7 text-slate-600">
                                Una vista completa de la operación ayuda a reducir
                                errores y agilizar la gestión diaria.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit}
                                    className="flex items-center gap-3 rounded-2xl border bg-white p-5 shadow-sm"
                                >
                                    <CheckCircle2 className="size-5 shrink-0 text-blue-600" />
                                    <p className="font-medium text-slate-700">
                                        {benefit}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="contacto" className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 px-6 py-16 text-center text-white sm:px-12">
                        <div className="absolute -left-24 -top-24 size-72 rounded-full bg-cyan-400/10 blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-blue-400/20 blur-3xl" />

                        <div className="relative mx-auto max-w-2xl">
                            <UsersRound className="mx-auto size-10 text-blue-200" />

                            <h2 className="mt-6 text-4xl font-semibold tracking-tight">
                                Accede a la gestión completa de tus operaciones.
                            </h2>

                            <p className="mt-5 leading-7 text-blue-100">
                                Inicia sesión con tus credenciales y administra toda
                                la información desde el panel principal.
                            </p>

                            <Link
                                href="/login"
                                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                            >
                                Iniciar sesión
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}