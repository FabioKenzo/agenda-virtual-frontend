import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/responsavel/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { ComunicadoDetalheComponent } from './features/responsavel/comunicado-detalhe/comunicado-detalhe.component';
import { EventoDetalheComponent } from './features/responsavel/evento-detalhe/evento-detalhe.component';

export const routes: Routes = [

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'responsavel',
        component: HomeComponent,
        canActivate: [authGuard]
    },

    {
        path: 'responsavel/comunicados/:id',
        component: ComunicadoDetalheComponent,
        canActivate: [authGuard]
    },

    {
        path: 'responsavel/eventos/:id',
        component: EventoDetalheComponent,
        canActivate: [authGuard]
    }
];
