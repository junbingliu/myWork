//#import Util.js
//#import user.js
//#import login.js
//#import session.js
//#import sysArgument.js

(function () {
    try {
        var errorCode = "";
        var needCaptcha = true;
        var ret = {
            state: false,
            errorCode: errorCode
        }

        var loginKey = $.params.phone;    //登录Id，可以是loginId，email,mobilePhone
        var password = $.params.password;  //登录密码
        var rurl = $.params.returnUrl;  //返回url

        if (!loginKey) {
            errorCode = "empty_loginKey";
        }  else if (!password) {
            errorCode = "empty_password";
        }  else {
            var resultCode = {
                100: "success",
                101: "data_error",
                102: "data_error",
                103: "member_error",
                104: "member_error",
                105: "not_enabled",
                106: "password_null"
            };
            var user = LoginApi.IsoneModulesEngine.memberService.getUserByKey(loginKey);
            if (user == null) {
                ret["state"] = false;
                ret.errorCode =  resultCode["104"];
                out.print(JSON.stringify(ret));
                return;
            }
            var passwordhash = user.optString("passwordhash");
            if(!passwordhash || passwordhash == ""){
                ret["state"] = false;
                ret.errorCode =  resultCode["106"];
                out.print(JSON.stringify(ret));
                return;
            }

            var result = LoginApi.LoginUtil.loginByKey(loginKey, password, LoginApi.LoginUtil.TARGET_MEMBER);
            if (result == 100) {
                //100 ==  IUserService.LOGIN_SUCCESSFUL
                var userId = user.optString("id");
                LoginApi.LoginSessionUtils.loginFrontend(request, response, userId);
                //记录最后登录时间
                var isOK = LoginApi.UserUtil.setLastLoginLog(user, request);
                if (isOK) {
                    LoginApi.IsoneModulesEngine.adminService.updateUser(user, userId);
                }
                //执行登录送积分规则
                LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, userId);
                if(rurl && rurl != ""){
                    if(rurl.indexOf("/login/register.jsp") > -1 || rurl.indexOf("/register.html") > -1 || rurl.indexOf("/login/sign_in.jsp") > -1 || rurl.indexOf("/login.html") > -1 || rurl.indexOf("/register_email_validate.html") > -1 || rurl.indexOf("/register_success.html") > -1){
                        rurl = "";
                    }
                    var javaRurl = new Packages.java.lang.String(rurl);
                    if(javaRurl.startsWith("/ucenter")){
                        var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl");
                        rurl = webUrl + rurl;
                    }
                }
                if (rurl) {
                    rurl = Packages.java.net.URLDecoder.decode(rurl, "UTF-8") + "";
                }
                ret["state"] = true;
                ret["returnUrl"] = rurl;
            } else {
                ret["state"] = false;
            }
            errorCode = resultCode[result];
        }
        ret.errorCode = errorCode;
        out.print(JSON.stringify(ret));
    } catch (e) {
        var ret = {
            state: false,
            errorCode: "system_error"
        }
        out.print(JSON.stringify(ret));
        $.log(e);
    }
})();