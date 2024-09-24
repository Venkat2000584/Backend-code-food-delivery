const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes.js');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const path = require('path');

const app= express();
const PORT = 5000;

dotEnv.config()
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Mongo DB Connected Successfully");
})
.catch((err)=>{
    console.log(err);
    
})

app.use(bodyParser.json());
app.use('/vendors', vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('/uploads'));

app.listen(PORT,()=>{
    console.log("server running at 5000");
    
})