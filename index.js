const express =require('express');

 require("dotenv").config();

const cors = require('cors');

//routes
const stripePay = require("./stripe/payment")
const loginRoutes =require("./routes/login.routes")
const adminRoutes =require('./routes/admin.routes')
const userRoutes =require('./routes/user.routes')



const app =express();
app.use(express.json());

app.use(cors({
    origin:'https://peaceful-begonia-8be3c5.netlify.app'
}))

app.use(stripePay);
app.use(loginRoutes);
app.use(adminRoutes)
app.use(userRoutes)



app.listen(process.env.PORT || 3001)

