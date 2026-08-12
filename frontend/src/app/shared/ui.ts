import { HttpErrorResponse } from '@angular/common/http';

export function obtenerMensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
        return (
            error.error?.detail ||
            error.error?.title ||
            'No se pudo completar la operación.'
        );
    }

    return 'Ocurrió un error inesperado.';
}

export function obtenerClaseEstado(estado: string): string {
    if (
        estado === 'Programado' ||
        estado === 'EnAlmacen'
    ) {
        return 'info';
    }

    if (
        estado === 'Despachado' ||
        estado === 'Embarcada'
    ) {
        return 'success';
    }

    if (estado === 'Asignada') {
        return 'warning';
    }

    return 'danger';
}

export function obtenerNombreEstado(estado: string): string {
    if (estado === 'EnAlmacen') {
        return 'En almacén';
    }

    return estado;
}