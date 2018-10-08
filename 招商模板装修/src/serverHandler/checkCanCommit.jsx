//#import Util.js
//#import login.js
//#import sysArgument.js

;(function(){
    try{
        var ret = {
            state:false,
            errorCode:""
        }
        var userId = LoginService.getFrontendUserId();
        if(!userId){
            ret.errorCode = "needLogin"
            out.print(JSON.stringify(ret));
            return
        }

        var pid = $.params.pid;
        var canComment = Packages.net.xinshi.isone.functions.product.ProductFunction.isBoughtProduct(userId,pid,'112');
        if(!canComment){
            ret.errorCode = "canNotCommit"
            out.print(JSON.stringify(ret));
            return
        }

        ret.state = true;
        out.print(JSON.stringify(ret));
    }catch(e){
        var ret = {
            state:false,
            alreadyLogin:false,
            sslWebSite:''
        }
        out.print(JSON.stringify(ret));
    }
})();