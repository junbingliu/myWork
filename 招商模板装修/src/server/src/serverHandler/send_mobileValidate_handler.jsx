//#import Util.js
//#import login.js
//#import NoticeTrigger.js
//#import DigestUtil.js
//#import sysArgument.js
//#import DateUtil.js

;(function() {
    var ret = {
        state:"",
        msg:""
    };
    try{

        var userId = "";
        var user = LoginService.getFrontendUser();
        if(user){
            userId = user.id;
        }else{
            ret.state = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }


        var mobile = $.params.mobile;
        if(!mobile || mobile == ""){
            ret.state = "mobile_empty";
            out.print(JSON.stringify(ret));
            return;
        }


        var userMobile = user.mobilPhone;
        if (mobile == userMobile) {
            var isValidate = user.checkedphoneStatus;
            if(isValidate == "1"){
                //当修改的邮箱和原来一样，并且是已经激活过的
                ret.state = "mobile_not_change";
                ret.msg="当前手机已验证，不需要重复验证。";
                out.print(JSON.stringify(ret));
                return;
            }
        }else{
            var checkResult = LoginService.judgeMemberField(mobile);
            if (checkResult && checkResult != "null") {
                ret.state = "mobile_exist";
                ret.msg = "对不起，此手机已注册。";
                out.print(JSON.stringify(ret));
                return;
            }
        }

        var userLoginId = user.loginId;
        var userId = user.id;

        var validTime = 30;//分钟,失效时间
        var maxTimes = 5;//每日最大次数

        var validateObj = user.validateObj;
        if(validateObj){
            if(!validateObj.mobile){
                validateObj.mobile = {};
            }
        }else{
            validateObj = {
                email:{},
                mobile:{}
            };
        }

        var intervalTime = 120;//秒
        var lastTime = validateObj.mobile.lastSentTime;
        if(lastTime){
            var remainingTime = (new Date().getTime()) - lastTime;
            if(remainingTime <= intervalTime * 1000){
                ret.state = "please_wait";
                ret.msg = "您的验证码还在有效期，请不要重复验证。";
                //ret.remainingTime = remainingTime / 1000; //秒
                out.print(JSON.stringify(ret));
                return;
            }
        }

        var validateCode = function(){
            var num = "";
            for(var i=0;i<6;i++){
                num += Math.floor(Math.random() * 10);
            }
            return num;
        }();
        //var params = "loginId=" + userLoginId + "&mobilPhone=" + mobile + "&validateCode=" + validateCode;
        //var digestCode = DigestUtil.digestString(params, "SHA");

        validateObj.mobile.validateCode = validateCode;
        validateObj.mobile.lastSentTime = new Date().getTime();
        validateObj.mobile.validTime = validTime;
        validateObj.mobile.changeMobile = mobile;

        user.validateObj = validateObj;

        //
        var webName = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webName_cn");

        var jLabel = new NoticeTriggerApi.JSONObject();
        jLabel.put("\\[user:name\\]", userLoginId);
        jLabel.put("\\[validateInfo\\]", validateCode);
        jLabel.put("\\[sys:webname\\]", webName);
        NoticeTriggerApi.IsoneModulesEngine.noticeTrigger.sendNotice(userId, mobile, "notice_50100", "head_merchant", jLabel);

        LoginApi.IsoneModulesEngine.memberService.updateUser($.toJavaJSONObject(user), userId);
        ret.state = "ok";
        ret.validTime = validTime;
    }catch (e){
        $.log(e);
        ret.state = "system_error";
        ret.msg = "系统繁忙，请稍后再试";
    }
    out.print(JSON.stringify(ret));
})();