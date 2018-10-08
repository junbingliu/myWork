//#import Util.js
//#import login.js
//#import user.js
//#import sysArgument.js
//#import session.js
//#import HttpUtil.js
//#import pageService.js

(function () {
    var loginId = $.params.loginId;
    var password = $.params.password;  //登录密码
    try {
        var errorCode = "";
        var ret = {
            state: false,
            errorCode: errorCode
        }

        if (!loginId) {
            ret.errorCode = "登录帐号不能为空";
            out.print(JSON.stringify(ret));
            return;
        }
        if (!password) {
            ret.errorCode = "登录密码不能为空";
            out.print(JSON.stringify(ret));
            return;
        }

        var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl");
        var mid = "head_merchant";
        var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");
        var normalWebSite = $.getWebSite("");
        var callback_url = Packages.net.xinshi.isone.openapi.app.IIs1AppService.Callback_Url;
        var returnUrl = SessionService.getSessionValue(callback_url, request);
        var user = LoginApi.IsoneModulesEngine.memberService.getUserByKey(loginId);
        if (user == null) {
            ret.errorCode = "此号码未注册，请完成新号码绑定注册";
            out.print(JSON.stringify(ret));
            return;
        }

        var result = LoginApi.LoginUtil.loginByKey(loginId, password, LoginApi.LoginUtil.TARGET_MEMBER);
        if (result != 100) {
            ret.errorCode = "您输入的登录密码有误，无法完成帐号绑定！";
            out.print(JSON.stringify(ret));
            return;
        }

        var source = user.optString("source")+"";
        if(source == "kaixin" || source == "maoku" || source == "renren" || source == "douban"
            || source == "baidu" || source == "sina" || source == "tqq" || source == "t163"
            || source == "taobao" || source == "deyi" || source == "alipay" || source == "qq"
            || source == "weChat" || source == "deyiMobile"){
            ret.errorCode = "此账号已关联其他合作网站，不支持绑定！";
            out.print(JSON.stringify(ret));
            return;
        }
        var userId = user.optString("id")+"";
        var loginType = $.params.loginType;
        if (loginType == "deyi") {
            var openId = SessionService.getSessionValue("openId", request);
            var access_token = SessionService.getSessionValue("access_token", request);
            if (!openId) {
                errorCode = "请重新登录授权";
                ret.errorCode = errorCode;
                out.print(JSON.stringify(ret));
                return;
            }
            if (!access_token) {
                errorCode = "请重新登录授权";
                ret.errorCode = errorCode;
                out.print(JSON.stringify(ret));
                return;
            }
            SessionService.removeSessionValue("openId");
            SessionService.removeSessionValue("access_token");

            var postData = {};
            postData.openId = decodeURIComponent(openId);
            postData.access_token = decodeURIComponent(access_token);
            var url = "http://newapi.deyi.com/user/oauth/userinfo";
            var postResult = HttpUtils.postData(url, postData);

            user.put("openId", openId);
            user.put("source", "deyi");//来源
            user.put("source_entrance", "default");
            if (postResult.data.username) {
                user.put("nickName", postResult.data.username);
            }
            if (postResult.data.avatar) {
                user.put("logo", postResult.data.avatar);
            }
            LoginApi.LoginSessionUtils.loginFrontend(request, response, userId);
            //记录最后登录时间
            var isOK = LoginApi.UserUtil.setLastLoginLog(user, request);
            if (isOK) {
                UserApi.IsoneModulesEngine.memberService.addMemberField(openId, userId, "deyi");
                LoginApi.IsoneModulesEngine.adminService.updateUser(user, userId);
            }
            UserService.addUserToGroup(userId + "", "c_501");//自动添加到得意网会员组
            //执行登录送积分规则
            LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, userId);
        } else if (loginType == "weChat") {
            var strUserInfo = SessionService.getSessionValue("wexchat_userInfo", request);
            if (!strUserInfo) {
                errorCode = "请重新登录授权";
                ret.errorCode = errorCode;
                out.print(JSON.stringify(ret));
                return;
            }
            var weiXinUserInfo = JSON.parse(strUserInfo);
            var openId = weiXinUserInfo.weChatId;
            SessionService.removeSessionValue("wexchat_userInfo");

            user.put("openId", openId);
            user.put("source", "weChat");//来源
            user.put("source_entrance", "default");
            if (weiXinUserInfo.nickName) {
                user.put("nickName", weiXinUserInfo.nickName);
            }
            if (weiXinUserInfo.logo) {
                user.put("logo", weiXinUserInfo.logo);
            }
            if (weiXinUserInfo.gender) {
                user.put("gender", weiXinUserInfo.gender);
            }
            LoginApi.LoginSessionUtils.loginFrontend(request, response, userId);
            UserApi.IsoneModulesEngine.memberService.addMemberField(openId, userId, "weChat");
            //记录最后登录时间
            var isOK = LoginApi.UserUtil.setLastLoginLog(user, request);
            if (isOK) {
                LoginApi.IsoneModulesEngine.adminService.updateUser(user, userId);
            }

            UserService.addUserToGroup(userId + "", "c_502");//自动添加到微信会员组

            //执行登录送积分规则
            LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, userId);

        }

        if (returnUrl) {
            returnUrl = Packages.java.net.URLDecoder.decode(returnUrl, "UTF-8") + "";
            SessionService.removeSessionValue(callback_url);
        }
        ret.state = true;
        ret.errorCode = errorCode;
        ret.returnUrl = returnUrl;
        out.print(JSON.stringify(ret));
    } catch (e) {
        var ret = {
            state: false,
            errorCode: "系统异常，请联系管理员"
        }
        out.print(JSON.stringify(ret));
        $.log(e);
    }
})();
