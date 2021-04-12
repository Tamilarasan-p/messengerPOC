const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CONFIG=require('./config/config');
const dotenv=require('dotenv');
dotenv.config();

const PORT= process.env.PORT;

const app=express();
app.use(bodyParser.json({extended:true}));
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'https://shopify-bot.netlify.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader("Access-Control-Allow-Credentials",true);
    next();
});

//controllers
const AuthController=require('./controllers/auth.controller');


//routes
app.use('/auth',cors(),AuthController);

app.get('/', (req, res) => {
    res.send("Hello from Server");
});

app.listen(PORT, function() {
    console.log("server is running on port:" + PORT);
})