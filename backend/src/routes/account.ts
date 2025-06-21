import express, { Request, Response } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { Account } from "../models/db";
import mongoose from "mongoose";
const router = express.Router();

router.get('/balance',authMiddleware,async(req:Request,res:Response)=>{
    try {
        const account = await Account.findOne({
            userId: req.userId
        });
        res.status(200).json({
            balance: account?.balance
        })
        return;
    } catch (error) {
        res.status(500).json({
            message:"unable to fetch balance"
        })
        return;
    }
})
router.post('/transfer',async(req:Request,res:Response)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {amount,to} = req.body;
        if(!amount || !to){
            await session.abortTransaction();
            res.status(400).json({message:'Amount and taget user Id are required'});
            return;
        }
        const senderAccount = await Account.findOne({userId: req.userId}).session(session);
        if(!senderAccount || senderAccount.balance < amount){
            await session.abortTransaction();
            res.status(400).json({message:"Insufficient balance"});
            return;
        }
        const receiverAccount = await Account.findOne({userId: to}).session(session);
        if(!receiverAccount){
            await session.abortTransaction();
            res.status(400).json({message:'Invalid target Account'})
            return;
        }

        await Account.updateOne(
            {userId: req.userId},
            {$inc: {balance: -amount}}
        ).session(session);

        await Account.updateOne(
            {userId: to},
            { $inc: {balance: amount}}
        ).session(session);

        await session.commitTransaction();
        res.json({message: 'Transfer successful'});

    } catch (error) {
        console.error("Transfer error",error);
        await session.abortTransaction();
        res.status(500).json({message:'Internal server error'});

    } finally {
        session.endSession();
    }
})

export default router;