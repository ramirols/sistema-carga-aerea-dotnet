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
    type LucideIcon,
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

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useAuth } from "@/providers/auth-provider"

interface NavigationItem {
    label: string
    href: string
    icon: LucideIcon
}

const operationNavigation: NavigationItem[] = [
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

const administrationNavigation: NavigationItem[] = [
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
    items: NavigationItem[]
}

function NavigationTooltip({
    children,
    content,
}: {
    children: React.ReactElement
    content: string
}) {
    return (
        <Tooltip>
            <TooltipTrigger render={children} />

            <TooltipContent
                side="right"
                sideOffset={10}
                className="
          rounded-lg border border-slate-800
          bg-slate-950 px-2.5 py-1.5
          text-xs font-medium text-white
          shadow-xl
        "
            >
                {content}
            </TooltipContent>
        </Tooltip>
    )
}

function NavigationGroup({
    label,
    items,
}: NavigationGroupProps) {
    const pathname = usePathname()

    return (
        <SidebarGroup className="px-2 py-3">
            <SidebarGroupLabel
                className="
          mb-1 px-3 text-[10px] font-semibold
          uppercase tracking-[0.16em] text-slate-400
        "
            >
                {label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                    {items.map((item) => {
                        const Icon = item.icon

                        const active =
                            pathname === item.href ||
                            pathname.startsWith(`${item.href}/`)

                        return (
                            <SidebarMenuItem key={item.href}>
                                <NavigationTooltip
                                    content={item.label}
                                    children={
                                        <SidebarMenuButton
                                            render={<Link href={item.href} />}
                                            isActive={active}
                                            className="
                        relative h-10 rounded-xl px-3
                        text-slate-600 transition-colors

                        before:absolute
                        before:left-0
                        before:top-1/2
                        before:h-5
                        before:w-[3px]
                        before:-translate-y-1/2
                        before:rounded-r-full
                        before:bg-transparent
                        before:transition-colors

                        hover:bg-slate-100
                        hover:text-slate-950

                        data-[active=true]:bg-blue-50
                        data-[active=true]:font-medium
                        data-[active=true]:text-blue-700
                        data-[active=true]:before:bg-blue-600

                        data-[active=true]:hover:bg-blue-50
                        data-[active=true]:hover:text-blue-700
                      "
                                        >
                                            <Icon className="size-[18px] shrink-0" />

                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    }
                                />
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

    const normalizedRole = user?.rol
        ?.trim()
        .toLowerCase()

    const isAdmin =
        normalizedRole === "admin" ||
        normalizedRole === "administrador"

    const userInitial =
        user?.nombreUsuario
            ?.trim()
            .charAt(0)
            .toUpperCase() || "U"

    return (
        <TooltipProvider>
            <Sidebar
                collapsible="icon"
                variant="sidebar"
                className="border-r border-slate-200/70"
            >
                <SidebarHeader className="border-b border-slate-200/70 p-2">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <NavigationTooltip
                                content="Carga Aérea"
                                children={
                                    <SidebarMenuButton
                                        size="lg"
                                        render={<Link href="/dashboard" />}
                                        className="
                      h-12 rounded-xl px-2
                      transition-colors
                      hover:bg-slate-100
                    "
                                    >
                                        <div
                                            className="
                        flex aspect-square size-9 shrink-0
                        items-center justify-center
                        rounded-xl bg-blue-600 text-white
                        shadow-sm shadow-blue-600/20
                      "
                                        >
                                            <Plane
                                                className="size-[18px] -rotate-12"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="grid min-w-0 flex-1 text-left leading-tight">
                                            <span className="truncate text-sm font-semibold text-slate-900">
                                                Carga Aérea
                                            </span>

                                            <span className="truncate text-xs text-slate-500">
                                                Panel administrativo
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                }
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent className="py-2">
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

                <SidebarFooter className="border-t border-slate-200/70 p-2">
                    <SidebarMenu className="gap-1">
                        <SidebarMenuItem>
                            <div
                                className="
                  mb-1 flex items-center gap-3
                  rounded-xl bg-slate-50
                  px-2.5 py-2.5
                  group-data-[collapsible=icon]:hidden
                "
                            >
                                <div
                                    className="
                    flex size-9 shrink-0 items-center
                    justify-center rounded-full
                    bg-blue-100 text-sm font-semibold
                    text-blue-700
                  "
                                >
                                    {userInitial}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900">
                                        {user?.nombreUsuario || "Usuario"}
                                    </p>

                                    <p className="truncate text-xs capitalize text-slate-500">
                                        {user?.rol || "Sin rol"}
                                    </p>
                                </div>
                            </div>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <NavigationTooltip
                                content="Cerrar sesión"
                                children={
                                    <SidebarMenuButton
                                        type="button"
                                        onClick={() => void logout()}
                                        className="
                      h-10 rounded-xl px-3
                      text-slate-500 transition-colors
                      hover:bg-red-50 hover:text-red-600
                    "
                                    >
                                        <LogOut className="size-[18px]" />

                                        <span>Cerrar sesión</span>
                                    </SidebarMenuButton>
                                }
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
        </TooltipProvider>
    )
}