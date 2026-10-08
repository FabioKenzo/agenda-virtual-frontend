import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if(!req.url.startsWith('http://localhost:8080')){
    return next(req);
  }

  const requestWithCredentials = req.clone({
    withCredentials: true
  })

  return next(requestWithCredentials);

};