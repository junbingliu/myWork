//#import Util.js
//#import login.js
//#import $wsLogin:service/service.jsx

(function(){
    var ret= {
        state:'err'
    };
    try {
        var userId = LoginService.getFrontendUserId();
        if(!userId){
            ret.msg = "没有登录";
            out.print(JSON.stringify(ret));
            return;
        }
        var scanCode = $.params.code;
        if(!scanCode){
            ret.msg = "获取参数失败";
            out.print(JSON.stringify(ret));
            return;
        }
        var now = new Date().getTime();
        ScanService.saveScanCodeData(scanCode,{userId:userId, t:now});
        ret.state = "ok";
        ret.msg = "登录成功";
        out.print(JSON.stringify(ret));
    } catch (e) {
        $.log(e);
        ret.msg = "操作异常，请联系管理员";
    }
})();