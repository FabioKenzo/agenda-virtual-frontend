import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/responsavel/home/home.component';
import { ComunicadoDetalheComponent } from './features/responsavel/comunicado-detalhe/comunicado-detalhe.component';
import { EventoDetalheComponent } from './features/responsavel/evento-detalhe/evento-detalhe.component';
import { EventosListaComponent } from './features/responsavel/eventos-lista/eventos-lista.component';
import { ResponsavelLayoutComponent } from './features/responsavel/layout/responsavel-layout/responsavel-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout.component';
import { EventosComponent } from './features/admin/eventos/eventos.component';
import { EventoFormComponent } from './features/admin/evento-form/evento-form.component';

// Guards
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    // Rotas do responsável
    {
        path: 'responsavel',
        component: ResponsavelLayoutComponent,
        canActivate: [roleGuard],
        data: { roles: ['RESPONSAVEL'] },
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'eventos',
                component: EventosListaComponent
            },
            {
                path: 'eventos/:id',
                component: EventoDetalheComponent
            },
            {
                path: 'comunicados/:id',
                component: ComunicadoDetalheComponent
            }
        ]
    },

    // Rotas do administrador
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'eventos',
                component: EventosComponent
            },
            {
                path: 'eventos/novo',
                component: EventoFormComponent
            },
            {
                path: 'eventos/:id/editar',
                component: EventoFormComponent
            }
        ]
    }

];
