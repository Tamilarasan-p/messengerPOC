const express=require('express');
const router=express.Router();

const dotenv=require('dotenv');
dotenv.config({ path: __dirname + `/.env` });
const passport=require('passport');
const FacebookStrategy=require('passport-facebook').Strategy;

const UserDetails=require('../models/account.model');
const dbOperations=require('../controllers/database.controller');

passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
  
  passport.use(new FacebookStrategy({
      clientID:process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email','accounts'],
      enableProof:true
      
    }, function (accessToken, refreshToken, profile, done) {
        
        //console.log(profile)
        process.nextTick(function(){  
            let userdata=new UserDetails();
            userdata.id=profile.id;
            userdata.name=profile.displayName;
            userdata.email=profile.emails[0].value;
            userdata.photo= (profile.photos.length > 0)? profile.photos[0].value: "";
            userdata.token=accessToken;
            console.log(userdata);
            let users=dbOperations.checkUserExists(profile.id);
            if(users){
              console.log("User Already Exists");
            }else
            {
              console.log("New User")
            }
            return done(null, userdata);
        });
        
     
    }
  ));

//auth router
router.get('/facebook',passport.authenticate('facebook',{
    scope:['email','pages_show_list','pages_messaging','pages_messaging_subscriptions','pages_read_engagement',
    'pages_manage_ads','pages_read_user_content','pages_manage_metadata']}
));

//callback router
router.get('/facebook/callback',passport.authenticate('facebook',{ failureRedirect: '/login' }),
  function(req, res) {
      console.log("--RESPONSE--");
      console.log(req.user);
    res.status(200).json({data:req.user});
});

//data api for test

router.get('/facebook/user',function(req,res){
  res.status(200).json({data:req.user});
});


router.get('/testApi',function(req,res){
  console.log(req.user);
    dbOperations.checkUserExists(req.user).then(result=>{
      console.log(result);
    })
});

module.exports=router;