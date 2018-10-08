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
//#import $PersonBase:services/PersonService.jsx
//#import $hdHouseHandlerGuide:tools/hdHouseHolderUtil.jsx
//#import $hdCommonPassKey:services/hdCommonPassKeyService.jsx

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

        var mobilePhone = user.mobilePhone;
        var email = user.email;
        var currentTime = new Date().getTime();
        if (isNeedVerifyEmail && !ismobile && email) {
            //发送激活邮件
            try {
                var jUserLogin = $.toJavaJSONObject(user);
                var validateRandom = Math.random() + "";
                var params = "mobilePhone=" + mobilePhone + "&email=" + email + "&random=" + validateRandom;
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
                jLabel.put("\\[user:name\\]", "<b>" + mobilePhone + "</b>");
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
            jLabel.put("\\[user:name\\]", mobilePhone);
            jLabel.put("\\[user:time\\]", date);
            curApi.IsoneModulesEngine.noticeTrigger.sendNotice(userId, "notice_50500", merchantId, jLabel);
        }
    }


};


;(function () {

    var errorCode = "";
    var needCaptcha = false;
    var ret = {
        state: false,
        errorCode: errorCode
    };
    try {
        //var loginId = $.params.loginId;    //loginId
        var parentId = $.params.userId;//推荐人Id
        var password = $.params.password;  //登录密码
        var mobilePhone = $.params.mobilePhone;  //手机
        var captcha = $.params.captcha;    //验证码
        var identification = $.params.identification;    //证件号
        //var identificationType = $.params.identificationType;    //证件类型
        var rurl = $.params.returnUrl;
        var hasCheckMobilePhone = false;
        var isRegisterPhoneValidate = true;

        if (!mobilePhone) {
            ret.errorCode = "mobile_phone_empty";
            out.print(JSON.stringify(ret));
            return;
        }

        var mobileRegex = new RegExp(SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "regex_Mobile"));
        if (!mobileRegex.test(mobilePhone)) {
            ret.errorCode = "mobile_error";
            out.print(JSON.stringify(ret));
            return;
        }

        if (!password) {
            ret.errorCode = "empty_password";
            out.print(JSON.stringify(ret));
            return;
        }

        if (needCaptcha && !captcha) {
            ret.errorCode = "empty_captcha";
            out.print(JSON.stringify(ret));
            return;
        }

        if (!identification) {
            ret.errorCode = "empty_identification";
            out.print(JSON.stringify(ret));
            return;
        }

        //if (!identificationType && identificationType == "") {
        //    ret.errorCode = "empty_identificationType";
        //}

        var appId = $.params.appId;
        var pageId = $.params.pageId;
        var mid = $.params.mid;
        var pageData = pageService.getMerchantPageData(mid, appId, pageId);

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

                    if (pageData && pageData.config && pageData.config.validTimeMobile && pageData.config.validTimeMobile.value != "") {
                        var vTime = Number(pageData.config.validTimeMobile.value);
                        if (!isNaN(vTime)) {
                            validTime = vTime;
                        }
                    }

                    //获取万用验证码
                    var nniversal_code = HdCommonPassKeyService.getArgValueByKey("nniversal_code");


                    var mobileCaptchaObj, validateCode;
                    var sessionValue = SessionService.getSessionValue("mobileCaptchaObj", request);
                    if (sessionValue) {
                        mobileCaptchaObj = JSON.parse(sessionValue);
                        validateCode = mobileCaptchaObj[mobilePhone]
                    }

                    if(nniversal_code&&mobileValidateCode!=nniversal_code) {
                        if (!validateCode) {
                            ret.errorCode = "phone_validate_code_empty";
                            out.print(JSON.stringify(ret));
                            return;
                        }
                        var timeOut = validTime * 60 * 1000;
                        var currTime = new Date().getTime();
                        if (currTime - validateCode["lastTime"] >= timeOut) {
                            //超时
                            ret.errorCode = "phone_validate_code_overdue";
                            out.print(JSON.stringify(ret));
                            return;
                        }

                        if (validateCode["captcha"] != mobileValidateCode) {
                            //验证码错误
                            ret.errorCode = "phone_validate_code_error";
                            out.print(JSON.stringify(ret));
                            return;
                        }
                    }
                    hasCheckMobilePhone = true;
                }
            }
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

        var checkParams = {};
        checkParams.mobilePhone = mobilePhone;
        checkParams.certificateNum = identification;
        var checkResult = hdHouseHolderUtil.checkData(checkParams);
        if(checkResult.state != "true"){
            ret.errorCode = "no_owner";
            ret.msg = checkResult.msg;
            out.print(JSON.stringify(ret));
            return;
        }


        var jConfig = {
            isEnable: "1",
            isEnableNullLoginId: true,
            isCheckLoginId: false,
            isCheckEmail: false,
            isCheckMobile: true,
            hasValidateMobile: true,//手机号码是否默认为已验证
            isImportCreateTime: false,
            isRelevanceMobile: true//是否关联手机号码
        };
        var jUser = {};
        jUser.defaultEnableState = "1";//1表示激活
        jUser.mobile = mobilePhone;
        jUser.password = password;
        jUser.source_isOnline = "1";//是否线上
        jUser.source = "phone";
        jUser.source_entrance = "default";
        jUser["parentId"] = parentId;
        jUser["ip"] = $.getClientIp();
        jUser["grade"] = baseGrade + "";//安全等级分数
        jUser["identityNumber"] = identification + "";//证件号
        jUser["identityType"] =  "身份证";//证件类型
        var jResult = UserService.addUser(jUser, '', jConfig);

        if (jResult.code != "0") {
            ret.errorCode = "send_error";
            ret.msg = jResult.msg;
            out.print(JSON.stringify(ret));
            return;
        }else{
            var userId = jResult.userId;

            UserApi.LoginSessionUtils.loginFrontend(request, response, userId);
            //登录后对接刷新地址本
            checkParams.userId = userId;
            checkParams.mobilePhone = mobilePhone;
            checkParams.certificateNum = identification;
            hdHouseHolderUtil.checkData(checkParams);

            var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrl");
            var registerFunc = new RegisterFunc();
            var parentUserId = "";
            var jConfig = {
                isNeedVerifyEmail: true,
                webUrl: webUrl
            };
            //注册成功后事件
            registerFunc.doAddUserAfterEvent(userId, parentUserId, jConfig);

            ret.userId = userId;
            ret.state = true;
            out.print(JSON.stringify(ret));
        }


    } catch (e) {
        var data={
            state:false,
            errorCode:"send_error",
            msg:"错误报告："+e
        };
        out.print(JSON.stringify(data));
    }

})();
function getIdentityTypeIdByName(name) {
    if (name == "身份证") {
        return "0";
    } else if (name == "军官证") {
        return "1";
    } else if (name == "驾驶证") {
        return "2";
    } else if (name == "护照") {
        return "3";
    } else if (name == "港澳通行证") {
        return "4";
    }

    return "-1";
}