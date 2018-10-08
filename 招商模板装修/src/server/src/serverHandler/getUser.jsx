//#import Util.js
//#import login.js

var user = LoginService.getFrontendUser();
if(!user){
    var ret = {
        state:"noUser",
        userId:"-1"
    }
}else{
    var ret = {
        state:"ok",
        userId:user.id,
        userName:user.loginId||""
    }
}

out.print(JSON.stringify(ret));
