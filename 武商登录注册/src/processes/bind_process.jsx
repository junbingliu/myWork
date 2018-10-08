//#import Util.js
//#import login.js
//#import user.js
//#import sysArgument.js
//#import session.js
//#import HttpUtil.js

(function (processor) {
    processor.on("all", function (pageData, dataIds, elems) {
        try {
            var isMobileClient = false;
            var userAgent = request.getHeader("User-Agent");
            if (userAgent && userAgent.contains("Android") ||
                userAgent.contains("iPhone") || // Ericsson WAP phones and emulators
                userAgent.contains("iPad") || // Ericsson WapIDE 2.0
                userAgent.contains("Oper")) {
                isMobileClient = true;
            }

            var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl");
            var mid = "head_merchant";
            var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");
            var normalWebSite = $.getWebSite("");
            var callback_url = Packages.net.xinshi.isone.openapi.app.IIs1AppService.Callback_Url;
            var returnUrl = SessionService.getSessionValue(callback_url, request);
            var loginType = $.params.loginType;
            var code = $.params.code;
            if (loginType == "deyi") {

                var deyiAppId = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument_loginservice", "deyiAppId");
                var deyiAppKey = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument_loginservice", "deyiAppKey");
                var postData = {};
                postData.appid = deyiAppId;
                postData.secret = deyiAppKey;
                postData.code = code;
                var url = "http://newapi.deyi.com/user/oauth/accesstoken";
                var postResult = HttpUtils.postData(url, postData);

                var openId = postResult.data.openid;
                var access_token = postResult.data.access_token;

                if (!openId) {
                    //response.sendRedirect(webUrl + "/ucenter/index.html");
                    response.sendRedirect(webUrl + "/member/index.jsp");
                    return;
                }
                if (!access_token) {
                    //response.sendRedirect(webUrl + "/ucenter/index.html");
                    response.sendRedirect(webUrl + "/member/index.jsp");
                    return;
                }

                var uId = LoginService.judgeMemberField(openId, "deyi");
                if (uId) {
                    var jUser = UserService.getUser(uId);
                    if (jUser != null) {
                        var jUserLogin = $.toJavaJSONObject(jUser);
                        LoginApi.LoginSessionUtils.loginFrontend(request, response, uId);
                        //记录最后登录时间
                        var isOK = LoginApi.UserUtil.setLastLoginLog(jUserLogin, request);
                        if (isOK) {
                            LoginApi.IsoneModulesEngine.adminService.updateUser(jUserLogin, uId);
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
                    }
                }
                SessionService.addSessionValue("openId", openId, request, response);
                SessionService.addSessionValue("access_token", access_token, request, response);
                /*
                 setPageDataProperty(pageData, "openid", encodeURIComponent(openid));
                 setPageDataProperty(pageData, "access_token", encodeURIComponent(access_token));
                 */
                if (isMobileClient) {
                    response.sendRedirect(webUrl + "/mobileApp/jump.jsx?htmlName=memberCenter/PhoneBinding");
                    return;
                }
            } else if (loginType == "weChat") {
                var strUserInfo = SessionService.getSessionValue("wexchat_userInfo", request);
                if (!strUserInfo) {
                    out.print("非法操作");
                    return;
                }

                var userInfo = JSON.parse(strUserInfo);
                var openId = userInfo.weChatId;
                var uId = LoginService.judgeMemberField(openId, "weChat");
                if (uId) {
                    var jUser = UserService.getUser(uId);
                    if(jUser){
                        SessionService.removeSessionValue("wexchat_userInfo");
                        var jUserLogin = $.toJavaJSONObject(jUser);
                        LoginApi.LoginSessionUtils.loginFrontend(request, response, uId);
                        //记录最后登录时间
                        var isOK = LoginApi.UserUtil.setLastLoginLog(jUserLogin, request);
                        if (isOK) {
                            LoginApi.IsoneModulesEngine.adminService.updateUser(jUserLogin, uId);
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
                    }
                }

                if (isMobileClient) {
                    response.sendRedirect(webUrl + "/mobileApp/jump.jsx?htmlName=memberCenter/PhoneBinding");
                    return;
                }
            }

            var intervalTime = 120;//秒，发送间隔时间
            if (pageData && pageData.config && pageData.config.msgInterval && pageData.config.msgInterval.value != "") {
                var msgInterval = Number(pageData.config.msgInterval.value);
                if (!isNaN(msgInterval)) {
                    intervalTime = msgInterval;
                }
            }

            //$.log("\n................3333333.........appId="+appId);
            //页面随机数，以下是为了保证发送短信页面是由当前页面提交的
            var pageValidateCode = getPageRandomString();
            var pageValidateCodeValueAt = getPageRandomValueAt();
            var pageValidateCodeValue = getPageRandomValue(pageValidateCode, pageValidateCodeValueAt);
            SessionService.addSessionValue("pageValidateCodeValue", pageValidateCodeValue, request, response);
            setPageDataProperty(pageData, "pageValidateCode", pageValidateCode);
            setPageDataProperty(pageData, "pageValidateCodeValue", pageValidateCodeValueAt);
            setPageDataProperty(pageData, "webName", webName);
            setPageDataProperty(pageData, "normalWebSite", normalWebSite);
            setPageDataProperty(pageData, "intervalTime", intervalTime);
            setPageDataProperty(pageData, "returnUrl", returnUrl);
            setPageDataProperty(pageData, "appId", pageData["_appId_"]);
            setPageDataProperty(pageData, "mid", mid);
            setPageDataProperty(pageData, "loginType", loginType);
        } catch (e) {
            $.log(e);
        }
    });
})(dataProcessor);

var PAGE_RAND_LENGTH = 30;
var PAGE_VALUE_LENGTH = 10;
var getPageRandomString = function () {
    var randStr = "";
    for (var i = 0; i < PAGE_RAND_LENGTH; i++) {
        randStr += Math.floor(Math.random() * PAGE_RAND_LENGTH);
    }
    return randStr;
};
var getPageRandomValueAt = function () {
    var randStr = "";
    for (var i = 0; i < PAGE_VALUE_LENGTH; i++) {
        if (randStr) {
            randStr += "," + Math.floor(Math.random() * PAGE_RAND_LENGTH);
        } else {
            randStr += Math.floor(Math.random() * PAGE_RAND_LENGTH);
        }
    }
    return randStr;
};
var getPageRandomValue = function (pageValidateCode, pageValidateCodeValueAt) {
    var pageValidateCodeValueBegin = "";
    var pageValidateCodeValueEnd = "";
    var valueAt = pageValidateCodeValueAt.split(",");
    for (var i = 0; i < valueAt.length; i++) {
        var iAt = parseInt(valueAt[i]);
        if (i % 2 == 0) {
            pageValidateCodeValueBegin += pageValidateCode.charAt(iAt);
        } else {
            pageValidateCodeValueEnd += pageValidateCode.charAt(iAt);
        }
    }
    return pageValidateCodeValueBegin + pageValidateCodeValueEnd;
}
