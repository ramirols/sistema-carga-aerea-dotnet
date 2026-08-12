import {
    DecimalPipe,
    PercentPipe,
    NgClass,
} from '@angular/common';
import {
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { forkJoin } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

import { ApiService } from '../../core/api.service';
import {
    Encomienda,
    Vuelo,
} from '../../core/models';
import { obtenerMensajeError } from '../../shared/ui';

interface ReporteDestino {
    destino: string;
    cantidadVuelos: number;
    pesoTransportado: number;
    pesoMaximo: number;
    porcentajeOcupacion: number;
}

@Component({
    selector: 'app-reportes',
    standalone: true,
    imports: [
        DecimalPipe,
        PercentPipe,
        NgClass,
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
            Reportes
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Indicadores consolidados de vuelos y encomiendas.
          </p>
        </div>

        <p-button
          label="Actualizar"
          [icon]="cargando ? 'pi pi-spinner pi-spin' : 'pi pi-refresh'"
          severity="secondary"
          [outlined]="true"
          [disabled]="cargando"
          (onClick)="cargarDatos()"
        />
      </header>

      <!-- Mensaje de error -->
      @if (error) {
        <div
          class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <i class="pi pi-exclamation-circle mt-0.5 shrink-0"></i>

          <span class="flex-1">
            {{ error }}
          </span>

          <button
            type="button"
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md opacity-60 transition hover:bg-red-100 hover:opacity-100"
            aria-label="Cerrar mensaje"
            (click)="error = ''"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      }

      <!-- Indicadores principales -->
      <section
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <!-- Total de vuelos -->
        <article
          class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Total de vuelos
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ vuelos.length }}
              </strong>

              <span class="mt-2 block text-xs text-slate-400">
                Vuelos registrados
              </span>
            </div>

            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg text-blue-600 transition group-hover:bg-blue-100"
            >
              <i class="pi pi-send"></i>
            </span>
          </div>
        </article>

        <!-- Total de encomiendas -->
        <article
          class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Total de encomiendas
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ encomiendas.length }}
              </strong>

              <span class="mt-2 block text-xs text-slate-400">
                Cargas registradas
              </span>
            </div>

            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-lg text-violet-600 transition group-hover:bg-violet-100"
            >
              <i class="pi pi-box"></i>
            </span>
          </div>
        </article>

        <!-- Peso registrado -->
        <article
          class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <span class="text-sm font-medium text-slate-500">
                Peso registrado
              </span>

              <strong
                class="mt-2 block truncate text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ pesoTotal | number: '1.0-2' }}
                <span class="text-base font-semibold text-slate-400">
                  kg
                </span>
              </strong>

              <span class="mt-2 block text-xs text-slate-400">
                Peso de encomiendas
              </span>
            </div>

            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-lg text-emerald-600 transition group-hover:bg-emerald-100"
            >
              <i class="pi pi-chart-line"></i>
            </span>
          </div>
        </article>

        <!-- Ocupación general -->
        <article
          class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Ocupación general
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ ocupacionGeneral | percent: '1.0-1' }}
              </strong>

              <span class="mt-2 block text-xs text-slate-400">
                Capacidad utilizada
              </span>
            </div>

            <span
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-lg text-orange-600 transition group-hover:bg-orange-100"
            >
              <i class="pi pi-percentage"></i>
            </span>
          </div>
        </article>
      </section>

      <!-- Resúmenes por estado -->
      <section
        class="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2"
      >
        <!-- Vuelos por estado -->
        <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-200 px-5 py-4">
            <h3 class="font-semibold text-slate-900">
              Vuelos por estado
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Situación actual de los vuelos registrados.
            </p>
          </div>

          <div class="space-y-6 p-5">
            <!-- Programados -->
            <div>
              <div class="mb-2 flex items-center justify-between gap-4">
                <div class="flex items-center gap-2.5">
                  <span
                    class="h-2.5 w-2.5 rounded-full bg-blue-500"
                  ></span>

                  <span class="text-sm font-medium text-slate-700">
                    Programados
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-400">
                    {{ porcentajeVuelos(vuelosProgramados) | percent: '1.0-0' }}
                  </span>

                  <strong class="text-sm text-slate-900">
                    {{ vuelosProgramados }}
                  </strong>
                </div>
              </div>

              <p-progressbar
                [value]="porcentajeBarraVuelos(vuelosProgramados)"
                [showValue]="false"
                styleClass="h-2"
              />
            </div>

            <!-- Despachados -->
            <div>
              <div class="mb-2 flex items-center justify-between gap-4">
                <div class="flex items-center gap-2.5">
                  <span
                    class="h-2.5 w-2.5 rounded-full bg-emerald-500"
                  ></span>

                  <span class="text-sm font-medium text-slate-700">
                    Despachados
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-400">
                    {{ porcentajeVuelos(vuelosDespachados) | percent: '1.0-0' }}
                  </span>

                  <strong class="text-sm text-slate-900">
                    {{ vuelosDespachados }}
                  </strong>
                </div>
              </div>

              <div
                class="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Vuelos despachados"
                [attr.aria-valuenow]="
                  porcentajeBarraVuelos(vuelosDespachados)
                "
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  [style.width.%]="
                    porcentajeBarraVuelos(vuelosDespachados)
                  "
                ></div>
              </div>
            </div>

            <!-- Cancelados -->
            <div>
              <div class="mb-2 flex items-center justify-between gap-4">
                <div class="flex items-center gap-2.5">
                  <span
                    class="h-2.5 w-2.5 rounded-full bg-red-500"
                  ></span>

                  <span class="text-sm font-medium text-slate-700">
                    Cancelados
                  </span>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs text-slate-400">
                    {{ porcentajeVuelos(vuelosCancelados) | percent: '1.0-0' }}
                  </span>

                  <strong class="text-sm text-slate-900">
                    {{ vuelosCancelados }}
                  </strong>
                </div>
              </div>

              <div
                class="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Vuelos cancelados"
                [attr.aria-valuenow]="
                  porcentajeBarraVuelos(vuelosCancelados)
                "
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  class="h-full rounded-full bg-red-500 transition-all duration-500"
                  [style.width.%]="
                    porcentajeBarraVuelos(vuelosCancelados)
                  "
                ></div>
              </div>
            </div>
          </div>
        </article>

        <!-- Encomiendas por estado -->
        <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-200 px-5 py-4">
            <h3 class="font-semibold text-slate-900">
              Encomiendas por estado
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Distribución actual de la carga registrada.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
            <!-- En almacén -->
            <div
              class="rounded-2xl border border-blue-100 bg-blue-50/50 p-4"
            >
              <span
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
              >
                <i class="pi pi-warehouse"></i>
              </span>

              <span class="mt-4 block text-xs font-medium text-blue-700">
                En almacén
              </span>

              <strong class="mt-1 block text-2xl font-bold text-slate-900">
                {{ encomiendasEnAlmacen }}
              </strong>

              <span class="mt-1 block text-xs text-slate-500">
                {{
                  porcentajeEncomiendas(encomiendasEnAlmacen)
                    | percent: '1.0-0'
                }}
                del total
              </span>
            </div>

            <!-- Asignadas -->
            <div
              class="rounded-2xl border border-amber-100 bg-amber-50/50 p-4"
            >
              <span
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600"
              >
                <i class="pi pi-link"></i>
              </span>

              <span class="mt-4 block text-xs font-medium text-amber-700">
                Asignadas
              </span>

              <strong class="mt-1 block text-2xl font-bold text-slate-900">
                {{ encomiendasAsignadas }}
              </strong>

              <span class="mt-1 block text-xs text-slate-500">
                {{
                  porcentajeEncomiendas(encomiendasAsignadas)
                    | percent: '1.0-0'
                }}
                del total
              </span>
            </div>

            <!-- Embarcadas -->
            <div
              class="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
            >
              <span
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600"
              >
                <i class="pi pi-check"></i>
              </span>

              <span
                class="mt-4 block text-xs font-medium text-emerald-700"
              >
                Embarcadas
              </span>

              <strong class="mt-1 block text-2xl font-bold text-slate-900">
                {{ encomiendasEmbarcadas }}
              </strong>

              <span class="mt-1 block text-xs text-slate-500">
                {{
                  porcentajeEncomiendas(encomiendasEmbarcadas)
                    | percent: '1.0-0'
                }}
                del total
              </span>
            </div>
          </div>
        </article>
      </section>

      <!-- Rendimiento por destino -->
      <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="font-semibold text-slate-900">
              Rendimiento por destino
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Capacidad y peso asignado agrupados por destino.
            </p>
          </div>

          <span
            class="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {{ reportesPorDestino.length }}
            {{
              reportesPorDestino.length === 1
                ? 'destino'
                : 'destinos'
            }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr
                class="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <th class="px-5 py-3.5">
                  Destino
                </th>

                <th class="px-5 py-3.5">
                  Vuelos
                </th>

                <th class="px-5 py-3.5">
                  Peso asignado
                </th>

                <th class="px-5 py-3.5">
                  Capacidad total
                </th>

                <th class="min-w-52 px-5 py-3.5">
                  Ocupación
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              @for (
                reporte of reportesPorDestino;
                track reporte.destino
              ) {
                <tr
                  class="transition-colors hover:bg-slate-50/70"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <span
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                      >
                        <i class="pi pi-map-marker text-sm"></i>
                      </span>

                      <strong class="text-sm text-slate-800">
                        {{ reporte.destino }}
                      </strong>
                    </div>
                  </td>

                  <td class="px-5 py-4">
                    <span
                      class="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                    >
                      {{ reporte.cantidadVuelos }}
                    </span>
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-sm text-slate-600"
                  >
                    {{
                      reporte.pesoTransportado
                        | number: '1.0-2'
                    }}
                    kg
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-sm text-slate-600"
                  >
                    {{ reporte.pesoMaximo | number: '1.0-2' }}
                    kg
                  </td>

                  <td class="px-5 py-4">
                    <div class="space-y-2">
                      <div
                        class="flex items-center justify-between gap-3"
                      >
                        <span class="text-xs text-slate-500">
                          Capacidad utilizada
                        </span>

                        <strong
                          class="text-xs"
                          [class.text-emerald-600]="
                            reporte.porcentajeOcupacion < 0.8
                          "
                          [class.text-amber-600]="
                            reporte.porcentajeOcupacion >= 0.8 &&
                            reporte.porcentajeOcupacion < 1
                          "
                          [class.text-red-600]="
                            reporte.porcentajeOcupacion >= 1
                          "
                        >
                          {{
                            reporte.porcentajeOcupacion
                              | percent: '1.0-1'
                          }}
                        </strong>
                      </div>

                      <div
                        class="h-2 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        [attr.aria-label]="
                          'Ocupación del destino ' +
                          reporte.destino
                        "
                        [attr.aria-valuenow]="
                          porcentajeBarra(
                            reporte.porcentajeOcupacion
                          )
                        "
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          [class.bg-emerald-500]="
                            reporte.porcentajeOcupacion < 0.8
                          "
                          [class.bg-amber-500]="
                            reporte.porcentajeOcupacion >= 0.8 &&
                            reporte.porcentajeOcupacion < 1
                          "
                          [class.bg-red-500]="
                            reporte.porcentajeOcupacion >= 1
                          "
                          [style.width.%]="
                            porcentajeBarra(
                              reporte.porcentajeOcupacion
                            )
                          "
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-5 py-16 text-center">
                    <span
                      class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400"
                    >
                      <i
                        class="pi"
                        [class.pi-spinner]="cargando"
                        [class.pi-spin]="cargando"
                        [class.pi-chart-bar]="!cargando"
                      ></i>
                    </span>

                    <strong class="mt-4 block text-sm text-slate-700">
                      {{
                        cargando
                          ? 'Cargando información'
                          : 'No hay información por destino'
                      }}
                    </strong>

                    <p class="mt-1 text-sm text-slate-500">
                      @if (cargando) {
                        Espera mientras obtenemos los reportes.
                      } @else {
                        Los resultados aparecerán cuando existan vuelos.
                      }
                    </p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Últimos vuelos -->
      <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="font-semibold text-slate-900">
              Últimos vuelos registrados
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Resumen de los vuelos registrados recientemente.
            </p>
          </div>

          <span
            class="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            Últimos {{ ultimosVuelos.length }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr
                class="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <th class="px-5 py-3.5">
                  Código
                </th>

                <th class="px-5 py-3.5">
                  Destino
                </th>

                <th class="px-5 py-3.5">
                  Peso actual
                </th>

                <th class="px-5 py-3.5">
                  Peso máximo
                </th>

                <th class="px-5 py-3.5">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              @for (vuelo of ultimosVuelos; track vuelo.id) {
                <tr
                  class="transition-colors hover:bg-slate-50/70"
                >
                  <td class="px-5 py-4">
                    <span
                      class="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                    >
                      {{ vuelo.codigoVuelo }}
                    </span>
                  </td>

                  <td class="px-5 py-4">
                    <div class="flex items-center gap-2">
                      <i
                        class="pi pi-map-marker text-xs text-slate-400"
                      ></i>

                      <span class="text-sm font-medium text-slate-700">
                        {{ vuelo.destino }}
                      </span>
                    </div>
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-sm text-slate-600"
                  >
                    {{ vuelo.pesoActual | number: '1.0-2' }}
                    kg
                  </td>

                  <td
                    class="whitespace-nowrap px-5 py-4 text-sm text-slate-600"
                  >
                    {{ vuelo.pesoMaximo | number: '1.0-2' }}
                    kg
                  </td>

                  <td class="px-5 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      [ngClass]="obtenerClaseEstadoTailwind(vuelo.estado)"
                    >
                      <span
                        class="h-1.5 w-1.5 rounded-full bg-current"
                      ></span>

                      {{ obtenerNombreEstado(vuelo.estado) }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-5 py-16 text-center">
                    <span
                      class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400"
                    >
                      <i
                        class="pi"
                        [class.pi-spinner]="cargando"
                        [class.pi-spin]="cargando"
                        [class.pi-send]="!cargando"
                      ></i>
                    </span>

                    <strong class="mt-4 block text-sm text-slate-700">
                      {{
                        cargando
                          ? 'Cargando vuelos'
                          : 'No hay vuelos registrados'
                      }}
                    </strong>

                    <p class="mt-1 text-sm text-slate-500">
                      Los vuelos aparecerán aquí cuando sean registrados.
                    </p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class ReportesComponent implements OnInit {
    private readonly apiService = inject(ApiService);

    vuelos: Vuelo[] = [];
    encomiendas: Encomienda[] = [];

    cargando = false;
    error = '';

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        if (this.cargando) {
            return;
        }

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

    get vuelosCancelados(): number {
        return this.vuelos.filter(
            (vuelo) => vuelo.estado === 'Cancelado',
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

    get pesoTotal(): number {
        return this.encomiendas.reduce(
            (total, encomienda) => total + encomienda.peso,
            0,
        );
    }

    get ocupacionGeneral(): number {
        const capacidadTotal = this.vuelos.reduce(
            (total, vuelo) => total + vuelo.pesoMaximo,
            0,
        );

        const pesoActualTotal = this.vuelos.reduce(
            (total, vuelo) => total + vuelo.pesoActual,
            0,
        );

        return capacidadTotal > 0
            ? pesoActualTotal / capacidadTotal
            : 0;
    }

    get reportesPorDestino(): ReporteDestino[] {
        const destinos = new Map<string, ReporteDestino>();

        for (const vuelo of this.vuelos) {
            const destino = vuelo.destino.trim();

            const reporte = destinos.get(destino) ?? {
                destino,
                cantidadVuelos: 0,
                pesoTransportado: 0,
                pesoMaximo: 0,
                porcentajeOcupacion: 0,
            };

            reporte.cantidadVuelos += 1;
            reporte.pesoTransportado += vuelo.pesoActual;
            reporte.pesoMaximo += vuelo.pesoMaximo;

            destinos.set(destino, reporte);
        }

        return Array.from(destinos.values())
            .map((reporte) => ({
                ...reporte,
                porcentajeOcupacion:
                    reporte.pesoMaximo > 0
                        ? reporte.pesoTransportado /
                        reporte.pesoMaximo
                        : 0,
            }))
            .sort((a, b) => {
                if (b.cantidadVuelos !== a.cantidadVuelos) {
                    return b.cantidadVuelos - a.cantidadVuelos;
                }

                return a.destino.localeCompare(b.destino);
            });
    }

    get ultimosVuelos(): Vuelo[] {
        return [...this.vuelos]
            .sort((a, b) => b.id - a.id)
            .slice(0, 10);
    }

    porcentajeVuelos(cantidad: number): number {
        if (this.vuelos.length === 0) {
            return 0;
        }

        return cantidad / this.vuelos.length;
    }

    porcentajeBarraVuelos(cantidad: number): number {
        return this.limitarPorcentaje(
            this.porcentajeVuelos(cantidad) * 100,
        );
    }

    porcentajeEncomiendas(cantidad: number): number {
        if (this.encomiendas.length === 0) {
            return 0;
        }

        return cantidad / this.encomiendas.length;
    }

    porcentajeBarra(porcentaje: number): number {
        return this.limitarPorcentaje(porcentaje * 100);
    }

    obtenerNombreEstado(estado: string): string {
        switch (estado) {
            case 'Programado':
                return 'Programado';

            case 'Despachado':
                return 'Despachado';

            case 'Cancelado':
                return 'Cancelado';

            default:
                return estado;
        }
    }

    obtenerClaseEstadoTailwind(estado: string): string {
        switch (estado) {
            case 'Programado':
                return 'bg-blue-50 text-blue-700';

            case 'Despachado':
                return 'bg-emerald-50 text-emerald-700';

            case 'Cancelado':
                return 'bg-red-50 text-red-700';

            default:
                return 'bg-slate-100 text-slate-600';
        }
    }

    private limitarPorcentaje(valor: number): number {
        return Math.min(100, Math.max(0, valor));
    }
}