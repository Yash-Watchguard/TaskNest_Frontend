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

  GetComments(url:string){
    this.getcommenturl=url;
    return this.httpClient.get<viewallcommentrespinse>(url)
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
    return this.httpClient.post(url,{
        "content":comment
    }).pipe(tap(response=>{
        this.GetComments(this.getcommenturl).subscribe()
    }))
  }
}