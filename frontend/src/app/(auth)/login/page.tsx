"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Plane,
    UserRound,
} from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { sileo } from "sileo"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api/client"
import { useAuth } from "@/providers/auth-provider"

const loginSchema = z.object({
    nombreUsuario: z
        .string()
        .trim()
        .min(1, "Ingresa tu nombre de usuario."),
    password: z
        .string()
        .min(1, "Ingresa tu contraseña."),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()

    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            nombreUsuario: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginFormValues) {
        try {
            await login(values)

            sileo.success({
                title: "Bienvenido al sistema",
                description: "La sesión se inició correctamente.",
            })

            router.replace("/dashboard")
            router.refresh()
        } catch (error) {
            sileo.error({
                title: "No se pudo iniciar sesión",
                description:
                    error instanceof ApiError
                        ? error.message
                        : "Verifica tus credenciales e inténtalo nuevamente.",
            })
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.20),transparent_35%)]" />

            <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl shadow-blue-950/30 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
                <section className="hidden min-h-[620px] flex-col justify-between bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 p-12 text-white lg:flex">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
                            <Plane className="size-6" />
                        </div>

                        <div>
                            <p className="font-semibold">Carga Aérea</p>
                            <p className="text-sm text-blue-100">
                                Sistema de administración
                            </p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-blue-200">
                            Control centralizado
                        </p>

                        <h1 className="text-4xl font-semibold leading-tight">
                            Gestiona vuelos y encomiendas desde un solo lugar.
                        </h1>

                        <p className="mt-5 leading-7 text-blue-100/85">
                            Consulta la disponibilidad de carga, administra
                            personas y supervisa cada operación aérea.
                        </p>
                    </div>

                    <p className="text-sm text-blue-200/70">
                        Sistema de Carga Aérea
                    </p>
                </section>

                <section className="flex min-h-[620px] items-center p-6 sm:p-10 lg:p-12">
                    <Card className="w-full border-0 bg-transparent shadow-none">
                        <CardHeader className="px-0">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white lg:hidden">
                                <Plane className="size-6" />
                            </div>

                            <CardTitle className="text-3xl tracking-tight">
                                Iniciar sesión
                            </CardTitle>

                            <CardDescription className="text-base">
                                Ingresa tus credenciales para acceder al sistema.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-0">
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                                noValidate
                            >
                                <Controller
                                    name="nombreUsuario"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Nombre de usuario
                                            </FieldLabel>

                                            <div className="relative">
                                                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    autoComplete="username"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Ingresa tu usuario"
                                                    className="h-11 pl-10"
                                                />
                                            </div>

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Contraseña
                                            </FieldLabel>

                                            <div className="relative">
                                                <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    type={showPassword ? "text" : "password"}
                                                    autoComplete="current-password"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="Ingresa tu contraseña"
                                                    className="h-11 px-10"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword((current) => !current)
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    aria-label={
                                                        showPassword
                                                            ? "Ocultar contraseña"
                                                            : "Mostrar contraseña"
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="size-4" />
                                                    ) : (
                                                        <Eye className="size-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="h-11 w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <LoaderCircle className="animate-spin" />
                                            Verificando...
                                        </>
                                    ) : (
                                        "Ingresar al sistema"
                                    )}
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
                                El acceso se encuentra restringido al personal
                                autorizado.
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    )
}