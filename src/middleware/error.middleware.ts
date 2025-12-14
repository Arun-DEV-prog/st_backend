import { NextFunction ,Request,Response} from "express";


export const errorMiddleware=(
    err:any,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    console.log(err.stack);
    res.status(err.status || 500).json({
        success:false,
        message:err.message || "Internal Server Error",
    })
}