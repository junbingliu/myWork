//#import Util.js
//#import login.js
//#import user.js
//#import session.js
//#import json2.js
//#import NoticeTrigger.js
//#import pageService.js
//#import sysArgument.js

;(function() {

    function sendNotice(mobilPhone, noticeId, merchantId, jLabel) {
        var jNotice = NoticeTriggerApi.IsoneModulesEngine.noticeService.getNotice(noticeId);
        if (!jNotice) {
            return 1;
        }

        var noticeType = jNotice.optString("type");
        var jNoticeTemplate = jNotice.optJSONObject("template");
        if (jNoticeTemplate == null) {
            return 2;
        }
        if (!mobilPhone) {
            return 3;
        }

        var sendSms = jNotice.optString("sendSms");
        if (sendSms && sendSms == "是") {
            var templateType = Packages.net.xinshi.isone.modules.noticeTrigger.NoticeTemplateUtil.getMerchantTemplateType("smsTemplate", merchantId);
            var templateId = jNoticeTemplate.optString(templateType);

            if (templateId) {
                var jTemplate = NoticeTriggerApi.IsoneModulesEngine.noticeService.getTemplate(templateId);
                var content = NoticeTriggerApi.IsoneModulesEngine.noticeTrigger.getNoticeTemplateContent(jTemplate, jLabel);
                var smsBean = new Packages.net.xinshi.isone.modules.sms.bean.SmsBean();
                smsBean.setPhone(mobilPhone);
                smsBean.setMessage(content);
                smsBean.setLoginId("");
                smsBean.setSmsType(noticeType);
                var jSendMessage = smsBean.toJSON();
                jSendMessage.put("noticeId", noticeId);
                jSendMessage.put("merchantId", merchantId);
                try {
                    NoticeTriggerApi.IsoneModulesEngine.sms.sendSmsQue(jSendMessage);
                    return 0;
                } catch (e) {
                    $.log(e);
                    return -1;
                }
            }
        }
        return 4;
    }




    var ret = {
        state:false,
        errorCode:""
    };
    var mobilePhone = $.params.mobilePhone;
    if(!mobilePhone){
        ret.errorCode = "mobile_phone_empty";
        out.print(JSON.stringify(ret));
        return;
    }else if (mobilePhone) {
        var mobileRegex = new RegExp(SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "regex_Mobile"));
        if (!mobileRegex.test(mobilePhone)) {
            errorCode = "mobile_error";
        }
    }
    var checkResult = LoginService.judgeMemberField(mobilePhone);
    if (checkResult && checkResult != "null") {
        ret.errorCode = "mobile_phone_exist";
        out.print(JSON.stringify(ret));
        return;
    }

    var validateCode = $.params.validateCode;    //验证码
    if(!validateCode){
        ret.errorCode = "empty_captcha";
        out.print(JSON.stringify(ret));
        return;
    }

    var sessionCaptcha = SessionService.getSessionValue("ValidateCode", request);
    SessionService.removeSessionValue("ValidateCode");

    if (sessionCaptcha&&sessionCaptcha.toLowerCase() != validateCode.toLowerCase()) {
        ret.errorCode = "captcha_error";
        out.print(JSON.stringify(ret));
        return;
    }

    var merchantId = "head_merchant";

    var mid = $.params.mid || "";
    var pageId = $.params.pageId || "";

    var intervalTime = 120;//秒，发送间隔时间
    var pageData = pageService.getMerchantPageData(mid,appId,pageId);
    if(pageData && pageData.config && pageData.config.msgInterval && pageData.config.msgInterval.value != ""){
        var msgInterval = Number(pageData.config.msgInterval.value);
        if(!isNaN(msgInterval)){
            intervalTime = msgInterval;
        }
    }

    var validTime = 5;//分钟，短信验证码有效时间
    if(pageData && pageData.config && pageData.config.validTimeMobile && pageData.config.validTimeMobile.value != ""){
        var vTime = Number(pageData.config.validTimeMobile.value);
        if(!isNaN(vTime)){
            validTime = vTime;
        }
    }


    //生成验证码
    var sessionName = "mobileCaptchaObj";
    var clientIp = $.getClientIp();
    var currTime = new Date().getTime();
    var timeOut = intervalTime * 1000;
    var mobileCaptchaObj = {},captchaObj;
    var sessionValue = SessionService.getSessionValue(sessionName,request);
    if(sessionValue){
        mobileCaptchaObj = JSON.parse(sessionValue);
        captchaObj = mobileCaptchaObj[mobilePhone];
    }
    if(captchaObj){
        var lastTime = captchaObj["lastTime"];
        if(lastTime + timeOut >= currTime){
            //检查一分钟只能发一次
            ret.errorCode = "wait";
            out.print(JSON.stringify(ret));
            return;
        }

        if(lastTime + (validTime * 60 * 1000) >= currTime){
            //在有效期内
            $.log("validTime=="+validTime);
            ret.errorCode = "active";
            out.print(JSON.stringify(ret));
            return;
        }
    }
    mobileCaptchaObj = {},captchaObj = {};
    var captcha = parseInt(Math.random() * 900000 + 100000);
    captchaObj["captcha"] = captcha;
    captchaObj["lastTime"] = currTime;
    captchaObj["clientIp"] = clientIp;
    mobileCaptchaObj[mobilePhone] = captchaObj;
    SessionService.addSessionValue(sessionName,JSON.stringify(mobileCaptchaObj),request,response);

    var jLabel = new NoticeTriggerApi.JSONObject();
    jLabel.put("\\[validateCode\\]", captcha + "");
    var returnNum = sendNotice(mobilePhone, "notice_50101", merchantId, jLabel);
    if(returnNum == 0){
        ret.errorCode = "";
        ret.state = true;
    }else{
        ret.errorCode = "send_error";
        ret.returnNum = returnNum;
    }
    out.print(JSON.stringify(ret));
})();