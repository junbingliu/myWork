//#import Util.js
//#import user.js
//#import login.js
//#import session.js
//#import DigestUtil.js
//#import json2.js
//#import address.js
//#import search.js
//#import NoticeTrigger.js
//#import DateUtil.js
//#import pageService.js
//#import sysArgument.js
//#import $globalSysArgsSetting:services/GlobalSysArgsService.jsx


var curApi = new JavaImporter(
    Packages.java.lang,
    Packages.java.net,
    Packages.net.xinshi.isone.modules,
    Packages.net.xinshi.isone.modules.openapi,
    Packages.net.xinshi.isone.modules.user,
    Packages.net.xinshi.isone.functions.user,
    Packages.org.json,
    Packages.net.xinshi.isone.modules.businessruleEx.rule.bean,
    Packages.net.xinshi.isone.commons
);
var RegisterFunc = function () {

    this.doAddUserAfterEvent = function (userId, parentUserId, config) {
        var webUrl = config["webUrl"];
        var isNeedVerifyEmail = config["isNeedVerifyEmail"];
        var ismobile = config["ismobile"];
        var isAppMulMerchant = config["isAppMulMerchant"] || true;
        var user = UserService.getUser(userId);
        var merchantId = curApi.HEAD_MERCHANT;
        if (!isAppMulMerchant) {
            merchantId = curApi.SINGLE_DEFAULT_MERCHANT;
        }
        //var appId = config["appId"];
        //var isEmployee = config["isEmployee"];

        //执行注册奖励规则
        LoginApi.IsoneBusinessRuleEngineEx.registerPlanExecutor.executePlan(curApi.Global.HEAD_MERCHANT, userId, curApi.Behavior.register);
        if (parentUserId) {
            var parentUser = UserService.getUser(parentUserId);
            var recommendedUserId = parentUser["id"];
            LoginApi.IsoneBusinessRuleEngineEx.recommendMemberPlanExecutor.executePlan(curApi.Global.HEAD_MERCHANT, recommendedUserId, userId, curApi.Behavior.register);

        }

        //手机注册并且短信验证成功的
        var checkedphoneStatus = user["checkedphoneStatus"];
        if (checkedphoneStatus == "1") {
            //执行注册奖励规则
            LoginApi.IsoneBusinessRuleEngineEx.registerPlanExecutor.executePlan(curApi.Global.HEAD_MERCHANT, userId, curApi.Behavior.sms_activation);
            //执行推荐会员奖励规则
            var recommendedUserId = user["recommendedUserId"];
            LoginApi.IsoneBusinessRuleEngineEx.recommendMemberPlanExecutor.executePlan(curApi.Global.HEAD_MERCHANT, recommendedUserId, userId, curApi.Behavior.sms_activation);
        }

        var mobilPhone = user.mobilPhone;
        var email = user.email;
        var currentTime = new Date().getTime();
        if (isNeedVerifyEmail && !ismobile && email) {
            //发送激活邮件
            try {
                var jUserLogin = $.toJavaJSONObject(user);
                var validateRandom = Math.random() + "";
                var params = "mobilPhone=" + mobilPhone + "&email=" + email + "&random=" + validateRandom;
                var validateCode = DigestUtil.digestString(params, "SHA");
                validateCode = Packages.net.xinshi.isone.commons.Base64Coder.encode(validateCode, "utf-8") + "";
                validateCode = curApi.URLEncoder.encode(validateCode, "UTF-8");
                //jUserLogin.put("validateCode", validateCode);
                jUserLogin.put("validateRandom", validateRandom);
                jUserLogin.put("checkedemailStatus", "0"); //设置邮箱未激活
                jUserLogin.put("validateTime", currentTime + "");  //设置发送时间，一遍过期。
                curApi.IsoneModulesEngine.memberService.updateUser(jUserLogin, userId);

                var date = DateUtil.getLongDate(currentTime);
                var jLabel = new curApi.JSONObject();
                jLabel.put("\\[user:name\\]", "<b>" + mobilPhone + "</b>");
                jLabel.put("\\[user:time\\]", "<i>" + date + "</i>");
                var validateUrl = webUrl + "/register_email_validate.html?code=" + validateCode + "&email=" + email;
                jLabel.put("\\[validateInfo\\]", validateUrl);

                //if(isEmployee){
                curApi.IsoneModulesEngine.noticeTrigger.sendNotice(userId, email, "notice_55000", merchantId, jLabel);
                //}else{
                //    curApi.IsoneModulesEngine.noticeTrigger.sendNotice(userId, email, "notice_50500", merchantId, jLabel);
                //}

            } catch (e) {
                $.log(e);
            }
        } else {
            //发送注册成功邮件
            var date = DateUtil.getLongDate(currentTime);
            var jLabel = new curApi.JSONObject();
            jLabel.put("\\[user:name\\]", mobilPhone);
            jLabel.put("\\[user:time\\]", date);
            curApi.IsoneModulesEngine.noticeTrigger.sendNotice(userId, "notice_50500", merchantId, jLabel);
        }
    }


};

(function () {
    var errorCode = "";
    var needCaptcha = false;
    var ret = {
        state: false,
        errorCode: errorCode
    }

    var loginId = $.params.loginId;    //loginId
    var password = $.params.password;  //登录密码
    var mobilePhone = $.params.mobilePhone;  //手机
    var parentId = $.params.parentId || "";  //推荐人
    var rurl = $.params.returnUrl;
    var hasCheckMobilePhone = false;
    var isRegisterPhoneValidate = true;

    if (!loginId) {
        errorCode = "empty_loginId";
    } else if (!/^[a-zA-Z]([a-zA-Z0-9(_)(\-)]+)$/.test(loginId)) {
        errorCode = "loginId_unlawful";
    } else if (!(loginId.length > 3 && loginId.length < 21)) {
        errorCode = "loginId_length_error";
    } else if (!(mobilePhone)) {
        errorCode = "mobile_phone_empty";
    } else if (mobilePhone) {
        var mobileRegex = new RegExp(SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "regex_Mobile"));
        if (!mobileRegex.test(mobilePhone)) {
            errorCode = "mobile_error";
        }
    } else if (!password) {
        errorCode = "empty_password";
    } else if (needCaptcha && !captcha) {
        errorCode = "empty_captcha";
    }

    if (errorCode != "") {
        ret.errorCode = errorCode;
        out.print(JSON.stringify(ret));
        return;
    }

    //var sessionCaptcha = SessionService.getSessionValue("ValidateCode", request);
    //SessionService.removeSessionValue("ValidateCode");

    //特殊验证码，压力测试用
    //var specialCaptcha = "111111", specialCaptcha2 = "888888";

    var result = LoginService.judgeMemberField(loginId);
    if (result && result != "null") {
        ret.errorCode = "loginId_exist";
        out.print(JSON.stringify(ret));
        return;
    }

    var appId = $.params.appId;
    var pageId = $.params.pageId;

    var mobileCaptchaSessionName = "mobileCaptchaObj";
    if (mobilePhone) {
        result = LoginService.judgeMemberField(mobilePhone);
        if (result == "-1" || (result && result != "null")) {
            ret.errorCode = "mobilePhone_exist";
            out.print(JSON.stringify(ret));
            return;
        }

        //验证手机
        if (isRegisterPhoneValidate) {
            var mobileValidateNot = false;//$.params.mobileValidate_not;
            if (!mobileValidateNot || mobileValidateNot == "0") {
                var mobileValidateCode = $.params.mobileValidateCode;
                if (!mobileValidateCode) {
                    ret.errorCode = "mobile_validate_code_empty";
                    out.print(JSON.stringify(ret));
                    return;
                }

                var validTime = 5;//分钟，短信验证码有效时间

                var sessionValue = SessionService.getSessionValue(mobileCaptchaSessionName, request);
                if (!sessionValue) {
                    ret.errorCode = "phone_validate_code_empty";
                    out.print(JSON.stringify(ret));
                    return;
                }
                var mobileCaptchaObj = JSON.parse(sessionValue);
                $.log(mobileCaptchaObj["captcha"])
                var timeOut = validTime * 60 * 1000;
                var currTime = new Date().getTime();
                if (currTime - mobileCaptchaObj["lastTime"] >= timeOut) {
                    //超时
                    ret.errorCode = "phone_validate_code_overdue";
                    out.print(JSON.stringify(ret));
                    return;
                }

                if (mobileCaptchaObj["captcha"] != mobileValidateCode) {
                    //验证码错误
                    ret.errorCode = "phone_validate_code_error";
                    out.print(JSON.stringify(ret));
                    return;
                }

                if (mobileCaptchaObj["mobile"] != mobilePhone) {
                    //注册手机和短信验证手机不一致
                    ret.errorCode = "mobilePhone_error";
                    out.print(JSON.stringify(ret));
                    return;
                }
                hasCheckMobilePhone = true;
            }
        }
    }

    if (errorCode != "") {
        ret.errorCode = errorCode;
        out.print(JSON.stringify(ret));
        return;
    }

    var baseGrade = 20;
    //判断密码强度，判断安全分数
    if (true) {
        //判断输入密码的类型
        function CharMode(iN) {
            if (iN >= 48 && iN <= 57) //数字
                return 1;
            if (iN >= 65 && iN <= 90) //大写
                return 2;
            if (iN >= 97 && iN <= 122) //小写
                return 4;
            else
                return 8;
        }

        //bitTotal函数
        //计算密码模式
        function bitTotal(num) {
            var modes = 0;
            for (i = 0; i < 4; i++) {
                if (num & 1) modes++;
                num >>>= 1;
            }
            return modes;
        }

        //返回强度级别
        function checkStrong(sPW) {
            if (sPW.length < 6)
                return 0; //密码太短，不检测级别
            var Modes = 0;
            for (var i = 0; i < sPW.length; i++) {
                //密码模式
                Modes |= CharMode(sPW.charCodeAt(i));
            }
            return bitTotal(Modes);
        }

        var s_level = checkStrong("4564122");
        switch (s_level) {
            case 0:
            case 1:
                baseGrade = 20;
                break;
            case 2:
                baseGrade = 40;
                break;
            default:
                baseGrade = 60;
                break;
        }
    }

    var jParentUser;
    if(parentId){
        if (startWith(parentId, "u_")) {
            jParentUser = UserService.getUser(parentId);
        } else {
            jParentUser = UserService.getUserByKey(parentId);
        }
        if (!jParentUser) {
            ret.errorCode = "parentUser_notExist";
            out.print(JSON.stringify(ret));
            return;
        }
        parentId = jParentUser.id;
    }

    var lotteryUrl = "";
    var jArgs = GlobalSysArgsService.getArgs();
    if (jArgs) {
        if (jArgs.lotteryUrl) lotteryUrl = jArgs.lotteryUrl;
    }

    var source = "sys";
    var source_entrance = "default";
    var ran = Math.random() + "";
    var passran = password + ran;
    var passwordsha = DigestUtil.digestString(passran, "SHA");

    var jUser = {};
    jUser["loginId"] = loginId;
    jUser["passwordhash"] = passwordsha;
    jUser["random"] = ran;
    jUser["isAdmin"] = "0";
    jUser["merchantId"] = "";
    jUser["logo"] = "/upload/user_none_100.gif";
    jUser["parentId"] = parentId;
    jUser["source_isOnline"] = "1";//是否线上
    jUser["source"] = source;//来源
    jUser["source_entrance"] = source_entrance;//来源入口
    jUser["ip"] = $.getClientIp();
    jUser["userCardBindStatus"] = "0";
    jUser["isEnable"] = "1";//1表示激活
    jUser["grade"] = baseGrade + "";//安全等级分数

    jUser["checkedemailStatus"] = "0";

    var checkedphoneStatus = "0";
    if (mobilePhone) {
        jUser["mobilPhone"] = mobilePhone;
        if (hasCheckMobilePhone) {
            checkedphoneStatus = "1";
        }
    }
    jUser["checkedphoneStatus"] = checkedphoneStatus;
    var javaUserJson = $.toJavaJSONObject(jUser);
    var userId = UserApi.IsoneModulesEngine.memberService.addUser(javaUserJson, null);
    SessionService.removeSessionValue(mobileCaptchaSessionName);

    var User = UserService.getUser(userId);

    if (User.loginId) {
        loginId = User.loginId;
    } else {
        loginId = null;
    }

    //默认设置为普通会员
    var level = UserApi.IUserService.MEMBERGROUP_COMMON;
    UserApi.IsoneModulesEngine.memberService.updateMemberGroup(javaUserJson, UserApi.IUserService.MEMBERGROUP_TYPE_ONE, level);

    if (loginId) {
        UserApi.IsoneModulesEngine.memberService.addMemberField(loginId, userId);//增加唯一的登录账号
    }

    if (hasCheckMobilePhone) {
        //当手机验证通过，把手机绑定帐号，可以通过手机进行登录
        UserApi.IsoneModulesEngine.memberService.addMemberField(mobilePhone, userId);
    }

    if (jUser["isEnable"] == "1") {
        UserApi.LoginSessionUtils.loginFrontend(request, response, userId);
    }

    var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl") + "";
    var registerFunc = new RegisterFunc();
    var jConfig = {
        isNeedVerifyEmail: true,
        webUrl: webUrl
    };
    //注册成功后事件
    registerFunc.doAddUserAfterEvent(userId, parentId, jConfig);

    ret.state = true;
    errorCode = "";
    ret.errorCode = errorCode;
    ret.rurl = lotteryUrl;
    out.print(JSON.stringify(ret));
})();

function startWith(s1, s2) {
    if (s2 == null || s2 == "" || s1.length == 0 || s2.length > s1.length) {
        return false;
    }
    return s1.substr(0, s2.length) == s2
}