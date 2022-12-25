const express=require('express')

const stripe= require("stripe")(`${process.env.STRIPE_SECRET_KEY}`)

const stripeRouter= express.Router()

stripeRouter.post('/create-checkout-session', async (req, res) => {

    try {
        const line_items=req.body.map((val)=>{

            return{
        price_data:{
            currency:'inr',
            product_data:{
                name:val.brand
              
            },
            unit_amount:val.price*100
        },
        quantity:1
    
    }
            
        })
       
        const session = await stripe.checkout.sessions.create({
        line_items,
          mode: 'payment',
          success_url: 'http://localhost:4242/success',
          cancel_url: 'http://localhost:4242/cancel',
        });
      
        res.send({url: session.url});
    } catch (error) {
        console.log(error)
    }
    
  });

  module.exports =stripeRouter;