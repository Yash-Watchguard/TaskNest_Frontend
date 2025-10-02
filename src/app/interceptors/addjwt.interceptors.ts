import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function AddJwt(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> {
  // Skip for login/signup
  if (req.url.includes('login') || req.url.includes('signup')) {
    return next(req);
  }

  // Get token from localStorage
  const token = localStorage.getItem('token');

  if (token) {
    const newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(newReq);
  }

  // No token, just forward the request
  return next(req);
}
