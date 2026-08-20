"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Boxes,
    LayoutDashboard,
    LogOut,
    MapPinned,
    Package,
    Plane,
    ShieldCheck,
    Tags,
    UserCog,
    UsersRound,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"

const operationNavigation = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Vuelos",
        href: "/vuelos",
        icon: Plane,
    },
    {
        label: "Encomiendas",
        href: "/encomiendas",
        icon: Package,
    },
    {
        label: "Personas",
        href: "/personas",
        icon: UsersRound,
    },
    {
        label: "Destinos",
        href: "/destinos",
        icon: MapPinned,
    },
]

const administrationNavigation = [
    {
        label: "Usuarios",
        href: "/usuarios",
        icon: UserCog,
    },
    {
        label: "Roles",
        href: "/roles",
        icon: ShieldCheck,
    },
    {
        label: "Estados de vuelo",
        href: "/estados-vuelo",
        icon: Tags,
    },
    {
        label: "Estados de encomienda",
        href: "/estados-encomienda",
        icon: Boxes,
    },
]

interface NavigationGroupProps {
    label: string
    items: typeof operationNavigation
}

function NavigationGroup({
    label,
    items,
}: NavigationGroupProps) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const Icon = item.icon

                        const active =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`)

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    render={<Link href={item.href} />}
                                    isActive={active}
                                    tooltip={item.label}
                                    className="data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:hover:bg-blue-600 data-[active=true]:hover:text-white"
                                >
                                    <Icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export function AppSidebar() {
    const { user, logout } = useAuth()

    const normalizedRole = user?.rol.trim().toLowerCase()

    const isAdmin =
        normalizedRole === "admin" ||
        normalizedRole === "administrador"

    return (
        <Sidebar
            collapsible="icon"
            variant="sidebar"
            className="border-r"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            render={<Link href="/dashboard" />}
                            tooltip="Carga Aérea"
                            className="h-14"
                        >
                            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <Plane className="size-5" />
                            </div>

                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    Carga Aérea
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    Panel administrativo
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavigationGroup
                    label="Operaciones"
                    items={operationNavigation}
                />

                {isAdmin && (
                    <NavigationGroup
                        label="Administración"
                        items={administrationNavigation}
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2 group-data-[collapsible=icon]:hidden">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                {user?.nombreUsuario
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {user?.nombreUsuario}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.rol}
                                </p>
                            </div>
                        </div>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            type="button"
                            onClick={() => void logout()}
                            tooltip="Cerrar sesión"
                            className="text-slate-600 hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}