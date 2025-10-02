import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function BaseUrl(req:HttpRequest<unknown>,next:HttpHandlerFn){
    const newreq=req.clone({url:`http://localhost:8080/v1/${req.url}`})
    return next(newreq)
}