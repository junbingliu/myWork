//#import Util.js
//#import user.js
//#import login.js
//#import $wsLogin:service/service.jsx

(function(){
    var scanCode = $.params.code;
    var ret= {
        state:'waiting'
    };
    try {
        var data = ScanService.getScanCodeData(scanCode);
        if(data && data.userId){
            var uId = data.userId;
            var jUser = UserService.getUser(uId);
            if(jUser != null){
                var jUserLogin = $.toJavaJSONObject(jUser);
                LoginApi.LoginSessionUtils.loginFrontend(request, response, uId);
                //记录最后登录时间
                var isOK = LoginApi.UserUtil.setLastLoginLog(jUserLogin, request);
                if (isOK) {
                    LoginApi.IsoneModulesEngine.adminService.updateUser(jUserLogin, uId);
                }
                //执行登录送积分规则
                LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, uId);

                ScanService.saveScanCodeData(scanCode, null);
                ret.state = "ok";
                out.print(JSON.stringify(ret));
            } else{
                ret.state = "err";
                out.print(JSON.stringify(ret));
            }
        } else{
            out.print(JSON.stringify(ret));
        }
    } catch (e) {
        $.log(e);
        ret.state = "err";
        return;
    }
})();