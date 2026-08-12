import { Routes } from '@angular/router';

import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login.component').then(
                (component) => component.LoginComponent,
            ),
    },
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/dashboard.component').then(
                        (component) => component.DashboardComponent,
                    ),
            },
            {
                path: 'vuelos',
                loadComponent: () =>
                    import('./features/vuelos/vuelos.component').then(
                        (component) => component.VuelosComponent,
                    ),
            },
            {
                path: 'encomiendas',
                loadComponent: () =>
                    import('./features/encomiendas/encomiendas.component').then(
                        (component) => component.EncomiendasComponent,
                    ),
            },
            {
                path: 'operaciones',
                loadComponent: () =>
                    import('./features/operaciones/operaciones.component').then(
                        (component) => component.OperacionesComponent,
                    ),
            },
            {
                path: 'reportes',
                loadComponent: () =>
                    import('./features/reportes/reportes.component').then(
                        (component) => component.ReportesComponent,
                    ),
            },
            {
                path: 'usuarios',
                loadComponent: () =>
                    import('./features/usuarios/usuarios.component').then(
                        (component) => component.UsuariosComponent,
                    ),
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard',
            },
        ],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];