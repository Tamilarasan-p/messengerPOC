const SQL=require('mssql');
const CONFIG=require('../config/config');
let config=CONFIG.DBConfig;
async function checkUserExists(userid){
    try{
        //console.log("--database Ops--");
        //console.log(CONFIG.DBConfig)
    let sqlConnection= await SQL.connect(config);
    let user = await sqlConnection.request().input('facebook_id', SQL.Int, userid)
            .query('select * from bothub_users where client_facebook_id = @facebook_id');
            console.log(user);
    return user.recordsets;
    }
    catch(err){
        console.log(err);
    }

}

module.exports={
    checkUserExists:checkUserExists
}