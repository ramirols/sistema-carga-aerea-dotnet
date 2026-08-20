"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ArrowRight,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Plane,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { sileo } from "sileo";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/auth-provider";

const loginSchema = z.object({
    nombreUsuario: z.string().trim().min(1, "Ingresa tu nombre de usuario."),
    password: z.string().min(1, "Ingresa tu contraseña."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            nombreUsuario: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        try {
            await login(values);

            sileo.success({
                title: "Bienvenido al sistema",
                description: "La sesión se inició correctamente.",
            });

            router.replace("/dashboard");
            router.refresh();
        } catch (error) {
            sileo.error({
                title: "No se pudo iniciar sesión",
                description:
                    error instanceof ApiError
                        ? error.message
                        : "Verifica tus credenciales e inténtalo nuevamente.",
            });
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.28),transparent_32%),radial-gradient(circle_at_85%_90%,rgba(14,165,233,0.14),transparent_28%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]"
            />

            <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-black/30 lg:grid-cols-[0.92fr_1.08fr]">
                <section className="relative hidden min-h-[570px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-slate-950 p-10 text-white lg:flex">
                    <div
                        aria-hidden="true"
                        className="absolute -right-24 -top-24 size-72 rounded-full border border-white/10"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute -right-12 -top-12 size-48 rounded-full border border-white/10"
                    />

                    <div className="relative flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 shadow-sm backdrop-blur-sm">
                            <Plane className="size-5 -rotate-12" aria-hidden="true" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold tracking-wide">CARGA AÉREA</p>
                            <p className="text-xs text-blue-100/75">Gestión de operaciones</p>
                        </div>
                    </div>

                    <div className="relative">
                        <span className="mb-5 block h-1 w-10 rounded-full bg-sky-300" />
                        <h1 className="max-w-sm text-[2.15rem] font-semibold leading-[1.15] tracking-tight">
                            Todo el control de tus operaciones, en un solo lugar.
                        </h1>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-blue-100/80">
                            Administra vuelos, encomiendas y personal de manera simple, rápida
                            y segura.
                        </p>
                    </div>

                    <div className="relative flex items-center gap-2 text-xs text-blue-100/65">
                        <ShieldCheck className="size-4" aria-hidden="true" />
                        <span>Acceso exclusivo para personal autorizado</span>
                    </div>
                </section>

                <section className="flex min-h-[570px] items-center bg-white px-6 py-10 sm:px-12 lg:px-14">
                    <div className="mx-auto w-full max-w-sm">
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                                <Plane className="size-5 -rotate-12" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-wide text-slate-900">
                                    CARGA AÉREA
                                </p>
                                <p className="text-xs text-slate-500">Gestión de operaciones</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="mb-2 text-sm font-medium text-blue-600">
                                Bienvenido nuevamente
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                                Iniciar sesión
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Ingresa tus credenciales para acceder al sistema.
                            </p>
                        </div>

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
                                        <FieldLabel
                                            htmlFor={field.name}
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Nombre de usuario
                                        </FieldLabel>

                                        <div className="relative">
                                            <UserRound
                                                className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
                                                aria-hidden="true"
                                            />
                                            <Input
                                                {...field}
                                                id={field.name}
                                                autoComplete="username"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Ingresa tu usuario"
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/15"
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
                                        <FieldLabel
                                            htmlFor={field.name}
                                            className="text-sm font-medium text-slate-700"
                                        >
                                            Contraseña
                                        </FieldLabel>

                                        <div className="relative">
                                            <LockKeyhole
                                                className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
                                                aria-hidden="true"
                                            />
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type={showPassword ? "text" : "password"}
                                                autoComplete="current-password"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Ingresa tu contraseña"
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 px-11 text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/15"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((current) => !current)}
                                                className="absolute cursor-pointer right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                                                aria-label={
                                                    showPassword
                                                        ? "Ocultar contraseña"
                                                        : "Mostrar contraseña"
                                                }
                                                aria-pressed={showPassword}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="size-[18px]" />
                                                ) : (
                                                    <Eye className="size-[18px]" />
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
                                className="group cursor-pointer mt-1 h-12 w-full rounded-xl bg-blue-600 font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/25 focus-visible:ring-blue-500/30"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <>
                                        <LoaderCircle className="size-4 animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Ingresar al sistema
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400 lg:hidden">
                            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                            <span>Acceso exclusivo para personal autorizado</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}