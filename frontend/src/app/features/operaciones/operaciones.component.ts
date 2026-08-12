import { DatePipe, DecimalPipe } from '@angular/common';
import {
    Component,
    OnInit,
    inject,
} from '@angular/core';
import { forkJoin } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';

import { ApiService } from '../../core/api.service';
import {
    Encomienda,
    Vuelo,
} from '../../core/models';
import {
    obtenerMensajeError,
    obtenerNombreEstado,
} from '../../shared/ui';

@Component({
    selector: 'app-operaciones',
    standalone: true,
    providers: [ConfirmationService],
    imports: [
        DatePipe,
        DecimalPipe,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        ProgressBarModule,
        TooltipModule,
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
            Operaciones
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Asigna encomiendas y gestiona la salida de los vuelos.
          </p>
        </div>

        <p-button
          label="Actualizar"
          [icon]="cargando ? 'pi pi-spinner pi-spin' : 'pi pi-refresh'"
          severity="secondary"
          [outlined]="true"
          [disabled]="cargando || procesando"
          (onClick)="cargarDatos()"
        />
      </header>

      <!-- Mensaje -->
      @if (mensaje) {
        <div
          class="flex items-start gap-3 rounded-xl border p-4 text-sm"
          [class.border-red-200]="mensajeEsError"
          [class.bg-red-50]="mensajeEsError"
          [class.text-red-700]="mensajeEsError"
          [class.border-emerald-200]="!mensajeEsError"
          [class.bg-emerald-50]="!mensajeEsError"
          [class.text-emerald-700]="!mensajeEsError"
        >
          <i
            class="pi mt-0.5 shrink-0"
            [class.pi-exclamation-circle]="mensajeEsError"
            [class.pi-check-circle]="!mensajeEsError"
          ></i>

          <span class="flex-1">{{ mensaje }}</span>

          <button
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-md opacity-60 transition hover:bg-black/5 hover:opacity-100"
            aria-label="Cerrar mensaje"
            (click)="mensaje = ''"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </div>
      }

      <!-- Panel principal -->
      <section
        class="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.35fr)]"
      >
        <!-- Lista de vuelos -->
        <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div
            class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4"
          >
            <div>
              <h3 class="font-semibold text-slate-900">
                Vuelos programados
              </h3>

              <p class="mt-1 text-sm text-slate-500">
                Selecciona el vuelo que deseas gestionar.
              </p>
            </div>

            <span
              class="inline-flex min-w-8 items-center justify-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
            >
              {{ vuelosProgramados.length }}
            </span>
          </div>

          <div
            class="max-h-[680px] space-y-3 overflow-y-auto p-4"
          >
            @for (vuelo of vuelosProgramados; track vuelo.id) {
              <button
                type="button"
                class="w-full rounded-2xl border p-4 text-left transition-all"
                [class.border-blue-500]="
                  vueloSeleccionado?.id === vuelo.id
                "
                [class.bg-blue-50]="
                  vueloSeleccionado?.id === vuelo.id
                "
                [class.shadow-sm]="
                  vueloSeleccionado?.id === vuelo.id
                "
                [class.border-slate-200]="
                  vueloSeleccionado?.id !== vuelo.id
                "
                [class.bg-white]="
                  vueloSeleccionado?.id !== vuelo.id
                "
                [class.hover:border-blue-300]="
                  vueloSeleccionado?.id !== vuelo.id
                "
                [disabled]="procesando"
                (click)="seleccionarVuelo(vuelo)"
              >
                <div class="flex items-center justify-between gap-3">
                  <span
                    class="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700"
                  >
                    {{ vuelo.codigoVuelo }}
                  </span>

                  <span
                    class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full bg-current"
                    ></span>
                    Programado
                  </span>
                </div>

                <div class="mt-4">
                  <strong class="block text-base text-slate-900">
                    {{ vuelo.destino }}
                  </strong>

                  <div
                    class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"
                  >
                    <span class="flex items-center gap-1.5">
                      <i class="pi pi-calendar text-blue-500"></i>
                      {{ vuelo.fechaVuelo | date: 'dd/MM/yyyy' }}
                    </span>

                    <span class="flex items-center gap-1.5">
                      <i class="pi pi-clock text-blue-500"></i>
                      {{ mostrarHora(vuelo.horaVuelo) }}
                    </span>
                  </div>
                </div>

                <div class="mt-4 space-y-2">
                  <div
                    class="flex items-center justify-between gap-3 text-xs"
                  >
                    <span class="font-medium text-slate-700">
                      {{ vuelo.pesoActual | number: '1.0-2' }} /
                      {{ vuelo.pesoMaximo | number: '1.0-2' }} kg
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

                  <p class="text-xs text-slate-500">
                    Disponible:
                    <strong class="font-semibold text-slate-700">
                      {{ vuelo.pesoDisponible | number: '1.0-2' }} kg
                    </strong>
                  </p>
                </div>
              </button>
            } @empty {
              <div class="px-4 py-16 text-center">
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
                      : 'No hay vuelos programados'
                  }}
                </strong>

                <p class="mx-auto mt-1 max-w-xs text-sm text-slate-500">
                  @if (cargando) {
                    Espera mientras consultamos la información.
                  } @else {
                    Registra un nuevo vuelo para iniciar una operación.
                  }
                </p>
              </div>
            }
          </div>
        </article>

        <!-- Detalle del vuelo -->
        <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          @if (vueloSeleccionado) {
            <div
              class="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-3">
                <span
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                >
                  <i class="pi pi-send"></i>
                </span>

                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-slate-900">
                      Vuelo {{ vueloSeleccionado.codigoVuelo }}
                    </h3>

                    <span
                      class="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700"
                    >
                      Programado
                    </span>
                  </div>

                  <p class="mt-1 text-sm text-slate-500">
                    Carga con destino a
                    {{ vueloSeleccionado.destino }}.
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 text-sm text-slate-500">
                <i class="pi pi-calendar text-blue-500"></i>
                {{ vueloSeleccionado.fechaVuelo | date: 'dd/MM/yyyy' }}

                <span class="text-slate-300">•</span>

                <i class="pi pi-clock text-blue-500"></i>
                {{ mostrarHora(vueloSeleccionado.horaVuelo) }}
              </div>
            </div>

            <!-- Resumen -->
            <div
              class="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50/60 p-5 sm:grid-cols-3"
            >
              <div
                class="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div class="flex items-center gap-2 text-slate-500">
                  <i class="pi pi-box text-xs"></i>
                  <span class="text-xs font-medium">Peso máximo</span>
                </div>

                <strong class="mt-2 block text-lg text-slate-900">
                  {{
                    vueloSeleccionado.pesoMaximo
                      | number: '1.0-2'
                  }}
                  kg
                </strong>
              </div>

              <div
                class="rounded-xl border border-blue-200 bg-blue-50/50 p-4"
              >
                <div class="flex items-center gap-2 text-blue-600">
                  <i class="pi pi-chart-bar text-xs"></i>
                  <span class="text-xs font-medium">Peso asignado</span>
                </div>

                <strong class="mt-2 block text-lg text-blue-700">
                  {{
                    vueloSeleccionado.pesoActual
                      | number: '1.0-2'
                  }}
                  kg
                </strong>
              </div>

              <div
                class="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4"
              >
                <div class="flex items-center gap-2 text-emerald-600">
                  <i class="pi pi-check-circle text-xs"></i>
                  <span class="text-xs font-medium">
                    Peso disponible
                  </span>
                </div>

                <strong class="mt-2 block text-lg text-emerald-700">
                  {{
                    vueloSeleccionado.pesoDisponible
                      | number: '1.0-2'
                  }}
                  kg
                </strong>
              </div>
            </div>

            <!-- Encomiendas asignadas -->
            <div class="p-5">
              <div
                class="mb-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 class="font-semibold text-slate-900">
                    Encomiendas asignadas
                  </h4>

                  <p class="mt-1 text-sm text-slate-500">
                    Carga que actualmente pertenece al vuelo.
                  </p>
                </div>

                <span
                  class="inline-flex min-w-8 items-center justify-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                >
                  {{ encomiendasDelVuelo.length }}
                </span>
              </div>

              <div class="space-y-3">
                @for (
                  encomienda of encomiendasDelVuelo;
                  track encomienda.id
                ) {
                  <div
                    class="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50/50 sm:flex-row sm:items-center"
                  >
                    <span
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"
                    >
                      <i class="pi pi-box"></i>
                    </span>

                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <strong class="text-sm text-slate-800">
                          {{ encomienda.codigo }}
                        </strong>

                        <span
                          class="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                        >
                          Asignada
                        </span>
                      </div>

                      <p
                        class="mt-1 truncate text-sm text-slate-500"
                        [title]="encomienda.descripcion"
                      >
                        {{ encomienda.descripcion }}
                      </p>
                    </div>

                    <strong
                      class="whitespace-nowrap text-sm text-slate-800"
                    >
                      {{ encomienda.peso | number: '1.0-2' }} kg
                    </strong>
                  </div>
                } @empty {
                  <div
                    class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center"
                  >
                    <span
                      class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm"
                    >
                      <i class="pi pi-inbox"></i>
                    </span>

                    <strong class="mt-3 block text-sm text-slate-700">
                      Sin encomiendas asignadas
                    </strong>

                    <p class="mt-1 text-sm text-slate-500">
                      Asigna carga antes de despachar este vuelo.
                    </p>
                  </div>
                }
              </div>
            </div>

            <!-- Acciones -->
            <footer
              class="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:flex-wrap"
            >
              <p-button
                label="Asignar encomiendas"
                icon="pi pi-plus"
                [disabled]="procesando"
                (onClick)="abrirAsignacion()"
              />

              <p-button
                label="Despachar vuelo"
                icon="pi pi-send"
                severity="success"
                [disabled]="
                  procesando || encomiendasDelVuelo.length === 0
                "
                (onClick)="confirmarDespacho()"
              />

              <p-button
                label="Cancelar vuelo"
                icon="pi pi-ban"
                severity="danger"
                [outlined]="true"
                [disabled]="procesando"
                styleClass="sm:ml-auto"
                (onClick)="confirmarCancelacion()"
              />
            </footer>
          } @else {
            <div
              class="flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center"
            >
              <span
                class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-500"
              >
                <i class="pi pi-cursor"></i>
              </span>

              <h3 class="mt-5 font-semibold text-slate-800">
                Selecciona un vuelo
              </h3>

              <p class="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Elige un vuelo programado para consultar su carga,
                asignar encomiendas o gestionar su salida.
              </p>
            </div>
          }
        </article>
      </section>
    </div>

    <!-- Diálogo para asignar encomiendas -->
    <p-dialog
      [(visible)]="mostrarAsignacion"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="!procesando"
      [closeOnEscape]="!procesando"
      [style]="{ width: 'min(94vw, 760px)' }"
      [contentStyle]="{ padding: '0' }"
      (onHide)="alCerrarAsignacion()"
    >
      <ng-template #header>
        <div class="flex items-center gap-3">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
          >
            <i class="pi pi-box"></i>
          </span>

          <div>
            <h3 class="font-semibold text-slate-900">
              Asignar encomiendas
            </h3>

            @if (vueloSeleccionado) {
              <p class="mt-0.5 text-sm font-normal text-slate-500">
                Vuelo {{ vueloSeleccionado.codigoVuelo }} ·
                {{ vueloSeleccionado.destino }}
              </p>
            }
          </div>
        </div>
      </ng-template>

      @if (vueloSeleccionado) {
        <div>
          <!-- Resumen de selección -->
          <div
            class="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-3"
          >
            <div class="rounded-xl bg-white p-3 shadow-sm">
              <span class="text-xs text-slate-500">
                Seleccionadas
              </span>

              <strong class="mt-1 block text-lg text-slate-900">
                {{ idsSeleccionados.size }}
              </strong>
            </div>

            <div class="rounded-xl bg-white p-3 shadow-sm">
              <span class="text-xs text-slate-500">
                Peso seleccionado
              </span>

              <strong class="mt-1 block text-lg text-blue-700">
                {{ pesoSeleccionado | number: '1.0-2' }} kg
              </strong>
            </div>

            <div
              class="rounded-xl bg-white p-3 shadow-sm"
              [class.ring-1]="pesoRestante < 0"
              [class.ring-red-300]="pesoRestante < 0"
            >
              <span class="text-xs text-slate-500">
                Peso restante
              </span>

              <strong
                class="mt-1 block text-lg"
                [class.text-emerald-700]="pesoRestante >= 0"
                [class.text-red-600]="pesoRestante < 0"
              >
                {{ pesoRestante | number: '1.0-2' }} kg
              </strong>
            </div>
          </div>

          <!-- Lista disponible -->
          <div class="max-h-[430px] space-y-3 overflow-y-auto p-5">
            @for (
              encomienda of encomiendasDisponibles;
              track encomienda.id
            ) {
              <label
                class="flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition"
                [class.border-blue-400]="
                  idsSeleccionados.has(encomienda.id)
                "
                [class.bg-blue-50]="
                  idsSeleccionados.has(encomienda.id)
                "
                [class.border-slate-200]="
                  !idsSeleccionados.has(encomienda.id)
                "
                [class.hover:border-blue-300]="
                  !idsSeleccionados.has(encomienda.id)
                "
              >
                <input
                  type="checkbox"
                  class="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-blue-600"
                  [checked]="idsSeleccionados.has(encomienda.id)"
                  [disabled]="procesando"
                  (change)="alternarEncomienda(encomienda)"
                />

                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"
                >
                  <i class="pi pi-box"></i>
                </span>

                <span class="min-w-0 flex-1">
                  <span
                    class="flex flex-wrap items-center justify-between gap-2"
                  >
                    <strong class="text-sm text-slate-800">
                      {{ encomienda.codigo }}
                    </strong>

                    <strong class="text-sm text-slate-800">
                      {{ encomienda.peso | number: '1.0-2' }} kg
                    </strong>
                  </span>

                  <span
                    class="mt-1 block truncate text-sm text-slate-500"
                    [title]="encomienda.descripcion"
                  >
                    {{ encomienda.descripcion }}
                  </span>

                  <span
                    class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400"
                  >
                    <span>{{ encomienda.remitente }}</span>
                    <i class="pi pi-arrow-right text-[9px]"></i>
                    <span>{{ encomienda.destinatario }}</span>
                  </span>
                </span>
              </label>
            } @empty {
              <div class="px-5 py-14 text-center">
                <span
                  class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400"
                >
                  <i class="pi pi-inbox"></i>
                </span>

                <strong class="mt-4 block text-sm text-slate-700">
                  No hay encomiendas disponibles
                </strong>

                <p class="mt-1 text-sm text-slate-500">
                  Todas las encomiendas están asignadas o embarcadas.
                </p>
              </div>
            }
          </div>

          @if (pesoRestante < 0) {
            <div
              class="mx-5 mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <i class="pi pi-exclamation-circle mt-0.5"></i>

              <span>
                El peso seleccionado supera la capacidad disponible
                del vuelo.
              </span>
            </div>
          }
        </div>
      }

      <ng-template #footer>
        <div
          class="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end"
        >
          <p-button
            label="Cancelar"
            severity="secondary"
            [outlined]="true"
            [disabled]="procesando"
            styleClass="w-full sm:w-auto"
            (onClick)="cerrarAsignacion()"
          />

          <p-button
            label="Confirmar asignación"
            icon="pi pi-check"
            [loading]="procesando"
            [disabled]="
              idsSeleccionados.size === 0 || pesoRestante < 0
            "
            styleClass="w-full sm:w-auto"
            (onClick)="confirmarAsignacion()"
          />
        </div>
      </ng-template>
    </p-dialog>

    <!-- Confirmaciones -->
    <p-confirmdialog
      [style]="{ width: 'min(92vw, 450px)' }"
    />
  `,
})
export class OperacionesComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly confirmationService =
        inject(ConfirmationService);

    vuelos: Vuelo[] = [];
    encomiendas: Encomienda[] = [];

    vueloSeleccionado: Vuelo | null = null;
    idsSeleccionados = new Set<number>();

    mostrarAsignacion = false;
    cargando = false;
    procesando = false;

    mensaje = '';
    mensajeEsError = false;

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(vueloSeleccionadoId?: number): void {
        const idAnterior =
            vueloSeleccionadoId ?? this.vueloSeleccionado?.id;

        this.cargando = true;

        forkJoin({
            vuelos: this.apiService.listarVuelos(),
            encomiendas: this.apiService.listarEncomiendas(),
        }).subscribe({
            next: ({ vuelos, encomiendas }) => {
                this.vuelos = vuelos;
                this.encomiendas = encomiendas;

                this.vueloSeleccionado =
                    vuelos.find(
                        (vuelo) =>
                            vuelo.id === idAnterior &&
                            vuelo.estado === 'Programado',
                    ) ?? null;

                this.cargando = false;
            },
            error: (error: unknown) => {
                this.mostrarMensaje(
                    obtenerMensajeError(error),
                    true,
                );

                this.cargando = false;
            },
        });
    }

    get vuelosProgramados(): Vuelo[] {
        return this.vuelos
            .filter((vuelo) => vuelo.estado === 'Programado')
            .sort((a, b) => {
                const fechaA = `${a.fechaVuelo}T${a.horaVuelo}`;
                const fechaB = `${b.fechaVuelo}T${b.horaVuelo}`;

                return fechaA.localeCompare(fechaB);
            });
    }

    get encomiendasDelVuelo(): Encomienda[] {
        if (!this.vueloSeleccionado) {
            return [];
        }

        return this.encomiendas.filter(
            (encomienda) =>
                encomienda.vueloId === this.vueloSeleccionado?.id,
        );
    }

    get encomiendasDisponibles(): Encomienda[] {
        return this.encomiendas.filter(
            (encomienda) =>
                encomienda.estado === 'EnAlmacen' &&
                encomienda.vueloId === null,
        );
    }

    get pesoSeleccionado(): number {
        return this.encomiendasDisponibles
            .filter((encomienda) =>
                this.idsSeleccionados.has(encomienda.id),
            )
            .reduce(
                (total, encomienda) => total + encomienda.peso,
                0,
            );
    }

    get pesoRestante(): number {
        if (!this.vueloSeleccionado) {
            return 0;
        }

        return (
            this.vueloSeleccionado.pesoDisponible -
            this.pesoSeleccionado
        );
    }

    seleccionarVuelo(vuelo: Vuelo): void {
        this.vueloSeleccionado = vuelo;
        this.idsSeleccionados.clear();
        this.mensaje = '';
    }

    abrirAsignacion(): void {
        this.idsSeleccionados.clear();
        this.mostrarAsignacion = true;
    }

    cerrarAsignacion(): void {
        if (this.procesando) {
            return;
        }

        this.mostrarAsignacion = false;
    }

    alCerrarAsignacion(): void {
        if (!this.procesando) {
            this.idsSeleccionados.clear();
        }
    }

    alternarEncomienda(encomienda: Encomienda): void {
        const nuevosIds = new Set(this.idsSeleccionados);

        if (nuevosIds.has(encomienda.id)) {
            nuevosIds.delete(encomienda.id);
        } else {
            nuevosIds.add(encomienda.id);
        }

        this.idsSeleccionados = nuevosIds;
    }

    confirmarAsignacion(): void {
        if (
            !this.vueloSeleccionado ||
            this.idsSeleccionados.size === 0 ||
            this.pesoRestante < 0
        ) {
            return;
        }

        this.procesando = true;

        const vueloId = this.vueloSeleccionado.id;
        const encomiendaIds = Array.from(this.idsSeleccionados);

        this.apiService
            .asignarEncomiendas(vueloId, encomiendaIds)
            .subscribe({
                next: () => {
                    this.procesando = false;
                    this.mostrarAsignacion = false;
                    this.idsSeleccionados.clear();

                    this.mostrarMensaje(
                        'Las encomiendas fueron asignadas correctamente.',
                    );

                    this.cargarDatos(vueloId);
                },
                error: (error: unknown) => {
                    this.procesando = false;

                    this.mostrarMensaje(
                        obtenerMensajeError(error),
                        true,
                    );
                },
            });
    }

    confirmarDespacho(): void {
        if (!this.vueloSeleccionado) {
            return;
        }

        const vuelo = this.vueloSeleccionado;

        this.confirmationService.confirm({
            header: 'Despachar vuelo',
            message:
                `¿Confirmas el despacho del vuelo ${vuelo.codigoVuelo}? ` +
                'Las encomiendas asignadas pasarán al estado Embarcada.',
            icon: 'pi pi-send',
            acceptLabel: 'Sí, despachar',
            rejectLabel: 'Cancelar',
            acceptIcon: 'pi pi-send',
            rejectIcon: 'pi pi-times',
            acceptButtonProps: {
                severity: 'success',
            },
            rejectButtonProps: {
                severity: 'secondary',
                outlined: true,
            },
            accept: () => {
                this.despacharVuelo(vuelo);
            },
        });
    }

    private despacharVuelo(vuelo: Vuelo): void {
        this.procesando = true;

        this.apiService
            .despacharVuelo(vuelo.id)
            .subscribe({
                next: () => {
                    this.procesando = false;
                    this.vueloSeleccionado = null;

                    this.mostrarMensaje(
                        'El vuelo fue despachado correctamente.',
                    );

                    this.cargarDatos();
                },
                error: (error: unknown) => {
                    this.procesando = false;

                    this.mostrarMensaje(
                        obtenerMensajeError(error),
                        true,
                    );
                },
            });
    }

    confirmarCancelacion(): void {
        if (!this.vueloSeleccionado) {
            return;
        }

        const vuelo = this.vueloSeleccionado;

        this.confirmationService.confirm({
            header: 'Cancelar vuelo',
            message:
                `¿Deseas cancelar el vuelo ${vuelo.codigoVuelo}? ` +
                'Las encomiendas asignadas volverán al almacén.',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, cancelar vuelo',
            rejectLabel: 'Volver',
            acceptIcon: 'pi pi-ban',
            rejectIcon: 'pi pi-times',
            acceptButtonProps: {
                severity: 'danger',
            },
            rejectButtonProps: {
                severity: 'secondary',
                outlined: true,
            },
            accept: () => {
                this.cancelarVuelo(vuelo);
            },
        });
    }

    private cancelarVuelo(vuelo: Vuelo): void {
        this.procesando = true;

        this.apiService
            .cancelarVuelo(vuelo.id)
            .subscribe({
                next: () => {
                    this.procesando = false;
                    this.vueloSeleccionado = null;

                    this.mostrarMensaje(
                        'El vuelo fue cancelado correctamente.',
                    );

                    this.cargarDatos();
                },
                error: (error: unknown) => {
                    this.procesando = false;

                    this.mostrarMensaje(
                        obtenerMensajeError(error),
                        true,
                    );
                },
            });
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

    mostrarHora(hora: string): string {
        return hora?.substring(0, 5) ?? '';
    }

    obtenerNombreEstado(estado: string): string {
        return obtenerNombreEstado(estado);
    }

    private mostrarMensaje(
        mensaje: string,
        esError = false,
    ): void {
        this.mensaje = mensaje;
        this.mensajeEsError = esError;
    }
}