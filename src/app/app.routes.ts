import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/responsavel/home/home.component';

export const routes: Routes = [

    {
        path: 'login',
        component:LoginComponent
    },

    {
        path: 'responsavel',
        component:HomeComponent
    }
];
