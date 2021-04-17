const express=require('express');
const router=express.Router();

const dotenv=require('dotenv');
dotenv.config({ path: __dirname + `/.env` });
const passport=require('passport');
const FacebookStrategy=require('passport-facebook').Strategy;

const UserDetails=require('../models/account.model');
const pageDetails=require('../models/pages.model');
const dbOperations=require('../controllers/database.controller');
const messengerInitialize=require("../services/messengerservice");
const { response } = require('express');





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
            console.log(profile);
            dbOperations.checkUserExists(profile.id).then((result)=>{
              //console.log(`Recordset Length:${result.recordset.length}`);
              if(result.recordset.length > 0){
                console.log("User Already Exists");
                console.log(result.recordset[0].client_name);
                return done(null,result.recordset);
              }else
              {
                let userdata=new UserDetails();
                userdata.id=profile.id;
                userdata.facebookId=profile.id;
                userdata.name=profile.displayName;
                userdata.email=(profile.emails[0].value || '').toLowerCase();
                userdata.photo= (profile.photos.length > 0)? profile.photos[0].value: "";
                userdata.token=accessToken;
                dbOperations.insertNewUserRecord(userdata).then((result)=>{
                  console.log("--New User Insert result--");
                  console.log(result);
                });
              }
            });

            let totalPages=profile._json.accounts.length;
            console.log(`page count:${totalPages}`);
            if(totalPages > 0)
            {
              console.log(`page ID: ${profile._json.accounts.data[0].id}`);
              for(let k=0;k<totalPages;k++){
                let pageID=profile._json.accounts.data[0].id
                dbOperations.checkPageExists(pageID).then((result)=>{
                  console.log(`Page Count:${result.recordset.length}`);
                    if(result.recordset.length==0){
                      let pages=new pageDetails();   
                      pages.page_owner_id=profile.id;
                      pages.page_id=profile._json.accounts.data[0].id;
                      pages.page_name=profile._json.accounts.data[0].name;
                      pages.page_category=profile._json.accounts.data[0].category;
                      pages.page_access_token=profile._json.accounts.data[0].access_token;
                      dbOperations.insertPageDetails(pages).then((result)=>{
                            console.log(result);
                      });
                    }
                    else{
                        console.log("Page Already exists");
                    }
                });
              }
              
            }
            else
            {
              console.log("No Pages available for this account");
            }
            
            return done(null, profile);
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
      
    res.status(200).json({data:req.user});
    //res.redirect("https://shopify-bot.netlify.app/dashboard");
});

//data api for test

router.get('/initialize',function(req,res){
    messengerInitialize.setUpMessengerPlatform((response)=>{
      res.status(200).json({"Result":response});
    });
});


router.get('/testApi',function(req,res){
  console.log(req.user);
    dbOperations.checkUserExists(req.user).then(result=>{
      console.log(result);
    })
});

module.exports=router;