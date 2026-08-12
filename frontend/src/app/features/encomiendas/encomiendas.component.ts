import { DecimalPipe } from '@angular/common';
import {
    Component,
    OnInit,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { ApiService } from '../../core/api.service';
import {
    Encomienda,
    EncomiendaRequest,
    EstadoEncomienda,
} from '../../core/models';
import {
    obtenerMensajeError,
    obtenerNombreEstado,
} from '../../shared/ui';

interface OpcionEstado {
    label: string;
    value: EstadoEncomienda | '';
}

@Component({
    selector: 'app-encomiendas',
    standalone: true,
    providers: [ConfirmationService],
    imports: [
        DecimalPipe,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        ButtonModule,
        ConfirmDialogModule,
        DialogModule,
        InputNumberModule,
        InputTextModule,
        SelectModule,
        TextareaModule,
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
            Encomiendas
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Registra y controla la carga recibida.
          </p>
        </div>

        <p-button
          label="Nueva encomienda"
          icon="pi pi-plus"
          (onClick)="abrirNuevaEncomienda()"
        />
      </header>

      <!-- Filtros -->
      <section
        class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
      >
        <div class="relative w-full sm:max-w-xs">
          <p-select
            inputId="filtroEstado"
            [options]="opcionesEstado"
            [(ngModel)]="filtroEstado"
            optionLabel="label"
            optionValue="value"
            placeholder="Todos los estados"
            styleClass="w-full"
            (onChange)="cargarEncomiendas()"
          />
        </div>

        <p-button
          label="Limpiar filtro"
          icon="pi pi-filter-slash"
          severity="secondary"
          [outlined]="true"
          [disabled]="!filtroEstado"
          (onClick)="limpiarFiltro()"
        />

        <div class="sm:ml-auto">
          <span class="text-sm text-slate-500">
            {{ encomiendas.length }}
            {{ encomiendas.length === 1 ? 'resultado' : 'resultados' }}
          </span>
        </div>
      </section>

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

      <!-- Tabla -->
      <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="flex items-center justify-between border-b border-slate-200 px-5 py-4"
        >
          <div>
            <h3 class="font-semibold text-slate-900">
              Carga registrada
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Información de las encomiendas recibidas.
            </p>
          </div>

          <p-button
            icon="pi pi-refresh"
            severity="secondary"
            [text]="true"
            [rounded]="true"
            [loading]="cargando"
            ariaLabel="Actualizar encomiendas"
            pTooltip="Actualizar"
            tooltipPosition="left"
            (onClick)="cargarEncomiendas()"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[1000px] border-collapse">
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
                  Descripción
                </th>

                <th
                  class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Peso
                </th>

                <th
                  class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Envío
                </th>

                <th
                  class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Vuelo
                </th>

                <th
                  class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Estado
                </th>

                <th
                  class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              @for (encomienda of encomiendas; track encomienda.id) {
                <tr class="transition-colors hover:bg-slate-50/70">
                  <!-- Código -->
                  <td class="whitespace-nowrap px-5 py-4">
                    <span
                      class="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                    >
                      {{ encomienda.codigo }}
                    </span>
                  </td>

                  <!-- Descripción -->
                  <td class="max-w-64 px-5 py-4">
                    <p
                      class="truncate text-sm font-medium text-slate-700"
                      [title]="encomienda.descripcion"
                    >
                      {{ encomienda.descripcion }}
                    </p>
                  </td>

                  <!-- Peso -->
                  <td class="whitespace-nowrap px-5 py-4">
                    <div class="flex items-center gap-2 text-sm text-slate-700">
                      <i class="pi pi-box text-xs text-slate-400"></i>

                      <span class="font-medium">
                        {{ encomienda.peso | number: '1.0-2' }} kg
                      </span>
                    </div>
                  </td>

                  <!-- Personas -->
                  <td class="px-5 py-4">
                    <div class="flex min-w-48 items-center gap-3">
                      <span
                        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                      >
                        <i class="pi pi-user text-sm"></i>
                      </span>

                      <div class="min-w-0">
                        <p
                          class="truncate text-sm font-medium text-slate-700"
                          [title]="encomienda.remitente"
                        >
                          {{ encomienda.remitente }}
                        </p>

                        <div
                          class="mt-1 flex items-center gap-1.5 text-xs text-slate-500"
                        >
                          <i class="pi pi-arrow-right text-[10px]"></i>

                          <span
                            class="truncate"
                            [title]="encomienda.destinatario"
                          >
                            {{ encomienda.destinatario }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Vuelo -->
                  <td class="whitespace-nowrap px-5 py-4">
                    @if (encomienda.codigoVuelo) {
                      <span
                        class="inline-flex items-center gap-2 text-sm font-medium text-slate-700"
                      >
                        <i class="pi pi-send text-xs text-blue-500"></i>
                        {{ encomienda.codigoVuelo }}
                      </span>
                    } @else {
                      <span class="text-sm text-slate-400">
                        Sin asignar
                      </span>
                    }
                  </td>

                  <!-- Estado -->
                  <td class="whitespace-nowrap px-5 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      [class]="obtenerClaseEstadoTailwind(encomienda.estado)"
                    >
                      <span
                        class="h-1.5 w-1.5 rounded-full bg-current"
                      ></span>

                      {{ obtenerNombreEstado(encomienda.estado) }}
                    </span>
                  </td>

                  <!-- Acciones -->
                  <td class="whitespace-nowrap px-5 py-4">
                    <div class="flex justify-end gap-1">
                      <p-button
                        icon="pi pi-pencil"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        [disabled]="encomienda.estado !== 'EnAlmacen'"
                        ariaLabel="Editar encomienda"
                        pTooltip="Editar"
                        tooltipPosition="top"
                        (onClick)="abrirEdicion(encomienda)"
                      />

                      <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        [text]="true"
                        [rounded]="true"
                        [disabled]="encomienda.estado !== 'EnAlmacen'"
                        ariaLabel="Eliminar encomienda"
                        pTooltip="Eliminar"
                        tooltipPosition="top"
                        (onClick)="confirmarEliminacion(encomienda)"
                      />
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-5 py-16 text-center">
                    <div
                      class="mx-auto flex max-w-sm flex-col items-center"
                    >
                      <span
                        class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400"
                      >
                        <i
                          class="pi"
                          [class.pi-spin]="cargando"
                          [class.pi-spinner]="cargando"
                          [class.pi-box]="!cargando"
                        ></i>
                      </span>

                      <strong class="mt-4 text-sm text-slate-700">
                        {{
                          cargando
                            ? 'Cargando encomiendas'
                            : 'No se encontraron encomiendas'
                        }}
                      </strong>

                      <span class="mt-1 text-sm text-slate-500">
                        @if (cargando) {
                          Espera mientras obtenemos la información.
                        } @else if (filtroEstado) {
                          No existen resultados para el filtro seleccionado.
                        } @else {
                          Registra una encomienda para comenzar.
                        }
                      </span>

                      @if (!cargando && !filtroEstado) {
                        <p-button
                          label="Nueva encomienda"
                          icon="pi pi-plus"
                          [outlined]="true"
                          styleClass="mt-5"
                          (onClick)="abrirNuevaEncomienda()"
                        />
                      }
                    </div>
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
      [style]="{ width: 'min(94vw, 720px)' }"
      styleClass="overflow-hidden"
      (onHide)="alCerrarDialogo()"
    >
      <ng-template #header>
        <div class="flex items-center gap-3">
          <span
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
          >
            <i
              class="pi"
              [class.pi-plus]="!encomiendaEditada"
              [class.pi-pencil]="encomiendaEditada"
            ></i>
          </span>

          <div>
            <h3 class="font-semibold text-slate-900">
              {{
                encomiendaEditada
                  ? 'Editar encomienda'
                  : 'Nueva encomienda'
              }}
            </h3>

            <p class="mt-0.5 text-sm font-normal text-slate-500">
              Registra los datos principales de la carga.
            </p>
          </div>
        </div>
      </ng-template>

      <form
        id="formulario-encomienda"
        class="space-y-5 pt-2"
        [formGroup]="formulario"
        (ngSubmit)="guardarEncomienda()"
      >
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <!-- Código -->
          <div>
            <label
              for="codigo"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              Código
              <span class="text-red-500">*</span>
            </label>

            <input
              id="codigo"
              pInputText
              type="text"
              formControlName="codigo"
              placeholder="Ejemplo: ENC001"
              class="w-full"
              [class.ng-invalid]="campoInvalido('codigo')"
              [class.ng-dirty]="campoInvalido('codigo')"
            />

            @if (campoInvalido('codigo')) {
              <small class="mt-1.5 block text-xs text-red-600">
                Ingresa un código de hasta 20 caracteres.
              </small>
            }
          </div>

          <!-- Peso -->
          <div>
            <label
              for="peso"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              Peso
              <span class="text-red-500">*</span>
            </label>

            <p-inputnumber
              inputId="peso"
              formControlName="peso"
              mode="decimal"
              suffix=" kg"
              [min]="0.01"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              placeholder="0.00 kg"
              styleClass="w-full"
              inputStyleClass="w-full"
              [invalid]="campoInvalido('peso')"
            />

            @if (campoInvalido('peso')) {
              <small class="mt-1.5 block text-xs text-red-600">
                El peso debe ser mayor a 0 kg.
              </small>
            }
          </div>
        </div>

        <!-- Descripción -->
        <div>
          <div class="mb-2 flex items-center justify-between gap-3">
            <label
              for="descripcion"
              class="text-sm font-medium text-slate-700"
            >
              Descripción
              <span class="text-red-500">*</span>
            </label>

            <span class="text-xs text-slate-400">
              {{ formulario.controls.descripcion.value.length }}/250
            </span>
          </div>

          <textarea
            id="descripcion"
            pTextarea
            rows="3"
            formControlName="descripcion"
            placeholder="Describe brevemente la carga recibida"
            class="w-full resize-none"
            [class.ng-invalid]="campoInvalido('descripcion')"
            [class.ng-dirty]="campoInvalido('descripcion')"
          ></textarea>

          @if (campoInvalido('descripcion')) {
            <small class="mt-1.5 block text-xs text-red-600">
              Ingresa una descripción de hasta 250 caracteres.
            </small>
          }
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <!-- Remitente -->
          <div>
            <label
              for="remitente"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              Remitente
              <span class="text-red-500">*</span>
            </label>

            <div class="relative">
              <i
                class="pi pi-user absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-400"
              ></i>

              <input
                id="remitente"
                pInputText
                type="text"
                formControlName="remitente"
                placeholder="Persona o empresa remitente"
                class="w-full pl-10"
                [class.ng-invalid]="campoInvalido('remitente')"
                [class.ng-dirty]="campoInvalido('remitente')"
              />
            </div>

            @if (campoInvalido('remitente')) {
              <small class="mt-1.5 block text-xs text-red-600">
                Ingresa el nombre del remitente.
              </small>
            }
          </div>

          <!-- Destinatario -->
          <div>
            <label
              for="destinatario"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              Destinatario
              <span class="text-red-500">*</span>
            </label>

            <div class="relative">
              <i
                class="pi pi-map-marker absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-400"
              ></i>

              <input
                id="destinatario"
                pInputText
                type="text"
                formControlName="destinatario"
                placeholder="Persona o empresa destinataria"
                class="w-full pl-10"
                [class.ng-invalid]="campoInvalido('destinatario')"
                [class.ng-dirty]="campoInvalido('destinatario')"
              />
            </div>

            @if (campoInvalido('destinatario')) {
              <small class="mt-1.5 block text-xs text-red-600">
                Ingresa el nombre del destinatario.
              </small>
            }
          </div>
        </div>

        @if (formulario.touched && formulario.invalid) {
          <div
            class="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
          >
            <i class="pi pi-info-circle mt-0.5"></i>
            <span>Revisa los campos señalados antes de continuar.</span>
          </div>
        }
      </form>

      <ng-template #footer>
        <div
          class="flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end"
        >
          <p-button
            label="Cancelar"
            severity="secondary"
            [outlined]="true"
            [disabled]="guardando"
            styleClass="w-full sm:w-auto"
            (onClick)="cerrarFormulario()"
          />

          <p-button
            [label]="
              encomiendaEditada
                ? 'Guardar cambios'
                : 'Guardar encomienda'
            "
            icon="pi pi-save"
            type="submit"
            form="formulario-encomienda"
            [loading]="guardando"
            styleClass="w-full sm:w-auto"
          />
        </div>
      </ng-template>
    </p-dialog>

    <!-- Confirmación de eliminación -->
    <p-confirmdialog
      [style]="{ width: 'min(92vw, 430px)' }"
    />
  `,
})
export class EncomiendasComponent implements OnInit {
    private readonly apiService = inject(ApiService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);

    encomiendas: Encomienda[] = [];
    encomiendaEditada: Encomienda | null = null;

    filtroEstado: EstadoEncomienda | '' = '';
    mostrarFormulario = false;
    cargando = false;
    guardando = false;

    mensaje = '';
    mensajeEsError = false;

    readonly opcionesEstado: OpcionEstado[] = [
        {
            label: 'Todos los estados',
            value: '',
        },
        {
            label: 'En almacén',
            value: 'EnAlmacen',
        },
        {
            label: 'Asignada',
            value: 'Asignada',
        },
        {
            label: 'Embarcada',
            value: 'Embarcada',
        },
    ];

    readonly formulario = this.formBuilder.nonNullable.group({
        codigo: [
            '',
            [
                Validators.required,
                Validators.maxLength(20),
            ],
        ],
        descripcion: [
            '',
            [
                Validators.required,
                Validators.maxLength(250),
            ],
        ],
        peso: [
            0,
            [
                Validators.required,
                Validators.min(0.01),
            ],
        ],
        remitente: [
            '',
            [
                Validators.required,
                Validators.maxLength(150),
            ],
        ],
        destinatario: [
            '',
            [
                Validators.required,
                Validators.maxLength(150),
            ],
        ],
    });

    ngOnInit(): void {
        this.cargarEncomiendas();
    }

    cargarEncomiendas(): void {
        this.cargando = true;

        this.apiService
            .listarEncomiendas(this.filtroEstado)
            .subscribe({
                next: (encomiendas) => {
                    this.encomiendas = encomiendas;
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

    limpiarFiltro(): void {
        this.filtroEstado = '';
        this.cargarEncomiendas();
    }

    abrirNuevaEncomienda(): void {
        this.encomiendaEditada = null;

        this.formulario.reset({
            codigo: '',
            descripcion: '',
            peso: 0,
            remitente: '',
            destinatario: '',
        });

        this.mostrarFormulario = true;
    }

    abrirEdicion(encomienda: Encomienda): void {
        this.encomiendaEditada = encomienda;

        this.formulario.reset({
            codigo: encomienda.codigo,
            descripcion: encomienda.descripcion,
            peso: encomienda.peso,
            remitente: encomienda.remitente,
            destinatario: encomienda.destinatario,
        });

        this.mostrarFormulario = true;
    }

    cerrarFormulario(): void {
        if (this.guardando) {
            return;
        }

        this.mostrarFormulario = false;
    }

    alCerrarDialogo(): void {
        if (this.guardando) {
            return;
        }

        this.encomiendaEditada = null;
        this.formulario.markAsUntouched();
        this.formulario.markAsPristine();
    }

    guardarEncomienda(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        this.guardando = true;

        const request: EncomiendaRequest =
            this.formulario.getRawValue();

        const peticion = this.encomiendaEditada
            ? this.apiService.actualizarEncomienda(
                this.encomiendaEditada.id,
                request,
            )
            : this.apiService.crearEncomienda(request);

        peticion.subscribe({
            next: () => {
                this.guardando = false;
                this.mostrarFormulario = false;
                this.encomiendaEditada = null;

                this.mostrarMensaje(
                    'La encomienda fue guardada correctamente.',
                );

                this.cargarEncomiendas();
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

    confirmarEliminacion(encomienda: Encomienda): void {
        this.confirmationService.confirm({
            header: 'Eliminar encomienda',
            message:
                `¿Deseas eliminar la encomienda ${encomienda.codigo}? ` +
                'Esta acción no se puede deshacer.',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
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
                this.eliminarEncomienda(encomienda);
            },
        });
    }

    eliminarEncomienda(encomienda: Encomienda): void {
        this.apiService
            .eliminarEncomienda(encomienda.id)
            .subscribe({
                next: () => {
                    this.mostrarMensaje(
                        'La encomienda fue eliminada correctamente.',
                    );

                    this.cargarEncomiendas();
                },
                error: (error: unknown) => {
                    this.mostrarMensaje(
                        obtenerMensajeError(error),
                        true,
                    );
                },
            });
    }

    campoInvalido(
        campo: keyof typeof this.formulario.controls,
    ): boolean {
        const control = this.formulario.controls[campo];

        return control.invalid && control.touched;
    }

    obtenerNombreEstado(estado: string): string {
        return obtenerNombreEstado(estado);
    }

    obtenerClaseEstadoTailwind(estado: string): string {
        switch (estado) {
            case 'EnAlmacen':
                return 'bg-blue-50 text-blue-700';

            case 'Asignada':
                return 'bg-amber-50 text-amber-700';

            case 'Embarcada':
                return 'bg-emerald-50 text-emerald-700';

            default:
                return 'bg-slate-100 text-slate-600';
        }
    }

    private mostrarMensaje(
        mensaje: string,
        esError = false,
    ): void {
        this.mensaje = mensaje;
        this.mensajeEsError = esError;
    }
}