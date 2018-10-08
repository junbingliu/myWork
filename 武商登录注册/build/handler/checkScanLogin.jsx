//#import Util.js
//#import login.js
//#import sysArgument.js

(function(){
    var ret= {
        state:'err'
    };
    try {
        var typeStr = $.params.type;
        var scanCode = $.params.code;
        if (!scanCode) {
            ret.msg = "获取参数失败";
            out.print(JSON.stringify(ret));
            return;
        }
        var userId = LoginService.getFrontendUserId();
        if (typeStr) {
            if (userId) {
                ret.state = "ok";
                ret.code = scanCode;
            } else {
                ret.msg = "没有登录";
            }
            out.print(JSON.stringify(ret));
        } else {
            var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl");
            if (userId) {
                response.sendRedirect(webUrl + "/wsLogin/handler/scanLogin.jsx?code=" + scanCode);
            } else {
                response.sendRedirect(webUrl + "/mobileApp/jump.jsx?htmlName=login/login");
            }
        }
    } catch (e) {
        $.log(e);
        ret.msg = "操作异常，请联系管理员";
        out.print(JSON.stringify(ret));
    }
})();