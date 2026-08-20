"use client"

import {
    useEffect,
    useMemo,
    useState,
} from "react"

interface UseTablePaginationOptions<T> {
    data: T[]
    filter: (item: T, search: string) => boolean
    initialPageSize?: number
}

export function useTablePagination<T>({
    data,
    filter,
    initialPageSize = 8,
}: UseTablePaginationOptions<T>) {
    const [search, setSearchState] = useState("")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(initialPageSize)

    const filteredData = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) {
            return data
        }

        return data.filter((item) =>
            filter(item, normalizedSearch),
        )
    }, [data, filter, search])

    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / pageSize),
    )

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize
        return filteredData.slice(start, start + pageSize)
    }, [filteredData, page, pageSize])

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages)
        }
    }, [page, totalPages])

    function setSearch(value: string) {
        setSearchState(value)
        setPage(1)
    }

    function changePageSize(value: number) {
        setPageSize(value)
        setPage(1)
    }

    return {
        search,
        setSearch,
        page,
        setPage,
        pageSize,
        setPageSize: changePageSize,
        totalPages,
        totalItems: filteredData.length,
        paginatedData,
    }
}