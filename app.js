const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://node-shop:'+ process.env.MONGO_ATLAS_PW +'@node-rest-shop-pqj0s.mongodb.net/test?retryWrites=true',(err)=>{
    if(err){
        console.log("Could not connect to MongoDB (DATA CENTER) ");
        }else{
            console.log("DATA CENTER - Connected")
        }
});
mongoose.Promise = global.Promise;

app.use('/uploads',express.static('uploads'));
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});   
    }
    next();
});

const productRoute = require('./api/routes/products.js');
const orderRoute = require('./api/routes/orders.js');
const userRoute = require('./api/routes/user.js');


const morgan = require('morgan');
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/products',productRoute);
app.use('/orders',orderRoute);
app.use('/user',userRoute);

app.use((req,res,next)=>{
    const error = new Error('Not Found!');
    error.status=404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message,
            status: error.status
        }
    });
});
module.exports = app;