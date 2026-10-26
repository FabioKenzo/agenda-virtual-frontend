import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth-user';

export const roleGuard: CanActivateFn = (route) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const allowedRoles = route.data['roles'] as UserRole[];

    return authService.checkSession().pipe(
        map((user) => {

            if (allowedRoles.includes(user.role)) {
                return true;
            }

            if (user.role === 'ADMIN') {
                return router.createUrlTree(['/admin']);
            }

            return router.createUrlTree(['/responsavel']);

        }),

        catchError(() => of(router.createUrlTree(['/login'])))
    );
};