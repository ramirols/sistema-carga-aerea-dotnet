import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface UsuarioProvisional {
    iniciales: string;
    nombre: string;
    correo: string;
    rol: string;
    estado: 'Activo' | 'Inactivo';
}

@Component({
    selector: 'app-usuarios',
    standalone: true,
    imports: [
        ButtonModule,
        TagModule,
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
            Usuarios
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Administración de accesos y perfiles del sistema.
          </p>
        </div>

        <p-button
          label="Nuevo usuario"
          icon="pi pi-user-plus"
          [disabled]="true"
          title="Disponible al implementar la autenticación"
        />
      </header>

      <!-- Aviso informativo -->
      <section
        class="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4"
      >
        <span
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
        >
          <i class="pi pi-info-circle"></i>
        </span>

        <div class="min-w-0">
          <strong class="block text-sm font-semibold text-blue-900">
            Módulo en preparación
          </strong>

          <p class="mt-1 text-sm leading-6 text-blue-700">
            La gestión completa estará disponible cuando se implementen la
            entidad Usuario, los roles, BCrypt y la autenticación con JWT.
          </p>
        </div>
      </section>

      <!-- Resumen -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Usuarios registrados
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ usuarios.length }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
            >
              <i class="pi pi-users"></i>
            </span>
          </div>
        </article>

        <article
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Usuarios activos
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ usuariosActivos }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
            >
              <i class="pi pi-user"></i>
            </span>
          </div>
        </article>

        <article
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <span class="text-sm font-medium text-slate-500">
                Roles configurados
              </span>

              <strong
                class="mt-2 block text-3xl font-bold tracking-tight text-slate-900"
              >
                {{ cantidadRoles }}
              </strong>
            </div>

            <span
              class="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600"
            >
              <i class="pi pi-shield"></i>
            </span>
          </div>
        </article>
      </section>

      <!-- Tabla de usuarios -->
      <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div
          class="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 class="font-semibold text-slate-900">
              Usuarios del sistema
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Vista provisional de las cuentas con acceso.
            </p>
          </div>

          <span
            class="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {{ usuarios.length }}
            {{ usuarios.length === 1 ? 'usuario' : 'usuarios' }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr
                class="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                <th class="px-5 py-3.5">
                  Usuario
                </th>

                <th class="px-5 py-3.5">
                  Correo
                </th>

                <th class="px-5 py-3.5">
                  Rol
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
              @for (usuario of usuarios; track usuario.correo) {
                <tr class="transition-colors hover:bg-slate-50/70">
                  <!-- Usuario -->
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <span
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-600/20"
                      >
                        {{ usuario.iniciales }}
                      </span>

                      <div class="min-w-0">
                        <strong
                          class="block truncate text-sm font-semibold text-slate-800"
                        >
                          {{ usuario.nombre }}
                        </strong>

                        <span class="mt-0.5 block text-xs text-slate-400">
                          Cuenta del sistema
                        </span>
                      </div>
                    </div>
                  </td>

                  <!-- Correo -->
                  <td class="px-5 py-4">
                    <a
                      [href]="'mailto:' + usuario.correo"
                      class="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-blue-600"
                    >
                      <i class="pi pi-envelope text-xs text-slate-400"></i>

                      {{ usuario.correo }}
                    </a>
                  </td>

                  <!-- Rol -->
                  <td class="px-5 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700"
                    >
                      <i class="pi pi-shield text-[10px]"></i>

                      {{ usuario.rol }}
                    </span>
                  </td>

                  <!-- Estado -->
                  <td class="px-5 py-4">
                    <p-tag
                      [value]="usuario.estado"
                      [severity]="
                        usuario.estado === 'Activo'
                          ? 'success'
                          : 'secondary'
                      "
                      [rounded]="true"
                    />
                  </td>

                  <!-- Acciones -->
                  <td class="px-5 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <p-button
                        icon="pi pi-pencil"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        [disabled]="true"
                        title="Disponible próximamente"
                        ariaLabel="Editar usuario"
                      />

                      <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        [text]="true"
                        [rounded]="true"
                        [disabled]="true"
                        title="Disponible próximamente"
                        ariaLabel="Eliminar usuario"
                      />
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-5 py-16 text-center">
                    <span
                      class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400"
                    >
                      <i class="pi pi-users"></i>
                    </span>

                    <strong class="mt-4 block text-sm text-slate-700">
                      No hay usuarios registrados
                    </strong>

                    <p class="mt-1 text-sm text-slate-500">
                      Los usuarios aparecerán aquí cuando sean creados.
                    </p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Próxima implementación -->
      <section
        class="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm"
      >
        <!-- Decoración -->
        <div
          class="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl"
        ></div>

        <div
          class="relative flex flex-col gap-5 sm:flex-row sm:items-center"
        >
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl text-blue-300"
          >
            <i class="pi pi-lock"></i>
          </span>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-semibold text-white">
                Seguridad pendiente de implementación
              </h3>

              <span
                class="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[11px] font-semibold text-blue-300"
              >
                Próxima etapa
              </span>
            </div>

            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Se incorporará inicio de sesión real, cifrado de contraseñas,
              autorización por roles, tokens JWT y protección de rutas.
            </p>
          </div>

          <span
            class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-500 sm:flex"
          >
            <i class="pi pi-arrow-right text-sm"></i>
          </span>
        </div>
      </section>
    </div>
  `,
})
export class UsuariosComponent {
    readonly usuarios: UsuarioProvisional[] = [
        {
            iniciales: 'AD',
            nombre: 'Administrador',
            correo: 'admin@cargaaerea.pe',
            rol: 'Administrador',
            estado: 'Activo',
        },
    ];

    get usuariosActivos(): number {
        return this.usuarios.filter(
            (usuario) => usuario.estado === 'Activo',
        ).length;
    }

    get cantidadRoles(): number {
        return new Set(
            this.usuarios.map((usuario) => usuario.rol),
        ).size;
    }
}