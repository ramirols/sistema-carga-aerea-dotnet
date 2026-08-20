import Link from "next/link"
import { Mail, MapPin, Phone, Plane } from "lucide-react"

export function PublicFooter() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Plane className="size-5" />
                        </div>

                        <div>
                            <p className="font-semibold text-white">Carga Aérea</p>
                            <p className="text-xs text-slate-400">
                                Gestión inteligente
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                        Solución tecnológica para administrar vuelos,
                        encomiendas, destinos y capacidad de carga de manera
                        segura y centralizada.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-white">Enlaces</h3>

                    <div className="mt-4 flex flex-col gap-3 text-sm">
                        <Link href="#servicios" className="hover:text-white">
                            Servicios
                        </Link>
                        <Link href="#proceso" className="hover:text-white">
                            Proceso
                        </Link>
                        <Link href="#beneficios" className="hover:text-white">
                            Beneficios
                        </Link>
                        <Link href="/login" className="hover:text-white">
                            Acceso al sistema
                        </Link>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-white">Contacto</h3>

                    <div className="mt-4 space-y-3 text-sm text-slate-400">
                        <p className="flex gap-3">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-blue-400" />
                            Lima, Perú
                        </p>

                        <p className="flex gap-3">
                            <Phone className="mt-0.5 size-4 shrink-0 text-blue-400" />
                            +51 999 999 999
                        </p>

                        <p className="flex gap-3">
                            <Mail className="mt-0.5 size-4 shrink-0 text-blue-400" />
                            contacto@cargaaerea.pe
                        </p>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:px-6 md:flex-row md:justify-between lg:px-8">
                    <p>
                        © {new Date().getFullYear()} Sistema de Carga Aérea.
                    </p>
                    <p>Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}