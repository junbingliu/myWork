//#import Util.js
//#import login.js
//#import sysArgument.js
//#import session.js
//#import user.js
//#import DateUtil.js
//#import NoticeTrigger.js
//#import encryptUtil.js
//#import JigsawValidateUtil.js

(function () {

    var ret = {
        state:false,
        errorCode:"",
        result:{}
    };

    var nowTime = new Date().getTime();

    //加解密密钥...................begin
    var md5LoginSessionIdValue = SessionService.getSessionValue("md5LoginSessionId", request);
    var md5Value = md5LoginSessionIdValue.split("|");
    var md5LoginSessionId = md5Value[0];
    var addTime = md5Value[1];
    if (nowTime - Number(addTime) > 1000 * 60 * 3) {
        ret.result.code = '201';
        ret.result.msg = '参数非法';
        out.print(JSON.stringify(ret));
        return;
    }
    var key = md5LoginSessionId.substring(0, 16);
    var iv = md5LoginSessionId.substring(md5LoginSessionId.length - 16);
    //加解密密钥...................end

    //位移验证........................begin
    var moveX = $.params["moveX"];
    var boxWidth = $.params["boxWidth"];
    if (!moveX || !boxWidth) {
        ret.code = "202";
        ret.msg = "参数错误";
        out.print(JSON.stringify(ret));
        return;
    }
    moveX = EncryptUtil.decryptData(moveX, key, iv);
    boxWidth = EncryptUtil.decryptData(boxWidth, key, iv);
    moveX = Number(moveX);
    boxWidth = Number(boxWidth);

    var realX = "";
    var imageWidth = "";
    var jigsawSessionValue = SessionService.getSessionValue("jigsawSessionValue", request);
    if (jigsawSessionValue) {
        var jsv = jigsawSessionValue.split("|");
        realX = jsv[0];
        imageWidth = jsv[1];
    }
    if (!realX || !imageWidth) {
        ret.result.code = '203';
        ret.result.msg = '参数非法';
        out.print(JSON.stringify(ret));
        return;
    }
    var isSuccess = JigsawValidateUtil.checkMove(Number(realX), Number(imageWidth), Number(moveX), Number(boxWidth));
    if (!isSuccess) {
        ret.result.code = '204';
        ret.result.msg = '参数非法';
        out.print(JSON.stringify(ret));
        return;
    }
    ret.result.code = '0';//位移验证成功
    //位移验证........................end


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

    function getPageRandomValue(pageValidateCode, pageValidateCodeValueAt){
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

    var mobilePhone = $.params.p;
    if(!mobilePhone){
        ret.errorCode = "mobile_phone_empty";
        out.print(JSON.stringify(ret));
        return;
    }

    //手机号码解密...................begin
    mobilePhone = EncryptUtil.decryptData(mobilePhone, key, iv);
    var tempPhone = mobilePhone.split("#");
    if (tempPhone.length != 3) {
        ret.errorCode = "illegal_parameter";
        out.print(JSON.stringify(ret));
        return;
    }
    mobilePhone = tempPhone[1];
    //手机号码解密...................end
    $.log("\n.............................mobilePhone=" + mobilePhone);

    var checkResult = LoginService.judgeMemberField(mobilePhone);
    if (checkResult && checkResult != "null") {
        ret.errorCode = "mobile_phone_exist";
        out.print(JSON.stringify(ret));
        return;
    }

    var merchantId = "head_merchant";
    var pageId = $.params.pageId || "";
    var intervalTime = 120;//秒，发送间隔时间
    var validTime = 120;//秒，短信验证码有效时间

    //生成验证码
    var mobileCaptchaSessionName = "mobileCaptchaObj";
    var clientIp = $.getClientIp();
    var currTime = new Date().getTime();
    var timeOut = intervalTime * 1000;
    var mobileCaptchaSessionValue = SessionService.getSessionValue(mobileCaptchaSessionName,request);
    var mobileCaptchaObj;
    if(mobileCaptchaSessionValue){
        mobileCaptchaObj = JSON.parse(mobileCaptchaSessionValue);
        var lastTime = mobileCaptchaObj["lastTime"];
        if(lastTime + timeOut >= currTime){
            //检查2分钟只能发一次
            ret.errorCode = "wait";
            out.print(JSON.stringify(ret));
            return;
        }
        if(lastTime + (validTime * 1000) >= currTime){
            //在有效期内
            ret.errorCode = "active";
            out.print(JSON.stringify(ret));
            return;
        }
    }



    mobileCaptchaObj = {};
    var captcha = parseInt(Math.random() * 900000 + 100000);
    mobileCaptchaObj["mobile"] = mobilePhone;
    mobileCaptchaObj["captcha"] = captcha;
    mobileCaptchaObj["lastTime"] = currTime;
    mobileCaptchaObj["clientIp"] = clientIp;
    SessionService.addSessionValue(mobileCaptchaSessionName,JSON.stringify(mobileCaptchaObj),request,response);

    var phoneValidateCode = captcha + "-" + currTime;
    SessionService.addSessionValue("phoneValidatePhone",mobilePhone,request,response);
    SessionService.addSessionValue("phoneValidateCode",phoneValidateCode,request,response);
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
