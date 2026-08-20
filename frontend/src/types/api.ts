export interface LoginRequest {
    nombreUsuario: string
    password: string
}

export interface LoginResponse {
    token: string
    expiraEn: string
    nombreUsuario: string
    rol: string
}

export interface AuthSession {
    nombreUsuario: string
    rol: string
    expiraEn: string
}

export interface DestinoResponse {
    id: number
    nombre: string
    codigoIATA: string
    pais: string
}

export interface DestinoRequest {
    nombre: string
    codigoIATA: string
    pais: string
}

export interface PersonaResponse {
    id: number
    nombre: string
    documento: string
    telefono: string | null
    email: string | null
    direccion: string | null
}

export interface CrearPersonaRequest {
    nombre: string
    documento: string
    telefono?: string | null
    email?: string | null
    direccion?: string | null
}

export interface ActualizarPersonaRequest {
    nombre: string
    telefono?: string | null
    email?: string | null
    direccion?: string | null
}

export interface EstadoResponse {
    id: number
    nombre: string
    esDelSistema: boolean
}

export interface EstadoRequest {
    nombre: string
}

export interface RolResponse {
    id: number
    nombre: string
    esDelSistema: boolean
}

export interface RolRequest {
    nombre: string
}

export interface UsuarioResponse {
    id: number
    nombreUsuario: string
    rol: string
    activo: boolean
    fechaCreacion: string
}

export interface CrearUsuarioRequest {
    nombreUsuario: string
    password: string
    rolId: number
}

export interface CambiarRolUsuarioRequest {
    rolId: number
}

export interface CambiarPasswordRequest {
    passwordActual: string
    passwordNueva: string
}

export interface EncomiendaResponse {
    id: number
    codigo: string
    descripcion: string
    peso: number
    remitenteId: number;
    remitente: string
    destinatarioId: number;
    destinatario: string
    estadoId: number;
    estado: string
    vueloId: number | null;
    vueloCodigo: string | null
    fechaRegistro: string
}

export interface EncomiendaRequest {
    codigo: string
    descripcion: string
    peso: number
    remitenteId: number
    destinatarioId: number
}

export interface AsignarEncomiendasRequest {
    encomiendaIds: number[]
}

export interface VueloResponse {
    id: number
    codigoVuelo: string
    destinoId: number
    destino: string
    fechaVuelo: string
    horaVuelo: string
    pesoMaximo: number
    pesoAsignado: number
    pesoDisponible: number
    estado: string
}

export interface VueloRequest {
    codigoVuelo: string
    destinoId: number
    fechaVuelo: string
    horaVuelo: string
    pesoMaximo: number
}

export interface ValidationProblemDetails {
    type?: string
    title?: string
    status?: number
    detail?: string
    instance?: string
    errors?: Record<string, string[]>
}