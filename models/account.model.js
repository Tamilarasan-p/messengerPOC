 class UserAccount {
      
    constructor(id,facebookId,name,email,photo,token){
        this.id=id;
        this.facebookId=facebookId;
        this.name=name;
        this.email=email;
        this.photo=photo;
        this.token=token;
    }
}

module.exports=UserAccount;