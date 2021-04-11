const express = require('express');
const router = express.Router();
const queryString = require('query-string');//not used
const fetch= require('node-fetch')
const Account = require('../models/account.model');





router.post('/facebookTokenAuthenticate',(req,res)=>{
    
    const key=req.body.accessToken;
    const UrlOptions={
        hostname:"https://graph.facebook.com/",
        path:"v8.0/me?",
        port:443
    };

    url=`https://graph.facebook.com/v8.0/me?access_token=${key}`
    try{
        fetch(url).then(response => response.json()).then(data => 
            {
            const record = new Account(data.id,data.id,data.name,"Test","Test");
            console.log(JSON.stringify(data));
            res.status(200).json({ data:record });
        });
    }catch(error){
        console.log(error)
    }  

}); 




module.exports = router;