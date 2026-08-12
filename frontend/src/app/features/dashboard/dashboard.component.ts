import {
    DatePipe,
    DecimalPipe,
} from '@angular/common';
import {
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

import { ApiService } from '../../core/api.service';
import {
    Encomienda,
    Vuelo,
} from '../../core/models';
import { obtenerMensajeError } from '../../shared/ui';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        DatePipe,
        DecimalPipe,
        RouterLink,
        ButtonModule,
        ProgressBarModule,
    ],
    template: `
    <div class="space-y-6">
      <!-- Encabezado -->
      <header
        class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2
            class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Dashboard
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Resumen general de la operación logística.
          </p>
        </div>

        <p-button
          label="Actualizar"
          [icon]="cargando ? 'pi pi-spinner pi-spin' : 'pi pi-refresh'"
          [outlined]="true"
          severity="secondary"
          [disabled]="cargando"
          (onClick)="cargarDatos()"
        />
      </header>

      <!-- Error -->
      @if (error) {
        <div
          class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <i class="pi pi-exclamation-circle mt-0.5"></i>
          <span>{{ error }}</span>
        </div>
      }

      <!-- Estadísticas -->
      <section
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        @for (estadistica of estadisticas; track estadistica.titulo) {
          <article
            class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="flex items-center gap-4">
              <span
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                [class]="estadistica.claseIcono"
              >
                <i [class]="estadistica.icono"></i>
              </span>

              <div class="min-w-0">
                <p class="text-sm text-slate-500">
                  {{ estadistica.titulo }}
                </p>

                <strong class="mt-1 block text-2xl font-bold text-slate-900">
                  @if (estadistica.peso) {
                    {{ estadistica.valor | number: '1.0-2' }} kg
                  } @else {
                    {{ estadistica.valor }}
                  }
                </strong>
              </div>
            </div>
          </article>
        }
      </section>

      <!-- Contenido principal -->
      <section
        class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.7fr)]"
      >
        <!-- Próximos vuelos -->
        <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div
            class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4"
          >
            <div>
              <h3 class="font-semibold text-slate-900">
                Próximos vuelos
              </h3>

              <p class="mt-1 text-sm text-slate-500">
                Vuelos que continúan programados.
              </p>
            </div>

            <a
              routerLink="/vuelos"
              class="flex shrink-0 items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Ver todos
              <i class="pi pi-arrow-right text-xs"></i>
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-slate-50">
                  <th
                    class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Código
                  </th>

                  <th
                    class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Destino
                  </th>

                  <th
                    class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Fecha
                  </th>

                  <th
                    class="min-w-52 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Ocupación
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                @for (vuelo of proximosVuelos; track vuelo.id) {
                  <tr class="transition hover:bg-slate-50/70">
                    <td class="px-5 py-4">
                      <span
                        class="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                      >
                        {{ vuelo.codigoVuelo }}
                      </span>
                    </td>

                    <td
                      class="whitespace-nowrap px-5 py-4 text-sm font-medium text-slate-700"
                    >
                      {{ vuelo.destino }}
                    </td>

                    <td
                      class="whitespace-nowrap px-5 py-4 text-sm text-slate-500"
                    >
                      {{ vuelo.fechaVuelo | date: 'dd/MM/yyyy' }}
                    </td>

                    <td class="px-5 py-4">
                      <div class="min-w-44 space-y-2">
                        <div
                          class="flex items-center justify-between gap-4 text-xs"
                        >
                          <span class="font-medium text-slate-700">
                            {{ vuelo.pesoActual | number: '1.0-2' }}
                            /
                            {{ vuelo.pesoMaximo | number: '1.0-2' }}
                            kg
                          </span>

                          <span class="text-slate-500">
                            {{ porcentajeOcupacion(vuelo) | number: '1.0-0' }}%
                          </span>
                        </div>

                        <p-progressbar
                          [value]="porcentajeOcupacion(vuelo)"
                          [showValue]="false"
                          styleClass="h-2"
                        />
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td
                      colspan="4"
                      class="px-5 py-14 text-center"
                    >
                      <div
                        class="mx-auto flex max-w-xs flex-col items-center"
                      >
                        <span
                          class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                        >
                          <i class="pi pi-send"></i>
                        </span>

                        <strong class="mt-3 text-sm text-slate-700">
                          No hay vuelos programados
                        </strong>

                        <span class="mt-1 text-sm text-slate-500">
                          Los próximos vuelos aparecerán aquí.
                        </span>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </article>

        <!-- Estado de encomiendas -->
        <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-200 px-5 py-4">
            <h3 class="font-semibold text-slate-900">
              Estado de encomiendas
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Distribución actual de la carga.
            </p>
          </div>

          <div class="space-y-3 p-5">
            @for (estado of estadosEncomiendas; track estado.titulo) {
              <div
                class="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
              >
                <span
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                  [class]="estado.claseIcono"
                >
                  <i [class]="estado.icono"></i>
                </span>

                <div class="min-w-0 flex-1">
                  <p class="text-sm text-slate-500">
                    {{ estado.titulo }}
                  </p>

                  <strong class="mt-0.5 block text-xl text-slate-900">
                    {{ estado.valor }}
                  </strong>
                </div>

                <i class="pi pi-angle-right text-slate-300"></i>
              </div>
            }
          </div>
        </article>
      </section>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
    private readonly apiService = inject(ApiService);

    vuelos: Vuelo[] = [];
    encomiendas: Encomienda[] = [];

    cargando = false;
    error = '';

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.cargando = true;
        this.error = '';

        forkJoin({
            vuelos: this.apiService.listarVuelos(),
            encomiendas: this.apiService.listarEncomiendas(),
        }).subscribe({
            next: ({ vuelos, encomiendas }) => {
                this.vuelos = vuelos;
                this.encomiendas = encomiendas;
                this.cargando = false;
            },
            error: (error: unknown) => {
                this.error = obtenerMensajeError(error);
                this.cargando = false;
            },
        });
    }

    get vuelosProgramados(): number {
        return this.vuelos.filter(
            (vuelo) => vuelo.estado === 'Programado',
        ).length;
    }

    get vuelosDespachados(): number {
        return this.vuelos.filter(
            (vuelo) => vuelo.estado === 'Despachado',
        ).length;
    }

    get encomiendasEnAlmacen(): number {
        return this.encomiendas.filter(
            (encomienda) => encomienda.estado === 'EnAlmacen',
        ).length;
    }

    get encomiendasAsignadas(): number {
        return this.encomiendas.filter(
            (encomienda) => encomienda.estado === 'Asignada',
        ).length;
    }

    get encomiendasEmbarcadas(): number {
        return this.encomiendas.filter(
            (encomienda) => encomienda.estado === 'Embarcada',
        ).length;
    }

    get pesoAsignado(): number {
        return this.vuelos.reduce(
            (total, vuelo) => total + vuelo.pesoActual,
            0,
        );
    }

    get proximosVuelos(): Vuelo[] {
        return this.vuelos
            .filter((vuelo) => vuelo.estado === 'Programado')
            .sort((a, b) => {
                const fechaA = `${a.fechaVuelo}T${a.horaVuelo}`;
                const fechaB = `${b.fechaVuelo}T${b.horaVuelo}`;

                return fechaA.localeCompare(fechaB);
            })
            .slice(0, 5);
    }

    get estadisticas() {
        return [
            {
                titulo: 'Vuelos programados',
                valor: this.vuelosProgramados,
                icono: 'pi pi-send',
                claseIcono: 'bg-blue-50 text-blue-600',
                peso: false,
            },
            {
                titulo: 'Encomiendas en almacén',
                valor: this.encomiendasEnAlmacen,
                icono: 'pi pi-box',
                claseIcono: 'bg-orange-50 text-orange-600',
                peso: false,
            },
            {
                titulo: 'Peso asignado',
                valor: this.pesoAsignado,
                icono: 'pi pi-chart-bar',
                claseIcono: 'bg-emerald-50 text-emerald-600',
                peso: true,
            },
            {
                titulo: 'Vuelos despachados',
                valor: this.vuelosDespachados,
                icono: 'pi pi-check-circle',
                claseIcono: 'bg-violet-50 text-violet-600',
                peso: false,
            },
        ];
    }

    get estadosEncomiendas() {
        return [
            {
                titulo: 'En almacén',
                valor: this.encomiendasEnAlmacen,
                icono: 'pi pi-warehouse',
                claseIcono: 'bg-blue-50 text-blue-600',
            },
            {
                titulo: 'Asignadas',
                valor: this.encomiendasAsignadas,
                icono: 'pi pi-link',
                claseIcono: 'bg-orange-50 text-orange-600',
            },
            {
                titulo: 'Embarcadas',
                valor: this.encomiendasEmbarcadas,
                icono: 'pi pi-check',
                claseIcono: 'bg-emerald-50 text-emerald-600',
            },
        ];
    }

    porcentajeOcupacion(vuelo: Vuelo): number {
        if (!vuelo.pesoMaximo) {
            return 0;
        }

        return Math.min(
            100,
            (vuelo.pesoActual / vuelo.pesoMaximo) * 100,
        );
    }
}