//#import Util.js
//#import login.js
//#import user.js
//#import sysArgument.js
//#import session.js
//#import HttpUtil.js
//#import pageService.js
//#import $wsLogin:service/service.jsx

var curApi = new JavaImporter(
    Packages.net.xinshi.isone.modules.businessruleEx.rule.bean
);

(function () {
    var mobilePhone = $.params.mobilePhone;
    var mobileValidateCode = $.params.mobileValidateCode;
    try {
        var errorCode = "";
        var ret = {
            state: false,
            errorCode: errorCode
        }

        if (!mobilePhone) {
            errorCode = "手机号码不能为空";
            out.print(JSON.stringify(ret));
            return;
        }

        var result = LoginService.judgeMemberField(mobilePhone);
        if (result == "-1" || (result && result != "null")) {
            ret.errorCode = "该号码已经注册，请使用旧账号绑定登录";
            out.print(JSON.stringify(ret));
            return;
        }
        if (!mobileValidateCode) {
            ret.errorCode = "短信验证码不能为空";
            out.print(JSON.stringify(ret));
            return;
        }

        var validTime = 5;//分钟，短信验证码有效时间
        var pageData = pageService.getMerchantPageData(mid, appId, pageId);
        if (pageData && pageData.config && pageData.config.validTimeMobile && pageData.config.validTimeMobile.value != "") {
            var vTime = Number(pageData.config.validTimeMobile.value);
            if (!isNaN(vTime)) {
                validTime = vTime;
            }
        }

        var mobileCaptchaSessionName = "mobileCaptchaObj";
        var sessionValue = SessionService.getSessionValue(mobileCaptchaSessionName, request);
        if (!sessionValue) {
            ret.errorCode = "短信验证码为空";
            out.print(JSON.stringify(ret));
            return;
        }
        var mobileCaptchaObj = JSON.parse(sessionValue);
        var timeOut = 120 * 1000;
        var currTime = new Date().getTime();
        if (currTime - mobileCaptchaObj["lastTime"] >= timeOut) {
            //超时
            ret.errorCode = "短信验证码已过期";
            out.print(JSON.stringify(ret));
            return;
        }

        if (mobileCaptchaObj["captcha"] != mobileValidateCode) {
            //验证码错误
            ret.errorCode = "短信验证码错误";
            out.print(JSON.stringify(ret));
            return;
        }
        SessionService.removeSessionValue(mobileCaptchaSessionName);
        var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl");
        var mid = "head_merchant";
        var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");
        var normalWebSite = $.getWebSite("");
        var callback_url = Packages.net.xinshi.isone.openapi.app.IIs1AppService.Callback_Url;
        var returnUrl = SessionService.getSessionValue(callback_url, request);
        var loginType = $.params.loginType;
        if (loginType == "deyi") {
            /*
             var code = $.params.code;
             if(!code){
             errorCode = "empty_code";
             ret.errorCode = errorCode;
             out.print(JSON.stringify(ret));
             return;
             }
             var deyiAppId = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument_loginservice", "deyiAppId");
             var deyiAppKey = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument_loginservice", "deyiAppKey");
             var postData = {};
             postData.appid = deyiAppId;
             postData.secret = deyiAppKey;
             postData.code = decodeURIComponent(code);
             $.log("================= deyiAppId2_" + deyiAppId);
             $.log("================= deyiAppKey2_" + deyiAppKey);
             $.log("================= code21_" + decodeURIComponent(code));
             var url = "http://newapi.deyi.com/user/oauth/accesstoken";
             var postResult = HttpUtils.postData(url, postData);
             $.log("================= postResult1_" + JSON.stringify(postResult));
             */
            /*
             var openid = postResult.data.openid;
             var access_token = postResult.data.access_token;
             */
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

            var lockId = "dyBindPhone_handler_" + openId;
            try {
                ScanService.getPigeon().lock(lockId);

                var uId = LoginService.judgeMemberField(openId, "deyi");
                var jUser = UserService.getUser(uId);
                if (jUser) {
                    var mobilPhone = jUser.mobilPhone;
                    if (mobilPhone) {
                        add2UserGroup(jUser, "c_501");//添加到得意会员组

                        var jUserLogin = $.toJavaJSONObject(jUser);
                        LoginApi.LoginSessionUtils.loginFrontend(request, response, uId);
                        //记录最后登录时间
                        var isOK = LoginApi.UserUtil.setLastLoginLog(jUserLogin, request);
                        if (isOK) {
                            UserService.IsoneModulesEngine.adminService.updateUser(jUserLogin, uId);

                        }
                        //执行登录送积分规则
                        LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, uId);
                        if (returnUrl) {
                            SessionService.removeSessionValue(callback_url);
                            response.sendRedirect(returnUrl);
                            return;
                        } else {
                            response.sendRedirect("/");
                            return;
                        }
                    } else {
                        jUser["openId"] = openId;
                        jUser["mobilPhone"] = mobilePhone;
                        jUser["checkedphoneStatus"] = "1";

                        add2UserGroup(jUser, "c_501");//添加到得意会员组

                        UserService.updateUser(jUser, uId);
                        ret.state = true;
                    }
                } else {
                    var postData2 = {};
                    postData2.openId = decodeURIComponent(openId);
                    postData2.access_token = decodeURIComponent(access_token);
                    var url2 = "http://newapi.deyi.com/user/oauth/userinfo";
                    var postResult2 = HttpUtils.postData(url2, postData2);
                    jUser = {};
                    jUser["isAdmin"] = "0";
                    jUser["merchantId"] = "";
                    jUser["source_isOnline"] = "1";//是否线上
                    jUser["ip"] = $.getClientIp();
                    jUser["userCardBindStatus"] = "0";
                    jUser["isEnable"] = "1";//1表示激活
                    jUser["mobilPhone"] = mobilePhone;
                    jUser["checkedemailStatus"] = "0";
                    jUser["checkedphoneStatus"] = "1";
                    jUser["openId"] = openId;
                    jUser["source"] = "deyi";//来源
                    jUser["source_entrance"] = "default";
                    if (postResult2.data.username) {
                        jUser["nickName"] = postResult2.data.username;
                    }
                    if (postResult2.data.avatar) {
                        jUser["logo"] = postResult2.data.avatar;
                    }

                    add2UserGroup(jUser, "c_501");//添加到得意会员组

                    var javaUserJson = $.toJavaJSONObject(jUser);
                    var userId = UserApi.IsoneModulesEngine.memberService.addUser(javaUserJson, null);
                    //默认设置为普通会员
                    var level = UserApi.IUserService.MEMBERGROUP_COMMON;
                    UserApi.IsoneModulesEngine.memberService.updateMemberGroup(javaUserJson, UserApi.IUserService.MEMBERGROUP_TYPE_ONE, level);
                    UserApi.IsoneModulesEngine.memberService.addMemberField(mobilePhone, userId);
                    UserApi.IsoneModulesEngine.memberService.addMemberField(openId, userId, "deyi");
                    UserApi.LoginSessionUtils.loginFrontend(request, response, userId);
                    ret.state = true;

                    //执行登录送积分规则
                    doExecutePlanEvent(userId, jUser);
                }
            } finally {
                ScanService.getPigeon().unlock(lockId);
            }
        } else if (loginType == "weChat") {
            var strUserInfo = SessionService.getSessionValue("wexchat_userInfo", request);
            if (!strUserInfo) {
                ret.errorCode = "请重新登录授权";
                out.print(JSON.stringify(ret));
                return;
            }
            SessionService.removeSessionValue("wexchat_userInfo");

            var weiXinUserInfo = JSON.parse(strUserInfo);
            var openId = weiXinUserInfo.weChatId;
            if (!openId) {
                ret.errorCode = "请重新登录授权";
                out.print(JSON.stringify(ret));
                return;
            }
            var lockId = "weChatBindPhone_handler_" + openId;
            try {
                ScanService.getPigeon().lock(lockId);
                var uId = LoginService.judgeMemberField(openId, "weChat");
                var jUser = UserService.getUser(uId);
                if (jUser) {
                    var mobilPhone = jUser.mobilPhone;
                    if (mobilPhone) {
                        add2UserGroup(jUser, "c_502");//添加到微信会员组
                        var jUserLogin = $.toJavaJSONObject(jUser);
                        LoginApi.LoginSessionUtils.loginFrontend(request, response, uId);
                        //记录最后登录时间
                        var isOK = LoginApi.UserUtil.setLastLoginLog(jUserLogin, request);
                        if (isOK) {
                            UserService.IsoneModulesEngine.adminService.updateUser(jUserLogin, uId);
                        }
                        //执行登录送积分规则
                        LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, uId);

                        if (returnUrl) {
                            SessionService.removeSessionValue(callback_url);
                            response.sendRedirect(returnUrl);
                            return;
                        } else {
                            response.sendRedirect("/");
                            return;
                        }
                    } else {
                        jUser["openId"] = openId;
                        jUser["mobilPhone"] = mobilePhone;
                        jUser["checkedphoneStatus"] = "1";
                        if (weiXinUserInfo.nickName) {
                            jUser["nickName"] = weiXinUserInfo.nickName;
                        }
                        if (weiXinUserInfo.logo) {
                            jUser["logo"] = weiXinUserInfo.logo;
                        }
                        if (weiXinUserInfo.gender) {
                            jUser["gender"] = weiXinUserInfo.gender;
                        }

                        add2UserGroup(jUser, "c_502");//添加到微信会员组

                        UserService.updateUser(jUser, uId);
                        ret.state = true;
                    }
                } else {
                    jUser = {};
                    jUser["isAdmin"] = "0";
                    jUser["merchantId"] = "";
                    jUser["source_isOnline"] = "1";//是否线上
                    jUser["ip"] = $.getClientIp();
                    jUser["userCardBindStatus"] = "0";
                    jUser["isEnable"] = "1";//1表示激活
                    jUser["mobilPhone"] = mobilePhone;
                    jUser["checkedemailStatus"] = "0";
                    jUser["checkedphoneStatus"] = "1";
                    jUser["openId"] = openId;
                    jUser["source"] = "weChat";//来源
                    jUser["source_entrance"] = "default";
                    if (weiXinUserInfo.nickName) {
                        jUser["nickName"] = weiXinUserInfo.nickName;
                    }
                    if (weiXinUserInfo.logo) {
                        jUser["logo"] = weiXinUserInfo.logo;
                    }
                    if (weiXinUserInfo.gender) {
                        jUser["gender"] = weiXinUserInfo.gender;
                    }

                    add2UserGroup(jUser, "c_502");//添加到微信会员组

                    //
                    var javaUserJson = $.toJavaJSONObject(jUser);
                    var userId = UserApi.IsoneModulesEngine.memberService.addUser(javaUserJson, null);
                    //默认设置为普通会员
                    var level = UserApi.IUserService.MEMBERGROUP_COMMON;
                    UserApi.IsoneModulesEngine.memberService.updateMemberGroup(javaUserJson, UserApi.IUserService.MEMBERGROUP_TYPE_ONE, level);
                    UserApi.IsoneModulesEngine.memberService.addMemberField(mobilePhone, userId);
                    UserApi.IsoneModulesEngine.memberService.addMemberField(openId, userId, "weChat");
                    UserApi.LoginSessionUtils.loginFrontend(request, response, userId);

                    //执行登录送积分规则
                    doExecutePlanEvent(userId, jUser);
                }
            } finally {
                ScanService.getPigeon().unlock(lockId);
            }
            ret.state = true;
        }
        if (returnUrl) {
            returnUrl = Packages.java.net.URLDecoder.decode(returnUrl, "UTF-8") + "";
            SessionService.removeSessionValue(callback_url);
        }
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

function add2UserGroup(jUser, newGroupId) {
    var memberGroups = jUser.memberGroups;

    if (!memberGroups) {
        memberGroups = {};
        jUser.memberGroups = memberGroups;
    }

    //检查是否已经存在
    var jMemberGroup = memberGroups[newGroupId];
    if (!jMemberGroup) {
        var beginTime = new Date().getTime() + "";
        var endTime = "4102415999000";

        jMemberGroup = {};
        jMemberGroup.groupId = newGroupId;
        jMemberGroup.createTime = beginTime;
        jMemberGroup.beginTime = endTime;
        memberGroups[newGroupId] = jMemberGroup;
    }
}

function doExecutePlanEvent(userId, jUser){
    //执行登录送积分规则
    LoginApi.IsoneBusinessRuleEngineEx.loginPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, userId);

    //手机注册并且短信验证成功的
    var checkedphoneStatus = jUser["checkedphoneStatus"];
    if (checkedphoneStatus == "1") {
        //执行注册奖励规则
        LoginApi.IsoneBusinessRuleEngineEx.registerPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, userId, curApi.Behavior.sms_activation);
        //执行推荐会员奖励规则
        var recommendedUserId = jUser["recommendedUserId"];
        if(recommendedUserId){
            LoginApi.IsoneBusinessRuleEngineEx.recommendMemberPlanExecutor.executePlan(LoginApi.Global.HEAD_MERCHANT, recommendedUserId, userId, curApi.Behavior.sms_activation);
        }
    }
}