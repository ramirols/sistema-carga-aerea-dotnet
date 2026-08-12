import { Component } from '@angular/core';
import {
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
} from '@angular/router';

import { ButtonModule } from 'primeng/button';

interface MenuItem {
    path: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        ButtonModule,
    ],
    template: `
    <div class="min-h-screen bg-slate-50">
      <!-- Fondo oscuro del menú móvil -->
      @if (menuAbierto) {
        <button
          type="button"
          class="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Cerrar menú lateral"
          (click)="cerrarMenu()"
        ></button>
      }

      <!-- Menú lateral -->
      <aside
        class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none"
        [class.translate-x-0]="menuAbierto"
        [class.-translate-x-full]="!menuAbierto"
      >
        <!-- Marca -->
        <div
          class="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5"
        >
          <a
            routerLink="/dashboard"
            class="flex min-w-0 items-center gap-3"
            (click)="cerrarMenu()"
          >
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg text-white shadow-sm shadow-blue-600/30"
            >
              <i class="pi pi-send"></i>
            </span>

            <span class="min-w-0">
              <strong
                class="block truncate text-base font-bold tracking-tight text-slate-900"
              >
                Carga Aérea
              </strong>

              <small class="mt-0.5 block text-xs text-slate-500">
                Panel de gestión
              </small>
            </span>
          </a>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Cerrar menú"
            (click)="cerrarMenu()"
          >
            <i class="pi pi-times text-sm"></i>
          </button>
        </div>

        <!-- Navegación -->
        <div class="flex-1 overflow-y-auto px-4 py-6">
          <p
            class="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400"
          >
            Menú principal
          </p>

          <nav class="space-y-1.5" aria-label="Navegación principal">
            @for (item of menuItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive
                #linkActivo="routerLinkActive"
                [routerLinkActiveOptions]="{ exact: true }"
                class="group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
                [class.bg-blue-50]="linkActivo.isActive"
                [class.text-blue-700]="linkActivo.isActive"
                [class.text-slate-600]="!linkActivo.isActive"
                [class.hover:bg-slate-50]="!linkActivo.isActive"
                [class.hover:text-slate-900]="!linkActivo.isActive"
                [attr.aria-current]="
                  linkActivo.isActive ? 'page' : null
                "
                (click)="cerrarMenu()"
              >
                <!-- Indicador de ruta activa -->
                @if (linkActivo.isActive) {
                  <span
                    class="absolute -left-4 h-7 w-1 rounded-r-full bg-blue-600"
                  ></span>
                }

                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition"
                  [class.bg-blue-100]="linkActivo.isActive"
                  [class.text-blue-600]="linkActivo.isActive"
                  [class.bg-slate-100]="!linkActivo.isActive"
                  [class.text-slate-500]="!linkActivo.isActive"
                  [class.group-hover:bg-white]="!linkActivo.isActive"
                >
                  <i [class]="item.icon"></i>
                </span>

                <span class="flex-1">
                  {{ item.label }}
                </span>

                @if (linkActivo.isActive) {
                  <i class="pi pi-chevron-right text-[10px] text-blue-500"></i>
                }
              </a>
            }
          </nav>
        </div>

        <!-- Estado del sistema -->
        <div class="px-4 pb-4">
          <div
            class="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2.5"
          >
            <span class="relative flex h-2.5 w-2.5 shrink-0">
              <span
                class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40"
              ></span>

              <span
                class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"
              ></span>
            </span>

            <div class="min-w-0">
              <span class="block text-xs font-semibold text-emerald-700">
                Sistema operativo
              </span>

              <small class="block text-[11px] text-emerald-600/80">
                Servicios funcionando
              </small>
            </div>
          </div>
        </div>

        <!-- Perfil -->
        <div class="border-t border-slate-100 p-4">
          <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white"
            >
              AD
            </span>

            <div class="min-w-0 flex-1">
              <strong
                class="block truncate text-sm font-semibold text-slate-800"
              >
                Administrador
              </strong>

              <small class="mt-0.5 block truncate text-xs text-slate-500">
                Sesión de desarrollo
              </small>
            </div>

            <a
              routerLink="/login"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              (click)="cerrarMenu()"
            >
              <i class="pi pi-sign-out text-sm"></i>
            </a>
          </div>
        </div>
      </aside>

      <!-- Área principal -->
      <div class="min-h-screen lg:pl-72">
        <!-- Barra superior -->
        <header
          class="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8"
        >
          <p-button
            icon="pi pi-bars"
            severity="secondary"
            [text]="true"
            [rounded]="true"
            ariaLabel="Abrir menú"
            styleClass="lg:hidden"
            (onClick)="alternarMenu()"
          />

          <div class="min-w-0 flex-1">
            <h1
              class="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
            >
              Sistema de Carga Aérea
            </h1>

            <p class="mt-0.5 hidden text-xs text-slate-500 sm:block">
              Control operativo y logístico
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-1 sm:gap-2">
            <div
              class="mr-1 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 md:flex"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-500"></span>

              <span class="text-xs font-medium text-slate-600">
                En línea
              </span>
            </div>

            <div class="relative">
              <p-button
                icon="pi pi-bell"
                severity="secondary"
                [text]="true"
                [rounded]="true"
                ariaLabel="Notificaciones"
              />

              <span
                class="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"
              ></span>
            </div>

            <div class="ml-1 hidden h-8 w-px bg-slate-200 sm:block"></div>

            <div class="ml-1 hidden items-center gap-2.5 sm:flex">
              <span
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white"
              >
                AD
              </span>

              <div class="hidden xl:block">
                <strong class="block text-xs font-semibold text-slate-800">
                  Administrador
                </strong>

                <small class="block text-[11px] text-slate-500">
                  Acceso completo
                </small>
              </div>
            </div>
          </div>
        </header>

        <!-- Contenido de las páginas -->
        <main class="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div class="mx-auto w-full max-w-[1600px]">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {
    menuAbierto = false;

    readonly menuItems: MenuItem[] = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: 'pi pi-chart-pie',
        },
        {
            path: '/vuelos',
            label: 'Vuelos',
            icon: 'pi pi-send',
        },
        {
            path: '/encomiendas',
            label: 'Encomiendas',
            icon: 'pi pi-box',
        },
        {
            path: '/operaciones',
            label: 'Operaciones',
            icon: 'pi pi-bolt',
        },
        {
            path: '/reportes',
            label: 'Reportes',
            icon: 'pi pi-chart-bar',
        },
        {
            path: '/usuarios',
            label: 'Usuarios',
            icon: 'pi pi-users',
        },
    ];

    alternarMenu(): void {
        this.menuAbierto = !this.menuAbierto;
    }

    cerrarMenu(): void {
        this.menuAbierto = false;
    }
}