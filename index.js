const express=require('express');
const session=require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const CONFIG=require('./config/config');
const dotenv=require('dotenv');
const passport=require('passport');

dotenv.config();

const PORT= process.env.PORT;

const app=express();
app.use(bodyParser.json({extended:true}));
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader("Access-Control-Allow-Credentials",true);
    next();
});

app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:'keyforlogin'
}));
app.use(passport.initialize());
app.use(passport.session());

//controllers
const AuthController=require('./controllers/auth.controller');
const fbLoginController=require('./controllers/facebookLogin.controller');

//routes
app.use('/api',cors(),isLoggedIn,AuthController);
app.use('/auth',cors(),fbLoginController);

app.get('/', (req, res) => {
    res.send("Hello from Server");
});

app.listen(PORT, function() {
    console.log("server is running on port:" + PORT);
});

function isLoggedIn(req,res,next){
    if (req.isAuthenticated())
    return next();
    res.redirect('/');
}