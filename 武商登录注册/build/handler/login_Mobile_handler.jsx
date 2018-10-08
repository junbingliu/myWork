//#import Util.js
//#import login.js
//#import user.js
//#import session.js
//#import $globalUserCacheStore:services/GlobalUserCacheStoreService.jsx

(function () {

    var ret = {};
    ret.state = false;
    try {
        var mobile = $.params.phone2;
        var mobileValidateCode = $.params.mobileValidateCode;
        if (!mobile || mobile == "") {
            ret.code = "101";
            ret.msg = "参数错误";
            out.print(JSON.stringify(ret));
            return;
        }
        if (!mobileValidateCode || mobileValidateCode == "") {
            ret.code = "102";
            ret.msg = "参数错误";
            out.print(JSON.stringify(ret));
            return;
        }

        var nowTime = new Date().getTime();
        var phoneValidateCode = SessionService.getSessionValue("phoneValidateCode", request);
        if (!phoneValidateCode) {
            ret.code = "103";
            ret.msg = "验证码错误";
            out.print(JSON.stringify(ret));
            return;
        }

        var array = phoneValidateCode.split("-");
        if (array.length != 2) {
            ret.code = "104";
            ret.msg = "验证码错误";
            out.print(JSON.stringify(ret));
            return;
        }

        var randomCode = array[0];
        var sendTime = array[1];
        if (Number(sendTime) + (5 * 60 * 1000) < nowTime) {
            //5分钟内有效
            ret.code = "105";
            ret.msg = "验证码已失效，请重新发送";
            out.print(JSON.stringify(ret));
            return;
        }

        if (randomCode != mobileValidateCode) {
            ret.code = "106";
            ret.msg = "验证码错误";
            out.print(JSON.stringify(ret));
            return;
        }

        var phoneValidatePhone = SessionService.getSessionValue("phoneValidatePhone", request);
        if (mobile != phoneValidatePhone) {
            ret.code = "107";
            ret.msg = "手机号码不是接收短信的手机号";
            out.print(JSON.stringify(ret));
            return;
        }


        var userId = null;
        var passwordhash = null;
        var jUser = UserService.getUserByKey(mobile);

        if (!jUser) {
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
            jUser = {};
            jUser.defaultEnableState = "1";//1表示激活
            jUser.mobile = mobile;
            jUser.source_isOnline = "1";//是否线上
            jUser.source = "sys";
            jUser.source_entrance = "default";
            var jAddResult = UserService.addUser(jUser, '', jConfig);
            if (jAddResult.code != "0") {
                ret.code = "110";
                ret.msg = "登录出现异常，请稍后再试";
                out.print(JSON.stringify(ret));
                return;
            }

            userId = jAddResult.userId;
            if (jAddResult) {
                passwordhash=jAddResult.passwordhash
            }
        }else{
            userId = jUser.id;
            if (jUser) {
                passwordhash=jUser.passwordhash
            }
        }

        SessionService.removeSessionValue("phoneValidateCode");
        SessionService.removeSessionValue("phoneValidatePhone");
        //添加一个可以直接修改密码的标记
        SessionService.addSessionValue("directChangePassword", mobile + "-" + nowTime, request, response);
        UserApi.LoginSessionUtils.loginFrontend(request, response, userId);
        var userHasClickSetPassword = GlobalUserCacheStoreService.getValueByKey(userId, "userHasClickSetPassword");
        var isNeedShowWin = "0";
        if(!passwordhash && userHasClickSetPassword != "1"){
            isNeedShowWin = "1";
        }

        ret.code = "0";
        ret.isNeedShowWin = isNeedShowWin;
        out.print(JSON.stringify(ret));
    } catch (e) {
        ret.code = "99";
        ret.msg = "登录出现异常，请稍后再试";
        out.print(JSON.stringify(ret));
    }
})();


