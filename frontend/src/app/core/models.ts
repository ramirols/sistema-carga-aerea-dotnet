export type EstadoVuelo =
    | 'Programado'
    | 'Despachado'
    | 'Cancelado';

export type EstadoEncomienda =
    | 'EnAlmacen'
    | 'Asignada'
    | 'Embarcada';

export interface Vuelo {
    id: number;
    codigoVuelo: string;
    destino: string;
    fechaVuelo: string;
    horaVuelo: string;
    pesoMaximo: number;
    pesoActual: number;
    pesoDisponible: number;
    estado: EstadoVuelo;
}

export interface VueloRequest {
    codigoVuelo: string;
    destino: string;
    fechaVuelo: string;
    horaVuelo: string;
    pesoMaximo: number;
}

export interface Encomienda {
    id: number;
    codigo: string;
    descripcion: string;
    peso: number;
    remitente: string;
    destinatario: string;
    estado: EstadoEncomienda;
    vueloId: number | null;
    codigoVuelo: string | null;
}

export interface EncomiendaRequest {
    codigo: string;
    descripcion: string;
    peso: number;
    remitente: string;
    destinatario: string;
}

export interface ProblemDetails {
    title?: string;
    detail?: string;
    status?: number;
}