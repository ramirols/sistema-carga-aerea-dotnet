import {
    DatePipe,
    DecimalPipe,
} from '@angular/common';

import {
    Component,
    OnInit,
    inject,
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';

import { ApiService } from '../../core/api.service';

import {
    EstadoVuelo,
    Vuelo,
    VueloRequest,
} from '../../core/models';

import { obtenerMensajeError } from '../../shared/ui';

@Component({
    selector: 'app-vuelos',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DatePipe,
        DecimalPipe,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputTextModule,
        ProgressBarModule,
    ],
    providers: [
        ConfirmationService,
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
            Vuelos
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Programa y administra los vuelos de carga.
          </p>
        </div>

        <p-button
          label="Nuevo vuelo"
          icon="pi pi-plus"
          (onClick)="abrirNuevoVuelo()"
        />
      </header>

      <!-- Resumen -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Total de vuelos
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ vuelos.length }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
            >
              <i class="pi pi-send"></i>
            </span>
          </div>
        </article>

        <article
          class="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Programados
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ vuelosProgramados }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
            >
              <i class="pi pi-calendar"></i>
            </span>
          </div>
        </article>

        <article
          class="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Despachados
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ vuelosDespachados }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
            >
              <i class="pi pi-check-circle"></i>
            </span>
          </div>
        </article>

        <article
          class="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Cancelados
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ vuelosCancelados }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"
            >
              <i class="pi pi-times-circle"></i>
            </span>
          </div>
        </article>
      </section>

      <!-- Filtros -->
      <section
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div
          class="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <!-- Búsqueda -->
          <label class="relative flex-1">
            <span class="sr-only">
              Buscar vuelo por destino
            </span>

            <i
              class="pi pi-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400"
            ></i>

            <input
              pInputText
              type="search"
              class="w-full pl-10"
              placeholder="Buscar por destino..."
              [value]="filtroDestino"
              (input)="cambiarDestino($event)"
            />
          </label>

          <!-- Estado -->
          <div class="relative w-full lg:w-56">
            <i
              class="pi pi-filter pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-xs text-slate-400"
            ></i>

            <select
              class="h-[42px] w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-10 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              [value]="filtroEstado"
              (change)="cambiarEstado($event)"
            >
              <option value="">
                Todos los estados
              </option>

              <option value="Programado">
                Programado
              </option>

              <option value="Despachado">
                Despachado
              </option>

              <option value="Cancelado">
                Cancelado
              </option>
            </select>

            <i
              class="pi pi-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
            ></i>
          </div>

          <p-button
            label="Limpiar"
            icon="pi pi-filter-slash"
            severity="secondary"
            [outlined]="true"
            [disabled]="!hayFiltrosActivos"
            (onClick)="limpiarFiltros()"
          />
        </div>
      </section>

      <!-- Mensaje -->
      @if (mensaje) {
        <section
          class="flex items-start gap-3 rounded-2xl border p-4"
          [class.border-red-200]="mensajeEsError"
          [class.bg-red-50]="mensajeEsError"
          [class.border-emerald-200]="!mensajeEsError"
          [class.bg-emerald-50]="!mensajeEsError"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            [class.bg-red-100]="mensajeEsError"
            [class.text-red-600]="mensajeEsError"
            [class.bg-emerald-100]="!mensajeEsError"
            [class.text-emerald-600]="!mensajeEsError"
          >
            <i
              class="pi"
              [class.pi-exclamation-circle]="mensajeEsError"
              [class.pi-check-circle]="!mensajeEsError"
            ></i>
          </span>

          <div class="min-w-0 flex-1">
            <strong
              class="block text-sm font-semibold"
              [class.text-red-900]="mensajeEsError"
              [class.text-emerald-900]="!mensajeEsError"
            >
              {{ mensajeEsError ? 'No se pudo completar la operación' : 'Operación completada' }}
            </strong>

            <p
              class="mt-1 text-sm leading-6"
              [class.text-red-700]="mensajeEsError"
              [class.text-emerald-700]="!mensajeEsError"
            >
              {{ mensaje }}
            </p>
          </div>

          <button
            type="button"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
            [class.text-red-400]="mensajeEsError"
            [class.hover:bg-red-100]="mensajeEsError"
            [class.text-emerald-500]="!mensajeEsError"
            [class.hover:bg-emerald-100]="!mensajeEsError"
            aria-label="Cerrar mensaje"
            (click)="cerrarMensaje()"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </section>
      }

      <!-- Tabla -->
      <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="font-semibold text-slate-900">
              Vuelos registrados
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Programación, capacidad y estado de los vuelos.
            </p>
          </div>

          <span
            class="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {{ vuelos.length }}
            {{ vuelos.length === 1 ? 'vuelo' : 'vuelos' }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] border-collapse text-left">
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
                  Salida
                </th>

                <th class="min-w-64 px-5 py-3.5">
                  Capacidad
                </th>

                <th class="px-5 py-3.5">
                  Estado
                </th>

                <th class="px-5 py-3.5 text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              @for (vuelo of vuelos; track vuelo.id) {
                <tr class="transition-colors hover:bg-slate-50/70">
                  <!-- Código -->
                  <td class="px-5 py-4">
                    <span
                      class="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                    >
                      {{ vuelo.codigoVuelo }}
                    </span>
                  </td>

                  <!-- Destino -->
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <span
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
                      >
                        <i class="pi pi-map-marker text-sm"></i>
                      </span>

                      <div class="min-w-0">
                        <strong
                          class="block truncate text-sm font-semibold text-slate-800"
                        >
                          {{ vuelo.destino }}
                        </strong>

                        <small class="mt-0.5 block text-xs text-slate-400">
                          Destino del vuelo
                        </small>
                      </div>
                    </div>
                  </td>

                  <!-- Salida -->
                  <td class="px-5 py-4">
                    <div class="flex items-start gap-2.5">
                      <i
                        class="pi pi-calendar mt-0.5 text-sm text-slate-400"
                      ></i>

                      <div>
                        <span class="block whitespace-nowrap text-sm font-medium text-slate-700">
                          {{ vuelo.fechaVuelo | date: 'dd/MM/yyyy' }}
                        </span>

                        <small class="mt-1 block text-xs text-slate-500">
                          {{ mostrarHora(vuelo.horaVuelo) }}
                        </small>
                      </div>
                    </div>
                  </td>

                  <!-- Capacidad -->
                  <td class="px-5 py-4">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between gap-4">
                        <span class="whitespace-nowrap text-xs text-slate-500">
                          {{ vuelo.pesoActual | number: '1.0-2' }}
                          /
                          {{ vuelo.pesoMaximo | number: '1.0-2' }}
                          kg
                        </span>

                        <strong
                          class="text-xs"
                          [class.text-emerald-600]="
                            porcentajeOcupacion(vuelo) < 80
                          "
                          [class.text-amber-600]="
                            porcentajeOcupacion(vuelo) >= 80 &&
                            porcentajeOcupacion(vuelo) < 100
                          "
                          [class.text-red-600]="
                            porcentajeOcupacion(vuelo) >= 100
                          "
                        >
                          {{ porcentajeOcupacion(vuelo) | number: '1.0-0' }}%
                        </strong>
                      </div>

                      <p-progressbar
                        [value]="porcentajeOcupacion(vuelo)"
                        [showValue]="false"
                        styleClass="h-2"
                      />

                      <small class="block text-xs text-slate-500">
                        Disponible:
                        <strong class="font-semibold text-slate-700">
                          {{ vuelo.pesoDisponible | number: '1.0-2' }} kg
                        </strong>
                      </small>
                    </div>
                  </td>

                  <!-- Estado -->
                  <td class="px-5 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      [class.bg-blue-50]="vuelo.estado === 'Programado'"
                      [class.text-blue-700]="vuelo.estado === 'Programado'"
                      [class.bg-emerald-50]="vuelo.estado === 'Despachado'"
                      [class.text-emerald-700]="vuelo.estado === 'Despachado'"
                      [class.bg-red-50]="vuelo.estado === 'Cancelado'"
                      [class.text-red-700]="vuelo.estado === 'Cancelado'"
                    >
                      <span
                        class="h-1.5 w-1.5 rounded-full bg-current"
                      ></span>

                      {{ vuelo.estado }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="px-5 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <p-button
                        icon="pi pi-pencil"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        [disabled]="vuelo.estado !== 'Programado'"
                        title="Editar vuelo"
                        ariaLabel="Editar vuelo"
                        (onClick)="abrirEdicion(vuelo)"
                      />

                      <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        [text]="true"
                        [rounded]="true"
                        [disabled]="vuelo.estado !== 'Programado'"
                        title="Eliminar vuelo"
                        ariaLabel="Eliminar vuelo"
                        (onClick)="confirmarEliminacion(vuelo)"
                      />
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-5 py-16 text-center">
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
                          : 'No se encontraron vuelos'
                      }}
                    </strong>

                    <p class="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                      @if (cargando) {
                        Espera mientras obtenemos la información.
                      } @else if (hayFiltrosActivos) {
                        Prueba modificando o limpiando los filtros.
                      } @else {
                        Registra un nuevo vuelo para comenzar.
                      }
                    </p>

                    @if (!cargando && hayFiltrosActivos) {
                      <p-button
                        label="Limpiar filtros"
                        icon="pi pi-filter-slash"
                        severity="secondary"
                        [text]="true"
                        styleClass="mt-3"
                        (onClick)="limpiarFiltros()"
                      />
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Formulario -->
    <p-dialog
      [(visible)]="mostrarFormulario"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [closable]="!guardando"
      [closeOnEscape]="!guardando"
      [dismissableMask]="!guardando"
      [style]="{
        width: 'min(92vw, 680px)'
      }"
      (onHide)="cerrarFormulario()"
    >
      <ng-template #header>
        <div class="flex items-center gap-3">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
          >
            <i
              class="pi"
              [class.pi-plus]="!vueloEditado"
              [class.pi-pencil]="vueloEditado"
            ></i>
          </span>

          <div>
            <h3 class="font-semibold text-slate-900">
              {{ vueloEditado ? 'Editar vuelo' : 'Nuevo vuelo' }}
            </h3>

            <p class="mt-0.5 text-sm font-normal text-slate-500">
              Registra la programación y capacidad del vuelo.
            </p>
          </div>
        </div>
      </ng-template>

      <form
        class="space-y-5 pt-2"
        [formGroup]="formulario"
        (ngSubmit)="guardarVuelo()"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <!-- Código -->
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">
              Código del vuelo
              <span class="text-red-500">*</span>
            </span>

            <input
              pInputText
              type="text"
              class="w-full uppercase"
              formControlName="codigoVuelo"
              placeholder="Ejemplo: LA001"
              maxlength="10"
              [class.ng-invalid]="
                formulario.controls.codigoVuelo.touched &&
                formulario.controls.codigoVuelo.invalid
              "
              [class.ng-dirty]="
                formulario.controls.codigoVuelo.touched
              "
            />

            @if (
              formulario.controls.codigoVuelo.touched &&
              formulario.controls.codigoVuelo.invalid
            ) {
              <small class="mt-1.5 block text-xs text-red-600">
                Ingresa un código de hasta 10 caracteres.
              </small>
            }
          </label>

          <!-- Destino -->
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">
              Destino
              <span class="text-red-500">*</span>
            </span>

            <input
              pInputText
              type="text"
              class="w-full"
              formControlName="destino"
              placeholder="Ejemplo: Arequipa"
              maxlength="100"
              [class.ng-invalid]="
                formulario.controls.destino.touched &&
                formulario.controls.destino.invalid
              "
              [class.ng-dirty]="
                formulario.controls.destino.touched
              "
            />

            @if (
              formulario.controls.destino.touched &&
              formulario.controls.destino.invalid
            ) {
              <small class="mt-1.5 block text-xs text-red-600">
                Ingresa el destino del vuelo.
              </small>
            }
          </label>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <!-- Fecha -->
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">
              Fecha de salida
              <span class="text-red-500">*</span>
            </span>

            <input
              pInputText
              type="date"
              class="w-full"
              formControlName="fechaVuelo"
              [class.ng-invalid]="
                formulario.controls.fechaVuelo.touched &&
                formulario.controls.fechaVuelo.invalid
              "
              [class.ng-dirty]="
                formulario.controls.fechaVuelo.touched
              "
            />

            @if (
              formulario.controls.fechaVuelo.touched &&
              formulario.controls.fechaVuelo.invalid
            ) {
              <small class="mt-1.5 block text-xs text-red-600">
                Selecciona la fecha de salida.
              </small>
            }
          </label>

          <!-- Hora -->
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">
              Hora de salida
              <span class="text-red-500">*</span>
            </span>

            <input
              pInputText
              type="time"
              class="w-full"
              formControlName="horaVuelo"
              [class.ng-invalid]="
                formulario.controls.horaVuelo.touched &&
                formulario.controls.horaVuelo.invalid
              "
              [class.ng-dirty]="
                formulario.controls.horaVuelo.touched
              "
            />

            @if (
              formulario.controls.horaVuelo.touched &&
              formulario.controls.horaVuelo.invalid
            ) {
              <small class="mt-1.5 block text-xs text-red-600">
                Selecciona la hora de salida.
              </small>
            }
          </label>
        </div>

        <!-- Peso -->
        <label class="block">
          <span class="mb-2 block text-sm font-medium text-slate-700">
            Peso máximo permitido
            <span class="text-red-500">*</span>
          </span>

          <div class="relative">
            <input
              pInputText
              type="number"
              class="w-full pr-12"
              min="0.01"
              step="0.01"
              formControlName="pesoMaximo"
              placeholder="1000"
              [class.ng-invalid]="
                formulario.controls.pesoMaximo.touched &&
                formulario.controls.pesoMaximo.invalid
              "
              [class.ng-dirty]="
                formulario.controls.pesoMaximo.touched
              "
            />

            <span
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400"
            >
              kg
            </span>
          </div>

          @if (
            formulario.controls.pesoMaximo.touched &&
            formulario.controls.pesoMaximo.invalid
          ) {
            <small class="mt-1.5 block text-xs text-red-600">
              El peso máximo debe ser mayor que cero.
            </small>
          }

          @if (
            vueloEditado &&
            vueloEditado.pesoActual > 0
          ) {
            <div
              class="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700"
            >
              <i class="pi pi-info-circle mt-0.5"></i>

              <span>
                Este vuelo ya tiene
                <strong>
                  {{ vueloEditado.pesoActual | number: '1.0-2' }} kg
                </strong>
                asignados. La nueva capacidad no puede ser inferior.
              </span>
            </div>
          }
        </label>

        <!-- Acciones -->
        <footer
          class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end"
        >
          <p-button
            type="button"
            label="Cancelar"
            severity="secondary"
            [outlined]="true"
            [disabled]="guardando"
            (onClick)="cerrarFormulario()"
          />

          <p-button
            type="submit"
            [label]="
              guardando
                ? 'Guardando...'
                : vueloEditado
                  ? 'Guardar cambios'
                  : 'Guardar vuelo'
            "
            [icon]="
              guardando
                ? 'pi pi-spinner pi-spin'
                : 'pi pi-save'
            "
            [disabled]="guardando"
          />
        </footer>
      </form>
    </p-dialog>

    <!-- Confirmación -->
    <p-confirmdialog
      [style]="{
        width: 'min(92vw, 460px)'
      }"
    />
  `,
})
export class VuelosComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(
        ConfirmationService,
    );

    vuelos: Vuelo[] = [];
    vueloEditado: Vuelo | null = null;

    filtroDestino = '';
    filtroEstado: EstadoVuelo | '' = '';

    mostrarFormulario = false;
    cargando = false;
    guardando = false;

    mensaje = '';
    mensajeEsError = false;

    readonly formulario = this.formBuilder.nonNullable.group({
        codigoVuelo: [
            '',
            [
                Validators.required,
                Validators.maxLength(10),
            ],
        ],

        destino: [
            '',
            [
                Validators.required,
                Validators.maxLength(100),
            ],
        ],

        fechaVuelo: [
            '',
            Validators.required,
        ],

        horaVuelo: [
            '',
            Validators.required,
        ],

        pesoMaximo: [
            0,
            [
                Validators.required,
                Validators.min(0.01),
            ],
        ],
    });

    ngOnInit(): void {
        this.cargarVuelos();
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

    get hayFiltrosActivos(): boolean {
        return (
            this.filtroDestino.trim().length > 0 ||
            this.filtroEstado !== ''
        );
    }

    cargarVuelos(): void {
        if (this.cargando) {
            return;
        }

        this.cargando = true;

        this.apiService
            .listarVuelos(
                this.filtroDestino.trim(),
                this.filtroEstado,
            )
            .subscribe({
                next: (vuelos) => {
                    this.vuelos = vuelos;
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

    cambiarDestino(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.filtroDestino = input.value;
        this.cargarVuelos();
    }

    cambiarEstado(event: Event): void {
        const select = event.target as HTMLSelectElement;

        this.filtroEstado =
            select.value as EstadoVuelo | '';

        this.cargarVuelos();
    }

    limpiarFiltros(): void {
        this.filtroDestino = '';
        this.filtroEstado = '';
        this.cargarVuelos();
    }

    abrirNuevoVuelo(): void {
        this.vueloEditado = null;

        this.formulario.reset({
            codigoVuelo: '',
            destino: '',
            fechaVuelo: '',
            horaVuelo: '',
            pesoMaximo: 0,
        });

        this.mostrarFormulario = true;
    }

    abrirEdicion(vuelo: Vuelo): void {
        if (vuelo.estado !== 'Programado') {
            return;
        }

        this.vueloEditado = vuelo;

        this.formulario.setValue({
            codigoVuelo: vuelo.codigoVuelo,
            destino: vuelo.destino,
            fechaVuelo: vuelo.fechaVuelo,
            horaVuelo: vuelo.horaVuelo.substring(0, 5),
            pesoMaximo: vuelo.pesoMaximo,
        });

        this.mostrarFormulario = true;
    }

    cerrarFormulario(): void {
        if (this.guardando) {
            return;
        }

        this.mostrarFormulario = false;
        this.vueloEditado = null;
        this.formulario.markAsUntouched();
    }

    guardarVuelo(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const valores = this.formulario.getRawValue();

        if (
            this.vueloEditado &&
            valores.pesoMaximo < this.vueloEditado.pesoActual
        ) {
            this.formulario.controls.pesoMaximo.setErrors({
                capacidadInsuficiente: true,
            });

            this.formulario.controls.pesoMaximo.markAsTouched();

            this.mostrarMensaje(
                'La capacidad máxima no puede ser menor que el peso ya asignado.',
                true,
            );

            return;
        }

        this.guardando = true;

        const request: VueloRequest = {
            ...valores,
            codigoVuelo: valores.codigoVuelo
                .trim()
                .toUpperCase(),
            destino: valores.destino.trim(),
            horaVuelo:
                valores.horaVuelo.length === 5
                    ? `${valores.horaVuelo}:00`
                    : valores.horaVuelo,
        };

        const peticion = this.vueloEditado
            ? this.apiService.actualizarVuelo(
                this.vueloEditado.id,
                request,
            )
            : this.apiService.crearVuelo(request);

        peticion.subscribe({
            next: () => {
                const estabaEditando =
                    this.vueloEditado !== null;

                this.guardando = false;
                this.mostrarFormulario = false;
                this.vueloEditado = null;

                this.mostrarMensaje(
                    estabaEditando
                        ? 'El vuelo fue actualizado correctamente.'
                        : 'El vuelo fue registrado correctamente.',
                );

                this.cargarVuelos();
            },

            error: (error: unknown) => {
                this.guardando = false;

                this.mostrarMensaje(
                    obtenerMensajeError(error),
                    true,
                );
            },
        });
    }

    confirmarEliminacion(vuelo: Vuelo): void {
        if (vuelo.estado !== 'Programado') {
            return;
        }

        this.confirmationService.confirm({
            header: 'Eliminar vuelo',
            icon: 'pi pi-exclamation-triangle',
            message:
                `¿Deseas eliminar el vuelo ${vuelo.codigoVuelo} con destino a ${vuelo.destino}?`,

            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',

            acceptIcon: 'pi pi-trash',
            rejectIcon: 'pi pi-times',

            acceptButtonProps: {
                severity: 'danger',
            },

            rejectButtonProps: {
                severity: 'secondary',
                outlined: true,
            },

            accept: () => {
                this.eliminarVuelo(vuelo);
            },
        });
    }

    eliminarVuelo(vuelo: Vuelo): void {
        this.apiService
            .eliminarVuelo(vuelo.id)
            .subscribe({
                next: () => {
                    this.mostrarMensaje(
                        `El vuelo ${vuelo.codigoVuelo} fue eliminado correctamente.`,
                    );

                    this.cargarVuelos();
                },

                error: (error: unknown) => {
                    this.mostrarMensaje(
                        obtenerMensajeError(error),
                        true,
                    );
                },
            });
    }

    mostrarHora(hora: string): string {
        return hora.substring(0, 5);
    }

    porcentajeOcupacion(vuelo: Vuelo): number {
        if (vuelo.pesoMaximo <= 0) {
            return 0;
        }

        const porcentaje =
            (vuelo.pesoActual / vuelo.pesoMaximo) * 100;

        return Math.min(
            100,
            Math.max(0, porcentaje),
        );
    }

    cerrarMensaje(): void {
        this.mensaje = '';
        this.mensajeEsError = false;
    }

    private mostrarMensaje(
        mensaje: string,
        esError = false,
    ): void {
        this.mensaje = mensaje;
        this.mensajeEsError = esError;
    }
}