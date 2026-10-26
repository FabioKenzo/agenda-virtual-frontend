import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/responsavel/home/home.component';
import { ComunicadoDetalheComponent } from './features/responsavel/comunicado-detalhe/comunicado-detalhe.component';
import { EventoDetalheComponent } from './features/responsavel/evento-detalhe/evento-detalhe.component';
import { roleGuard } from './core/guards/role.guard';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminLayoutComponent } from './features/admin/layout/admin-layout/admin-layout.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'responsavel',
        component: HomeComponent,
        canActivate: [roleGuard],
        data: { roles: ['RESPONSAVEL'] }
    },

    {
        path: 'responsavel/comunicados/:id',
        component: ComunicadoDetalheComponent,
        canActivate: [roleGuard],
        data: { roles: ['RESPONSAVEL'] }
    },

    {
        path: 'responsavel/eventos/:id',
        component: EventoDetalheComponent,
        canActivate: [roleGuard],
        data: { roles: ['RESPONSAVEL'] }
    },

    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
            {
                path: '',
                component: DashboardComponent
            }
        ]
    }

];