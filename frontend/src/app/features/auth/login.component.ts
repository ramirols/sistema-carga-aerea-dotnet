import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        RouterLink,
        ButtonModule,
        InputTextModule,
    ],
    template: `
    <main
      class="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-8"
    >
      <!-- Decoración de fondo -->
      <div
        class="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl"
      ></div>

      <div
        class="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"
      ></div>

      <section
        class="relative w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-8"
      >
        <!-- Logo -->
        <div class="mb-6 flex justify-center">
          <div
            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/25"
          >
            <i class="pi pi-send"></i>
          </div>
        </div>

        <!-- Encabezado -->
        <div class="text-center">
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">
            Sistema de Carga Aérea
          </h1>

          <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Administración de vuelos, encomiendas y operaciones
            logísticas.
          </p>
        </div>

        <!-- Formulario -->
        <form class="mt-8 space-y-5">
          <div>
            <label
              for="correo"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>

            <div class="relative">
              <i
                class="pi pi-envelope absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-400"
              ></i>

              <input
                id="correo"
                pInputText
                type="email"
                value="admin@cargaaerea.pe"
                disabled
                class="w-full rounded-xl pl-11"
              />
            </div>
          </div>

          <div>
            <label
              for="contrasena"
              class="mb-2 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>

            <div class="relative">
              <i
                class="pi pi-lock absolute left-4 top-1/2 z-10 -translate-y-1/2 text-sm text-slate-400"
              ></i>

              <input
                id="contrasena"
                pInputText
                type="password"
                value="12345678"
                disabled
                class="w-full rounded-xl pl-11"
              />
            </div>
          </div>

          <p-button
            label="Entrar en modo desarrollo"
            icon="pi pi-sign-in"
            routerLink="/dashboard"
            styleClass="w-full"
          />
        </form>

        <!-- Aviso -->
        <div
          class="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800"
        >
          <i class="pi pi-info-circle mt-0.5 shrink-0"></i>

          <p class="leading-5">
            El inicio de sesión real se habilitará al implementar
            usuarios, BCrypt y JWT.
          </p>
        </div>
      </section>
    </main>
  `,
})
export class LoginComponent { }