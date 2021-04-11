 class Account {
      
    constructor(id,facebookId,name,extraInfo,token){
        this.id=id;
        this.facebookId=facebookId;
        this.name=name;
        this.extraInfo=extraInfo;
        this.token=token;
    }
}

module.exports=Account;