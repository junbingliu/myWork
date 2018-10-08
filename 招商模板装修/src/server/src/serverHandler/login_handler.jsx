//#import pigeon.js
//#import Util.js
//#import login.js
//#import user.js
//#import session.js
//#import $hdHouseHandlerGuide:tools/hdHouseHolderUtil.jsx
//#import $globalUserCacheStore:services/GlobalUserCacheStoreService.jsx
(function () {

    var ret = {};
    try {
        var mobile = $.params.mobile;
        var password = $.params.password;
        var vCode = $.params.validateCode;

        if(!mobile || mobile == ""){
            ret.state = "noMobile";
            out.print(JSON.stringify(ret));
            return;
        }
        if(!password || password == ""){
            ret.state = "noPassword";
            out.print(JSON.stringify(ret));
            return;
        }

        //var sessionVCode = SessionService.getSessionValue("ValidateCode", request);
        /* if(vCode!=sessionVCode){
         var r = {
         state:"err",
         code : "vcode",
         msg: "验证码错误"
         }
         out.print(JSON.stringify(r));
         return;
         }*/
        var lResult = LoginService.loginFrontend(mobile, password);
        if (!lResult.state) {
            ret.state = "noMatch";
            out.print(JSON.stringify(ret));
            return;
        }
        LoginService.setKeepLoginTime(7*24*3600*1000);
        var userId = lResult.userId + "";

        var fangXingCode =  GlobalUserCacheStoreService.getValueByKey(userId, "selectFangXingId");
        if (!fangXingCode) {
            fangXingCode = "";
        }

        var user = UserService.getUser(userId);

        var userMobile = user.mobilPhone;
        var identification = user.identityNumber;
        if (userMobile && identification) {
            //当登录用户存在手机号码和身份证信息，则登录后对接刷新地址本和设置为业主会员
            var checkParams = {};
            checkParams.userId = userId;
            checkParams.mobilePhone = userMobile;
            checkParams.certificateNum = identification;
            hdHouseHolderUtil.checkData(checkParams);
        }

        var isOwner = UserService.checkMemberGroup(user.id, "c_111");

        ret.state = "ok";
        ret.userId = userId;
        ret.isOwner = isOwner;
        ret.fangXingCode = fangXingCode;
        ret.userName = user.realName || user.loginId || user.mobilPhone || user.id || "";
        out.print(JSON.stringify(ret));
    } catch (e) {
        ret.state = "err";
        ret.msg = "登录出现异常，异常信息为："+e;
        out.print(JSON.stringify(ret));
    }
})();

