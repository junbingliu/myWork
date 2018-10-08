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

    var ret = {};
    ret.result = {};

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

    var encryptPhone = $.params['p'];
    if (!encryptPhone) {
        ret.code = "205";
        ret.msg = "参数错误";
        out.print(JSON.stringify(ret));
        return;
    }


    //手机号码解密...................begin
    encryptPhone = EncryptUtil.decryptData(encryptPhone, key, iv);
    $.log("\n.............................encryptPhone=" + encryptPhone);
    var tempPhone = encryptPhone.split("#");
    if (tempPhone.length != 3) {
        ret.code = "206";
        ret.msg = "参数非法";
        out.print(JSON.stringify(ret));
        return;
    }
    var phone = tempPhone[1];
    //手机号码解密...................end

    var regex_Mobile = SysArgumentService.getSysArgumentStringValue('head_merchant', 'col_sysargument', 'regex_Mobile');//手机号码正则表达式
    if (!regex_Mobile) {
        regex_Mobile = "^(13[0-9]|15[0-9]|18[0|2|3|5|6|7|8|9]|147)\\d{8}$";
    }
    $.log("\n.............................phone=" + phone);
    var mobileRegex = new RegExp(regex_Mobile);
    if (!mobileRegex.test(phone)) {
        ret.code = "106";
        ret.msg = "手机号码格式不正确";
        out.print(JSON.stringify(ret));
        return;
    }
    SessionService.removeSessionValue("md5LoginSessionId");

    var sessionKey = "phoneValidateCode";

    var phoneValidateCode = SessionService.getSessionValue(sessionKey, request);
    if (phoneValidateCode) {
        var array = phoneValidateCode.split("-");
        if (array.length == 2) {
            var sendTime = array[1];
            if (nowTime - Number(sendTime) < 1000 * 60) {
                ret.code = "103";
                ret.msg = "发送太频繁";
                out.print(JSON.stringify(ret));
                return;
            }

            if (Number(sendTime) + (5 * 60 * 1000) >= nowTime) {
                //5分钟内有效
                ret.code = "104";
                ret.msg = "还在有效期";
                out.print(JSON.stringify(ret));
                return;
            }
        }
    }

    var randomCode = parseInt(Math.random() * 900000 + 100000);
    var label = {
        "\\[validateCode\\]": randomCode//验证码
    };

    var noticeId = 'notice_50102';
    var jResult = NoticeTriggerService.sendNoticeEx("", phone, noticeId, "head_merchant", label);
    if (jResult.state != 'ok') {
        ret.code = "110";
        ret.msg = jResult.msg;
        out.print(JSON.stringify(ret));
        return;
    }

    SessionService.addSessionValue("phoneValidatePhone", phone, request, response);
    SessionService.addSessionValue(sessionKey, randomCode + "-" + nowTime, request, response);

    ret.code = "0";
    out.print(JSON.stringify(ret));
})();
