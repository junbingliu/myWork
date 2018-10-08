//#import Util.js
//#import login.js
//#import address.js

;(function(){
    var ret = {
        state:""
    }
    try{
        var loggedUser = LoginService.getFrontendUser();
        var userId = "";
        if(loggedUser != null){
            userId = loggedUser.id
        }else{
            ret.state = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }

        var addressId = $.params.addressId;
        AddressService.setDefaultAddress(userId,addressId);
        ret.state = "ok";
        out.print(JSON.stringify(ret));
    }catch(e){
        ret.state = "system_error";
        out.print(JSON.stringify(ret));
    }
})();