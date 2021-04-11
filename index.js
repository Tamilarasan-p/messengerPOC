const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const CONFIG=require('./config/config');

const app=express();
app.use(bodyParser.json({extended:true}));
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'https://youthful-stonebraker-8a3305.netlify.app/');
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

app.listen(CONFIG.PORT, function() {
    console.log("server is running on port:" + CONFIG.PORT);
})