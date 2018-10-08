

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



;(function () {

    var errorCode = "";
    var needCaptcha = false;
    var ret = {
        state: false,
        errorCode: errorCode
    }


    var password = $.params.password;  //登录密码
    var mobilePhone = $.params.mobilePhone;  //手机
    var captcha = $.params.captcha;    //验证码


    if(!(mobilePhone)){
        errorCode = "mobile_phone_empty";
        ret.errorCode =errorCode;
        out.print(JSON.stringify(ret));
        return;
    }else if (mobilePhone) {
        var mobileRegex = new RegExp(SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "regex_Mobile"));
        if (!mobileRegex.test(mobilePhone)) {
            errorCode = "mobile_error";
            ret.errorCode =errorCode;
            out.print(JSON.stringify(ret));
            return;
        }
    }

    var checkResult = LoginService.judgeMemberField(mobile);
    if (!checkResult || checkResult == "null") {

        ret.state = "mobile_phone_notexist";
        ret.errorCode = "mobile_phone_notexist";
        out.print(JSON.stringify(ret));
        return;
    }



    var sessionCaptcha = SessionService.getSessionValue("ValidateCode", request);
    SessionService.removeSessionValue("ValidateCode");


    var appId = $.params.appId;
    var pageId = $.params.pageId;
    var mid = $.params.mid;
    var pageData = pageService.getMerchantPageData(mid,appId,pageId);

    if(mobilePhone) {
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

                if(pageData && pageData.config && pageData.config.validTimeMobile && pageData.config.validTimeMobile.value != ""){
                    var vTime = Number(pageData.config.validTimeMobile.value);
                    if(!isNaN(vTime)){
                        validTime = vTime;
                    }
                }

                var mobileCaptchaObj,validateCode;
                var sessionValue = SessionService.getSessionValue("mobileCaptchaObj", request);
                if(sessionValue){
                    mobileCaptchaObj = JSON.parse(sessionValue);
                    validateCode = mobileCaptchaObj[mobilePhone]
                }
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
    if(true){
        //判断输入密码的类型
        function CharMode(iN){
            if (iN>=48 && iN <=57) //数字
                return 1;
            if (iN>=65 && iN <=90) //大写
                return 2;
            if (iN>=97 && iN <=122) //小写
                return 4;
            else
                return 8;
        }
        //bitTotal函数
        //计算密码模式
        function bitTotal(num){
            var modes=0;
            for (i=0;i<4;i++){
                if (num & 1) modes++;
                num>>>=1;
            }
            return modes;
        }
        //返回强度级别
        function checkStrong(sPW){
            if (sPW.length<6)
                return 0; //密码太短，不检测级别
            var Modes=0;
            for (var i=0;i<sPW.length;i++){
                //密码模式
                Modes|=CharMode(sPW.charCodeAt(i));
            }
            return bitTotal(Modes);
        }

        var s_level = checkStrong("4564122");
        switch(s_level) {
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




    var javaUserJson = $.toJavaJSONObject(jUser);
    var userId = UserApi.IsoneModulesEngine.memberService.addUser(javaUserJson, null);

    var User =UserService.getUser(userId);

    if (User.loginId) {
        loginId = User.loginId;
    }else{
        loginId = null;
    }





    if(jUser["isEnable"] == "1"){
        UserApi.LoginSessionUtils.loginFrontend(request, response, userId);
    }

    //if(checkPerson){
    //    //当验证通过，把证件号绑定帐号，可以通过证件号进行登录
    //    UserApi.IsoneModulesEngine.memberService.addMemberField(identification, userId);
    //}

    var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl")
    var registerFunc = new RegisterFunc();
    var parentUserId = "";
    var jConfig = {
        isNeedVerifyEmail:true,
        webUrl:webUrl
    };
    //注册成功后事件
    registerFunc.doAddUserAfterEvent(userId, parentUserId, jConfig);



    ret.state = true;
    errorCode = "";
    ret.errorCode = errorCode;
    out.print(JSON.stringify(ret));

})();
