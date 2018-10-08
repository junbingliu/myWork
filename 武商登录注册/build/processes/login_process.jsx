//#import Util.js
//#import login.js
//#import sysArgument.js
//#import DigestUtil.js
//#import session.js
//#import $globalSysArgsSetting:services/GlobalSysArgsService.jsx

(function (processor) {
    processor.on("all", function (pageData, dataIds, elems) {
        try {
            var ltype = $.params.ltype;
            if (ltype && ltype == "logout") {
                response.sendRedirect("/logout.html");
            }

            var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl") + "";

            //现在已登录状态下如果访问/login/sign_in.jsp页面,不用跳转到会员中心
            var user = LoginService.getFrontendUser();

            if (pageData.productionMode) {
                if (user) {
                    //response.sendRedirect(webUrl + "/ucenter/index.html");
                    response.sendRedirect(webUrl + "/member/index.jsp");
                    return;
                }
            }

            var mid = "head_merchant";
            var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");
            var returnUrl = $.params.redirectURL || $.params.returnUrl || $.params.rurl;
            if (!returnUrl || returnUrl == "") {
                returnUrl = request.getHeader("referer") + "";
                if (returnUrl && (returnUrl == "null" || returnUrl == request.getRequestURI() + "")) {
                    returnUrl = "";
                }
                if (returnUrl) {
                    if ((webUrl && (returnUrl.indexOf("http://") > -1 || returnUrl.indexOf("https://") > -1) && returnUrl.indexOf(webUrl) == -1)) {
                        returnUrl = "";
                    }
                }
            }
            if (returnUrl) {
                returnUrl = Packages.java.net.URLDecoder.decode(returnUrl, "UTF-8") + "";
            }

            var selfApi = new JavaImporter(
                Packages.net.xinshi.isone.modules,
                Packages.net.xinshi.isone.modules.sysargument,
                Packages.net.xinshi.isone.commons,
                Packages.org.json,
                Packages.java.lang,
                Packages.java.io,
                Packages.java.util,
                Packages.java.net
            );
            var requestURI = request.getRequestURI() + "";
            var isEdit = false;
            if (requestURI == "/appEditor/handlers/getPageData.jsx") {
                isEdit = true;
            }
            if (!isEdit) {
                var normalWebSite = $.getWebSite("");
                var jArgument = selfApi.IsoneModulesEngine.sysArgumentService.getSysArgument(selfApi.Global.HEAD_MERCHANT, "col_sysargument_loginservice");
                var jArgumentValues = selfApi.SysArgumentUtil.getValues(jArgument);
                var loginShowType = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "loginShowType") + "";
                var is1AppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "is1AppEnable") + "";
                var qqAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "qqAppEnable") + "";
                var alipayAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "alipayAppEnable") + "";
                var sinaAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "sinaAppEnable") + "";
                var baiduAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "baiduAppEnable") + "";
                var t163AppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "t163AppEnable") + "";
                var renrenAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "renrenAppEnable") + "";
                var deyiAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "deyiAppEnable") + "";
                var weixinAppEnable = selfApi.SysArgumentUtil.getSysArgumentStringValue(jArgumentValues, "weixinAppEnable") + "";
                setPageDataProperty(pageData, "normalWebSite", normalWebSite);
                setPageDataProperty(pageData, "loginShowType", loginShowType);
                setPageDataProperty(pageData, "is1AppEnable", is1AppEnable);
                setPageDataProperty(pageData, "qqAppEnable", qqAppEnable);
                setPageDataProperty(pageData, "alipayAppEnable", alipayAppEnable);
                setPageDataProperty(pageData, "sinaAppEnable", sinaAppEnable);
                setPageDataProperty(pageData, "baiduAppEnable", baiduAppEnable);
                setPageDataProperty(pageData, "t163AppEnable", t163AppEnable);
                setPageDataProperty(pageData, "renrenAppEnable", renrenAppEnable);
                setPageDataProperty(pageData, "deyiAppEnable", deyiAppEnable);
                setPageDataProperty(pageData, "weixinAppEnable", weixinAppEnable);
            }

            var intervalTime = 120;//秒，发送间隔时间
            if (pageData && pageData.config && pageData.config.msgInterval && pageData.config.msgInterval.value != "") {
                var msgInterval = Number(pageData.config.msgInterval.value);
                if (!isNaN(msgInterval)) {
                    intervalTime = msgInterval;
                }
            }

            //手机号码加密key...................begin
            var randomCode = parseInt(Math.random() * 900000 + 100000);
            var loginSessionId = request.getSession().getId() + "" + randomCode;
            var md5LoginSessionId = DigestUtil.md5(loginSessionId);
            var key = md5LoginSessionId.substring(0, 16);
            var iv = md5LoginSessionId.substring(md5LoginSessionId.length - 16);
            md5LoginSessionId += "|" + new Date().getTime();//加上有效期
            SessionService.addSessionValue("md5LoginSessionId", md5LoginSessionId, request, response);

            var img_access_token = "";
            var jArgs = GlobalSysArgsService.getArgs();
            if (jArgs) {
                if (jArgs.jigsawAccess_token) img_access_token = jArgs.jigsawAccess_token;
            }
            img_access_token = md5LoginSessionId + img_access_token + md5LoginSessionId;
            //手机号码加密key...................begin

            setPageDataProperty(pageData, "key", key);
            setPageDataProperty(pageData, "iv", iv);
            setPageDataProperty(pageData, "img_access_token", img_access_token);
            setPageDataProperty(pageData, "webUrl", webUrl);
            setPageDataProperty(pageData, "webName", webName);
            setPageDataProperty(pageData, "normalWebSite", normalWebSite);
            setPageDataProperty(pageData, "returnUrl", returnUrl);
            setPageDataProperty(pageData, "intervalTime", intervalTime);
            setPageDataProperty(pageData, "appId", pageData["_appId_"]);
        } catch (e) {
            $.log(e);
        }
    });

})(dataProcessor);