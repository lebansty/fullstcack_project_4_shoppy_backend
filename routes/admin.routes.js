const express =require('express');
require("dotenv").config();
const mongodb= require('mongodb');
const mongoClient = mongodb.MongoClient;
const URL =process.env.DATAB;
const DB ="shoppy";
const jwt = require("jsonwebtoken");

const adminRouter =express.Router();

let authenticate=(req,res,next)=>{
    try {
        let decode = jwt.verify(req.headers.auth,process.env.ADMIN)
        if(decode){
            next();
        }
    } catch (error) {
       
        res.status(401).json({Messege:"321Unauthorized"})
    }
}

adminRouter.post('/product-update',authenticate,async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db =connection.db(DB);
        req.body.adminId = mongodb.ObjectId(req.headers.adminid);
        await db.collection("products").insertOne(req.body)
       await connection.close()
       res.json({messege:'Data inserted'})
    } catch (error) {
        console.log(error)
    }
})

adminRouter.get('/admin-products',authenticate,async(req,res)=>{
    try {
        const connection =await mongoClient.connect(URL);
        const db =connection.db(DB);
        let adminProducts =await db.collection('products').find({adminId:mongodb.ObjectId(req.headers.adminid)}).toArray()
       
        if(adminProducts){
            res.json({adminProducts:adminProducts})
        }else{
            res.json({messege:"No Data"})
        }
        
       await connection.close()
    } catch (error) {
        console.log(error)
    }
});

adminRouter.get('/producton-id/:id',authenticate,async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db=connection.db(DB);
        let singleProduct =await db.collection('products').findOne({_id:mongodb.ObjectId(req.params.id)})
        res.json({product:singleProduct})
        await connection.close()
    } catch (error) {
        console.log(error)
    }
});

adminRouter.put('/product-update/:id',authenticate,async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        
        await db.collection('products').findOneAndUpdate({_id:mongodb.ObjectId(req.params.id)},{$set:{brand:req.body.brand,description:req.body.description,url:req.body.url,price:req.body.price,inStock:req.body.inStock}})
        res.json({messege:"Your producted is updated"})
        await connection.close()
    } catch (error) {
        console.log(error)
    }
});

adminRouter.delete('/remove-product/:id',authenticate,async(req,res)=>{
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        await db.collection('products').deleteOne({_id:mongodb.ObjectId(req.params.id)});
        res.json({messege:"Product removed"});
       await connection.close()
    } catch (error) {
        console.log(error)
    }
})





module.exports=adminRouter;