const express=require('express');
 require("dotenv").config();
const mongodb= require('mongodb');
const mongoClient = mongodb.MongoClient;
const URL =process.env.DATAB;
const DB ="shoppy";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');





const cred =express.Router();

cred.post('/login',async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        let user = await db.collection("users").findOne({emailId:req.body.emailId});
        let admin= await db.collection("admin").findOne({emailId:req.body.emailId});
        if(admin){
            let passVerify = await bcrypt.compare(req.body.password,admin.password)
            if(passVerify){
                let token = jwt.sign({_id:admin.emailId},process.env.ADMIN,{expiresIn:"100m"})
                res.json({token:token,userId:admin._id,admin:true})
            }
            if(!passVerify){
                res.json({messege:"Password does't match"})
            }
        }
        if(user){
            let passVerify =await bcrypt.compare(req.body.password,user.password);
            if(passVerify){
                let token = jwt.sign({_id:user.emailId},process.env.USER,{expiresIn:"100m"})
                res.json({token:token,userId:user._id,admin:false})
            }
            if(!passVerify){
                res.json({messege:"Password is wrong"})
            }
        }
        if(!admin && !user){
            res.json({messege:"Not an registered user"})
        }
        await connection.close();
    } catch (error) {
        res.json({messege:"Something wrong in the server side"})
        console.log(error)
    }
});

cred.post('/signup',async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        let findUser = await db.collection("users").findOne({emailId:req.body.emailId})
        if(!findUser){
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password,salt);
            req.body.password = hash;
            await db.collection('users').insertOne(req.body);
            res.json({messege:"Account created"})
        }else{
            res.json({messege:"Email id already exists"})
        }
      
        await connection.close();
       
       
    } catch (error) {
        console.log(error)
    }
    })

module.exports=cred;