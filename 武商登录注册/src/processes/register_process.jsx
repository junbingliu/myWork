//#import Util.js
//#import Info.js
//#import session.js
//#import DigestUtil.js
//#import sysArgument.js
//#import $globalSysArgsSetting:services/GlobalSysArgsService.jsx

(function (processor) {
    processor.on("all", function (pageData, dataIds, elems) {
        var parentId= $.params.parentId || "";
        try {
            var mid = "head_merchant";
            var protocol = InfoService.getSimpleInfo("ctmpl_000_004",mid);
            var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn")+"";
            var returnUrl = $.params.returnUrl;
            if(!returnUrl){
                returnUrl = "";
            }
            var intervalTime = 120;//秒，发送间隔时间
            if(pageData && pageData.config && pageData.config.msgInterval && pageData.config.msgInterval.value != ""){
                var msgInterval = Number(pageData.config.msgInterval.value);
                if(!isNaN(msgInterval)){
                    intervalTime = msgInterval;
                }
            }
            var requestURI = request.getRequestURI() + "";
            var normalWebSite = $.getWebSite("");
            //页面随机数，以下是为了保证发送短信页面是由当前页面提交的
            var pageValidateCode = getPageRandomString();
            var pageValidateCodeValueAt = getPageRandomValueAt();
            var pageValidateCodeValue = getPageRandomValue(pageValidateCode, pageValidateCodeValueAt);
            SessionService.addSessionValue("pageValidateCodeValue", pageValidateCodeValue, request, response);
            setPageDataProperty(pageData,"pageValidateCode", pageValidateCode);
            setPageDataProperty(pageData,"pageValidateCodeValue", pageValidateCodeValueAt);
            setPageDataProperty(pageData,"protocol",protocol);
            setPageDataProperty(pageData,"parentId",parentId);
            setPageDataProperty(pageData,"webName",webName);
            setPageDataProperty(pageData,"returnUrl",returnUrl);
            setPageDataProperty(pageData,"normalWebSite",normalWebSite);
            setPageDataProperty(pageData,"intervalTime",intervalTime);
            setPageDataProperty(pageData, "appId", pageData["_appId_"]);
            setPageDataProperty(pageData, "mid", mid);

            //加密key...................begin
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
            //加密key...................end

            setPageDataProperty(pageData, "key", key);
            setPageDataProperty(pageData, "iv", iv);
            setPageDataProperty(pageData, "img_access_token", img_access_token);
        } catch (e) {
            $.log(e);
        }
    });
})(dataProcessor);

var PAGE_RAND_LENGTH = 30;
var PAGE_VALUE_LENGTH = 10;
var getPageRandomString = function(){
    var randStr = "";
    for (var i = 0; i < PAGE_RAND_LENGTH; i++) {
        randStr += Math.floor(Math.random()*PAGE_RAND_LENGTH);
    }
    return randStr;
};
var getPageRandomValueAt = function(){
    var randStr = "";
    for (var i = 0; i < PAGE_VALUE_LENGTH; i++) {
        if(randStr){
            randStr += "," + Math.floor(Math.random()*PAGE_RAND_LENGTH);
        } else{
            randStr += Math.floor(Math.random()*PAGE_RAND_LENGTH);
        }
    }
    return randStr;
};
var getPageRandomValue = function(pageValidateCode, pageValidateCodeValueAt){
    var pageValidateCodeValueBegin = "";
    var pageValidateCodeValueEnd = "";
    var valueAt = pageValidateCodeValueAt.split(",");
    for(var i = 0; i < valueAt.length; i++){
        var iAt = parseInt(valueAt[i]);
        if (i % 2 == 0) {
            pageValidateCodeValueBegin += pageValidateCode.charAt(iAt);
        } else {
            pageValidateCodeValueEnd += pageValidateCode.charAt(iAt);
        }
    }
    return pageValidateCodeValueBegin + pageValidateCodeValueEnd;
}
