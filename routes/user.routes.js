const express =require('express');
require("dotenv").config();
const mongodb= require('mongodb');
const mongoClient = mongodb.MongoClient;
const URL =process.env.DATAB;
const DB ="shoppy";
const jwt = require("jsonwebtoken");


const userRoutes = express.Router();

let authenticate=(req,res,next)=>{
    try {
        let decode = jwt.verify(req.headers.auth,process.env.USER)
        if(decode){
            next();
            console.log("Yes")
        } 
    } catch (error) {
        res.json({messege:"Session timeout login to add products"})
    }
}

userRoutes.get('/product-display',async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db =connection.db(DB);
        let productData = await db.collection('products').find().toArray()
        res.json({products:productData})
        await connection.close()
    } catch (error) {
        console.log(error)
    }
    });

    userRoutes.get("/user-identify",async(req,res)=>{
try {
    const connection = await mongoClient.connect(URL);
    const db =connection.db(DB);
    let user = await db.collection("users").findOne({_id:mongodb.ObjectId(req.headers.id)});
    let admin= await db.collection("admin").findOne({_id:mongodb.ObjectId(req.headers.id)});
    if(user){
        res.json({admin:false})
    }
    if(admin){
        res.json({admin:true})
    }
    await connection.close()
} catch (error) {
    
}
    });

    userRoutes.post('/addToCart',authenticate,async(req,res)=>{
        try {
           const connection =await mongoClient.connect(URL) ;
           const db =connection.db(DB);
        //    req.body._id=mongodb.ObjectId(req.body._id)
  
    let user =await db.collection("users").findOne({_id:mongodb.ObjectId(req.headers.userid)})

    if(user){
        req.body.productId=req.body._id
        delete req.body._id
        req.body._id=mongodb.ObjectId()
        await db.collection('users').findOneAndUpdate({_id:mongodb.ObjectId(req.headers.userid)},{$push:{cartItems:req.body}})
        res.status(200)
    }if(!user){
        res.json({messege:"Signup as an user to buy products"})
    }
         
           await connection.close()
        } catch (error) {
            console.log(error)
        }
    });

    userRoutes.get('/get-cartDet',async(req,res)=>{
        try {
            const connection = await mongoClient.connect(URL);
            const db=connection.db(DB);
            let outPut = await db.collection('users').findOne({_id:mongodb.ObjectId(req.headers.userid)})
            if(outPut){
                res.json({cartData:outPut.cartItems})
            }
            else{
                res.json({messege:"Empty cart"})
            }
           await connection.close()
        } catch (error) {
            console.log(error)
        }
    });

    userRoutes.delete('/remove-Cart/:id',async(req,res)=>{
        try {
            const connection = await mongoClient.connect(URL);
            const db=connection.db(DB);
           
            await db.collection('users').findOneAndUpdate({_id:mongodb.ObjectId(req.headers.userid)},{$pull:{"cartItems":{_id:mongodb.ObjectId(req.params.id)}}})
    res.json({messege:"Removed"})
    await connection.close()
        } catch (error) {
            console.log(error)
        }
    });

    module.exports=userRoutes;