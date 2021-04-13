const SQL=require('mssql');
const CONFIG=require('../config/config');
let config=CONFIG.DBConfig;

//check user exists or not
async function checkUserExists(userid){
    try{
        //console.log("--database Ops--");
        //console.log(userid)
    let sqlConnection= await SQL.connect(config);
    let user = await sqlConnection.request().input('facebook_id', SQL.Numeric, userid)
            .query('select * from bothub_users where client_facebook_id = @facebook_id');
            console.log(user);
    return user;
    }
    catch(err){
        console.log(err);
    }

}


//add new user if user not exists 


async function insertNewUserRecord(_newUser){
    try{
            let SqlConnection= await new SQL.connect(config);
            let request = await SqlConnection.request();
            request.input('client_id',SQL.Numeric,_newUser.facebookId);
            request.input('client_facebook_id',SQL.Numeric,_newUser.facebookId);
            request.input('client_name',SQL.NVarChar,_newUser.name);
            request.input('client_email',SQL.NVarChar,_newUser.email);
            request.input('profile_pic',SQL.NVarChar,_newUser.photo);
            request.execute('insertNewUserRecord',function(err, recordsets, returnValue){
                if(err)
                console.log(err);
                return recordsets;
            });
    }catch(err){
        console.log(`User Data Insert error:${err}`);
    }
}



//check page exists in database

async function checkPageExists(pageid){
    try{
        //console.log("--database Ops--");
        //console.log(userid)
    let sqlConnection= await SQL.connect(config);
    let result = await sqlConnection.request().input('page_id', SQL.Numeric, pageid)
            .query('select * from page_information where page_id = @page_id');
            console.log(result);
        return result;
    }
    catch(err){
        console.log(err);
    }

}

//adding user linked page details to database


async function insertPageDetails(_page){
    try{
            console.log(`page details:${_page}`);
            let SqlConnection= await new SQL.connect(config);
            let request = await SqlConnection.request();
            request.input('client_id',SQL.Numeric,_page.page_owner_id);
            request.input('page_id',SQL.Numeric,_page.page_id);
            request.input('page_name',SQL.NVarChar,_page.page_name);
            request.input('page_category',SQL.NVarChar,_page.page_category);
            request.input('page_access_token',SQL.NVarChar,_page.page_access_token);
            request.execute('addPageDetails',function(err, recordsets, returnValue){
                if(err)
                console.log(err);
                return recordsets;
            });
    }catch(err){
        console.log(`Page Data Insert error:${err}`);
    }
}
module.exports={
    checkUserExists:checkUserExists,
    insertNewUserRecord:insertNewUserRecord,
    insertPageDetails:insertPageDetails,
    checkPageExists:checkPageExists
}