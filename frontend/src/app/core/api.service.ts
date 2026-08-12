import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import {
    Encomienda,
    EncomiendaRequest,
    EstadoEncomienda,
    EstadoVuelo,
    Vuelo,
    VueloRequest,
} from './models';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.apiUrl;

    listarVuelos(
        destino = '',
        estado: EstadoVuelo | '' = '',
    ): Observable<Vuelo[]> {
        let params = new HttpParams();

        if (destino.trim()) {
            params = params.set('destino', destino.trim());
        }

        if (estado) {
            params = params.set('estado', estado);
        }

        return this.http.get<Vuelo[]>(
            `${this.apiUrl}/vuelos`,
            { params },
        );
    }

    obtenerVuelo(id: number): Observable<Vuelo> {
        return this.http.get<Vuelo>(
            `${this.apiUrl}/vuelos/${id}`,
        );
    }

    crearVuelo(request: VueloRequest): Observable<Vuelo> {
        return this.http.post<Vuelo>(
            `${this.apiUrl}/vuelos`,
            request,
        );
    }

    actualizarVuelo(
        id: number,
        request: VueloRequest,
    ): Observable<Vuelo> {
        return this.http.put<Vuelo>(
            `${this.apiUrl}/vuelos/${id}`,
            request,
        );
    }

    eliminarVuelo(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/vuelos/${id}`,
        );
    }

    listarEncomiendas(
        estado: EstadoEncomienda | '' = '',
        vueloId?: number,
    ): Observable<Encomienda[]> {
        let params = new HttpParams();

        if (estado) {
            params = params.set('estado', estado);
        }

        if (vueloId !== undefined) {
            params = params.set('vueloId', vueloId.toString());
        }

        return this.http.get<Encomienda[]>(
            `${this.apiUrl}/encomiendas`,
            { params },
        );
    }

    obtenerEncomienda(id: number): Observable<Encomienda> {
        return this.http.get<Encomienda>(
            `${this.apiUrl}/encomiendas/${id}`,
        );
    }

    crearEncomienda(
        request: EncomiendaRequest,
    ): Observable<Encomienda> {
        return this.http.post<Encomienda>(
            `${this.apiUrl}/encomiendas`,
            request,
        );
    }

    actualizarEncomienda(
        id: number,
        request: EncomiendaRequest,
    ): Observable<Encomienda> {
        return this.http.put<Encomienda>(
            `${this.apiUrl}/encomiendas/${id}`,
            request,
        );
    }

    eliminarEncomienda(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/encomiendas/${id}`,
        );
    }

    asignarEncomiendas(
        vueloId: number,
        encomiendaIds: number[],
    ): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/vuelos/${vueloId}/encomiendas`,
            { encomiendaIds },
        );
    }

    despacharVuelo(id: number): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/vuelos/${id}/despachar`,
            {},
        );
    }

    cancelarVuelo(id: number): Observable<void> {
        return this.http.post<void>(
            `${this.apiUrl}/vuelos/${id}/cancelar`,
            {},
        );
    }
}