import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';

import { CsrfService } from '../services/csrf.service';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {

    const isApiRequest = req.url.startsWith('http://localhost:8080/');
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

    if (!isApiRequest || !isMutation) {
        return next(req);
    }

    const csrfService = inject(CsrfService);

    return csrfService.getToken().pipe(
        switchMap(token => {
            const protectedRequest = req.clone({
                withCredentials: true,
                setHeaders: {
                    'X-XSRF-TOKEN': token
                }
            });

            return next(protectedRequest);
        })
    );
};