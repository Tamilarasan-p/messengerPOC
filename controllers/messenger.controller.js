const dotenv=require('dotenv');
dotenv.config({ path: __dirname + `/.env` });
const dataConfig= require('../config/messages');
const request= require('request');
const chatBotServices=require('../services/chatBotService');




const getStartedButton=(req,res)=>{
  let data={
    "get_started":{
        "payload":"GET_STARTED"
      },
      "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "postback",
                    "title": "Talk to an agent",
                    "payload": "CARE_HELP"
                },
                {
                    "type": "postback",
                    "title": "Outfit suggestions",
                    "payload": "CURATION"
                },
                {
                    "type": "web_url",
                    "title": "Shop now",
                    "url": "https://www.originalcoastclothing.com/",
                    "webview_height_ratio": "full"
                }
            ]
        }
    ],
    "whitelisted_domains":[
        "https://37d53b0b9ba0.ngrok.io",
    ]   
  };
  
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
    "qs": { "access_token": process.env.FB_PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": data
  }, (err, res, body) => {
    if (!err) {
       res.status(200).json({"message":"success"});
    } else {
      res.status(500).json({"message":"something went wrong"})
    }
  }); 
}



//post webhook method

const postMethodWebhook=(req,res)=>{
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get i   ndex 0
        let webhook_event = entry.messaging[0];
        //console.log(webhook_event);
        let sender_psid=webhook_event.sender.id;
        //console.log("User PSID:" +sender_psid);

        let page_id=entry.id;
        console.log(`Page ID:${page_id}`);
        
       
        //check if the event is message or postback and redirect it
        if(webhook_event.message){

            handleMessage(sender_psid,webhook_event.message,page_id)

        }else if(webhook_event.postback){

            handlePostback(sender_psid,webhook_event.postback,page_id)

        }

      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
};


//get method

const getMethodWebhook=(req,res)=>{
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    //console.log(VERIFY_TOKEN);
  // Parse the query params
  let mode = req.query['hub.mode'];  
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
};



// Handles messages events
const handleMessage= async (sender_psid, received_message,page_id) => {
    let response_message;
   
    if(received_message.text){
        let username=await chatBotServices.getFacebookUserName(sender_psid,page_id);
        let welcomeNote=dataConfig.messages.welcomeMessage
        //console.log(username);
        response_message=`Welcome ${username},  ${welcomeNote}`;
    }

    chatBotServices.sendWelcomeMessage(sender_psid,response_message,page_id);
    
};

// Handles messaging_postbacks events
const handlePostback= async (sender_psid, received_postback,page_id) =>{
        

  let payload=received_postback.payload;
  switch(payload){
   
    case"GET_STARTED":
      let username=await chatBotServices.getFacebookUserName(sender_psid,page_id);
      let welcomeNote=dataConfig.messages.welcomeMessage
      //console.log(username);
      response_message=`Welcome ${username},  ${welcomeNote}`;
      await chatBotServices.sendWelcomeMessage(sender_psid,response_message,page_id);
      break;

    case"CATEGORY":
     await chatBotServices.sendMainCategory(sender_psid,page_id);
      break;

    case "BRUSHES":
      await chatBotServices.sendMakeUpList(sender_psid,page_id);
      break;

    case "NICMAC_PALETTE":
      await chatBotServices.sendPaletteList(sender_psid,page_id);
      break;
    case "BACK_TO_MAIN":
      await chatBotServices.goBackMenu(sender_psid,page_id);
      break;
    default:
      break;
  }
  
};




//get started template


// Sends response messages via the Send API


module.exports={
    getStartedButton:getStartedButton,
    postWebhook:postMethodWebhook,
    getWebhook:getMethodWebhook
}