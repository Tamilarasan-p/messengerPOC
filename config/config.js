const dotenv=require('dotenv');
dotenv.config();

const portnum = process.env.PORT


const dbConfig = {
    user :process.env.USER_NAME,
    password :process.env.PASSWORD,
    server:process.env.SERVER_NAME,
    database:process.env.DATABASE_NAME,
    options:{
        trustedconnection: true,
        enableArithAbort : true, 
        instancename :'SQLEXPRESS'
    },
    port : parseInt(process.env.DATABASE_PORT, 10),
}
 

//messages data





module.exports={
    PORT:portnum,
    DBConfig:dbConfig,
}

