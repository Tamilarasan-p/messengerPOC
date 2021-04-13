 class Pages {
      
    constructor(page_owner_id,page_id,page_name,page_category,page_access_token){
        this.page_owner_id=page_owner_id;
        this.page_id=page_id;
        this.page_category=page_category;
        this.page_name=page_name;
        this.page_access_token=page_access_token;
    }
}

module.exports=Pages;