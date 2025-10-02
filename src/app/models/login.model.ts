export type LoginRequest={
    name:string
    email:string
    password:string
}

export type LoginResponse={
    status:string
    message:string
    data:{
        userId:string
        name:string
        token:string
    }
}