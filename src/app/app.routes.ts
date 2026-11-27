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
import { ComunicadosListaComponent } from './features/responsavel/comunicados-lista/comunicados-lista.component';
import { PerfilComponent } from './features/responsavel/perfil/perfil.component';
import { ComunicadosComponent } from './features/admin/comunicados/comunicados.component';
import { ComunicadoFormComponent } from './features/admin/comunicado-form/comunicado-form.component';
import { AlunosCadastroComponent } from './features/responsavel/alunos-cadastro/alunos-cadastro.component';


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
            { path: '', component: HomeComponent },
            { path: 'eventos', component: EventosListaComponent },
            { path: 'eventos/:id', component: EventoDetalheComponent },
            { path: 'comunicados', component: ComunicadosListaComponent },
            { path: 'comunicados/:id', component: ComunicadoDetalheComponent },
            { path: 'perfil', component: PerfilComponent },
            { path: 'alunos/cadastrar', component: AlunosCadastroComponent }
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
            },

            {
                path: 'comunicados',
                component: ComunicadosComponent
            },
            {
                path: 'comunicados/novo',
                component: ComunicadoFormComponent
            },
            {
                path: 'comunicados/:id/editar',
                component: ComunicadoFormComponent
            }
        ]
    }

];
