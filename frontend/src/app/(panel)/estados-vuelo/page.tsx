"use client"

import { Tags } from "lucide-react"

import { CatalogCrudPage } from "@/features/catalogos/catalog-crud-page"

export default function EstadosVueloPage() {
    return (
        <CatalogCrudPage
            title="Estados de vuelo"
            description="Administra los estados disponibles para los vuelos."
            singularName="Estado"
            endpoint="/estados-vuelo"
            queryKey="estados-vuelo"
            icon={Tags}
        />
    )
}