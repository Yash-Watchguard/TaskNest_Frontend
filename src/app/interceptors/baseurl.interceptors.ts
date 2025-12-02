import { HttpHandlerFn, HttpRequest } from "@angular/common/http";

export function BaseUrl(req:HttpRequest<unknown>,next:HttpHandlerFn){
    const newreq=req.clone({url:`https://j7hf8pxvdk.execute-api.ap-south-1.amazonaws.com/v5/${req.url}`})
    return next(newreq)
}