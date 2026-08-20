"use client"

import { Boxes } from "lucide-react"

import { CatalogCrudPage } from "@/features/catalogos/catalog-crud-page"

export default function EstadosEncomiendaPage() {
    return (
        <CatalogCrudPage
            title="Estados de encomienda"
            description="Administra los estados utilizados por las encomiendas."
            singularName="Estado"
            endpoint="/estados-encomienda"
            queryKey="estados-encomienda"
            icon={Boxes}
        />
    )
}