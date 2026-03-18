import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('tool_token');

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        tool_token: token,
      },
    });

    return next(clonedRequest);
  }

  return next(req);
};
