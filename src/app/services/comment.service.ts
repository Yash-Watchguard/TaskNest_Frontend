import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { comment, viewallcommentrespinse } from "../models/comment.model";
import { BehaviorSubject, map, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CommentService{
    private httpClient = inject(HttpClient);
  private commentobject = new BehaviorSubject<comment[]>([]);
  public comments$ = this.commentobject.asObservable();
  private getcommenturl=''

   baseUrl= 'https://j7hf8pxvdk.execute-api.ap-south-1.amazonaws.com/v5/'
  baseUrl2= 'https://vv2zl4jl7h.execute-api.ap-south-1.amazonaws.com/v6/'

  GetComments(url:string){
    this.getcommenturl=url;
    return this.httpClient.get<viewallcommentrespinse>(this.baseUrl+url)
    .pipe(
        map((response)=>{
            return response.data.map((t)=>({
                 comment_id:t.comment_id,
                 created_by:t.created_by,
                 content:t.content
            }) as comment)
        }),
        tap((tasks)=>{
            this.commentobject.next(tasks);
        })
    );
  }

  Addcomment(url:string, comment:string){
    return this.httpClient.post(this.baseUrl+url.replace('/:','/'),{
        "content":comment
    })
    .pipe(tap(response=>{
        this.GetComments(this.getcommenturl).subscribe()
    }))
  }
}