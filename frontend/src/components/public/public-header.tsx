"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Plane, X } from "lucide-react"

const links = [
    { label: "Inicio", href: "#inicio" },
    { label: "Servicios", href: "#servicios" },
    { label: "Proceso", href: "#proceso" },
    { label: "Tecnología", href: "#tecnologia" },
    { label: "Beneficios", href: "#beneficios" },
    { label: "Contacto", href: "#contacto" },
]

export function PublicHeader() {
    const [open, setOpen] = useState(false)

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Plane className="size-5" />
                    </div>

                    <div>
                        <p className="font-semibold leading-5 text-white">
                            Carga Aérea
                        </p>
                        <p className="text-xs text-slate-400">
                            Gestión inteligente
                        </p>
                    </div>
                </Link>

                <nav className="hidden items-center gap-7 lg:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-slate-300 transition hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden lg:block">
                    <Link
                        href="/login"
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-500"
                    >
                        Iniciar sesión
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setOpen((current) => !current)}
                    className="inline-flex size-10 items-center justify-center rounded-xl text-white hover:bg-white/10 lg:hidden"
                    aria-label="Abrir menú"
                >
                    {open ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            {open && (
                <div className="border-t border-white/10 bg-slate-950 px-4 py-5 lg:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col gap-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="mt-3 inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-medium text-white"
                        >
                            Iniciar sesión
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    )
}