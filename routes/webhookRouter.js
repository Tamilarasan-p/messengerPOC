const express = require('express');
const passport=require('passport');
const router = express.Router();

//adding necessary controllers
const messenger=require('../controllers/messenger.controller');


router.get('/webhook',messenger.getWebhook);
router.post('/webhook',messenger.postWebhook);


router.get('/session',(req,res)=>{
    req.session.email="test@gmail.com";
    res.status(200).json(req.session);
});
module.exports=router;