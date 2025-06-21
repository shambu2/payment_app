import express from "express";
import allRoutes from './routes'
import cors from 'cors';
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import bcrypt from 'bcrypt'
configDotenv();
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/v1',allRoutes)

mongoose.connect(process.env.mongo_url as string)
// const pass = "shambuling";
// const hashedpass = bcrypt.hashSync(pass,10)
app.listen(5000,()=>{
    console.log("server is running in port 5000")
    // console.log(hashedpass)
})