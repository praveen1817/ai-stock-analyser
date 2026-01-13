import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../../lib/sqlDB.js';

const router=express.Router();

router.post('/signin',async (req,res)=>{
    console.log("Request reached");
    const {email,username,password,number}=req.body;
    try{
        console.log(email,username,number);
        const db=await connectToDatabase();
         if (!db) {
                return res.status(503).json({
                message: "Database is waking up, please retry in a few seconds"
                });
            }
        const [rows]= await db.query('select * from users where email = ?',[email]);
        if(rows.length>0){
            return res.status(401).json({message:"The Account Already Exists Try to Login in First"});
        }
        const hashPassword=await bcrypt.hash(password,10);
        await db.query('insert into users (email,username,password,number) values (?,?,?,?)',
            [email,username,hashPassword,number]);
        return res.status(201).json({messgae:"Account Created Successfully"})
    }
    catch(err){
        console.log("Error:"+err);
        return res.status(500).json({message:"Internal Server Error"})
    }
})

router.post('/login',async (req,res)=>{
    console.log("Request Hit Login");
    const {email,password}=req.body;
    console.log(email,password);
    try{
        const db= await connectToDatabase();
        const [rows]=await db.query('select * from users where email= ?',[email]);
        if(rows.length === 0){
           return res.status(404).json({message:"No user found Try to Login First"});
        }
        let isMatch=await bcrypt.compare(password,rows[0].password);
        if(!isMatch){
            return res.status(401).json({message:"Wrong Password !"})
        }
        const token =jwt.sign({id:rows[0].id},process.env.JWT_KEY,{expiresIn:'1h'});
       return  res.status(200).json({token:token});

    }catch(err){
        console.log("Erro:",err);
        return res.status(500).json({message:"Internal server Error"})
    }
})
const verifyToken= async (req,res,next)=>{
    try{
        const authToken= req.headers.authorization;
        if(!authToken){
            return res.status(409).json({message:"Invalid Token Try to Login First"})
        }
        const token=authToken.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_KEY)
        req.userId=decoded.id;
        next()

    }catch(err){
        console.log(err);
        return res.status(401).json({message:"Invalid user request"})
    }
}

router.get('/home',verifyToken, async(req,res)=>{
    console.log("reached the Home Route");
    try{
        let userId=req.userId;
        const db= await connectToDatabase();
        const [rows]= await db.query("select username,email from users where id=?",[userId]);
        if(rows.length==0){
            return res.status(401).json({message:"No user found Try to login First"});
        }
        return res.status(200).json({
            username:rows[0].username,
            email:rows[0].email
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"})

    }
})
export default router;