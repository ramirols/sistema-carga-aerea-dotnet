"use client"

import { ShieldCheck } from "lucide-react"

import { CatalogCrudPage } from "@/features/catalogos/catalog-crud-page"

export default function RolesPage() {
    return (
        <CatalogCrudPage
            title="Roles"
            description="Administra los perfiles de acceso del sistema."
            singularName="Rol"
            endpoint="/Roles"
            queryKey="roles"
            icon={ShieldCheck}
        />
    )
}