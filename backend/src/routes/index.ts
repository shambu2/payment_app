import express, { Request, Response } from "express";
import userRouter from './user';
import accountRouter from './account'
const router = express.Router();

// router.get('/',(req:Request,res:Response)=>{
//     res.send("hellod ")
// })
router.use('/user',userRouter)
router.use('/account',accountRouter)

export default router;