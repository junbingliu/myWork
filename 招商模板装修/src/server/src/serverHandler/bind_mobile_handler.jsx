//#import Util.js
//#import login.js
//#import NoticeTrigger.js
//#import session.js
//#import DigestUtil.js
//#import pageService.js
//#import sysArgument.js
//#import DateUtil.js


;(function() {

    var selfApi = new JavaImporter(
        Packages.java.lang,
        Packages.java.net,
        Packages.java.util,
        Packages.java.text,
        Packages.net.xinshi.isone.modules,
        Packages.org.json,
        Packages.net.xinshi.isone.modules.businessruleEx,
        Packages.net.xinshi.isone.modules.businessruleEx.rule.bean,
        Packages.net.xinshi.isone.modules.user,
        Packages.net.xinshi.isone.functions.user,
        Packages.net.xinshi.isone.commons
    );

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
            ret.msg="用户未登录";
            out.print(JSON.stringify(ret));
            return;

        }


        var mobile = $.params.mobile;
        if(!mobile || mobile == ""){
            ret.state = "mobile_empty";
            out.print(JSON.stringify(ret));
            return;
        }

        var paramCode = $.params.code;
        if(!paramCode || paramCode == ""){
            ret.state = "code_empty";
            out.print(JSON.stringify(ret));
            return;
        }

        var userLoginId = user.loginId;
        var userId = user.id;

        var vMobileInfo = null;
        if(user.validateObj && user.validateObj.mobile){
            vMobileInfo = user.validateObj.mobile;
        }
        if(!vMobileInfo){
            ret.state = "link_invalid";//无效的
            out.print(JSON.stringify(ret));
            return;
        }

        var intervalTime = 100;//秒
        var validateCode = vMobileInfo.validateCode;
        if(!validateCode || validateCode == ""){
            ret.state = "validateCode_not_exist";
            out.print(JSON.stringify(ret));
            return;
        }
        if(paramCode != validateCode){
            ret.state = "validateCode_error";
            out.print(JSON.stringify(ret));
            return;
        }


        var userMobile = user.mobilPhone;
        if (mobile == userMobile) {
            var isValidate = user.checkedphoneStatus;
            if(isValidate == "1"){
                //当修改的邮箱和原来一样，并且是已经激活过的
                ret.state = "mobile_not_change";
                out.print(JSON.stringify(ret));
                return;
            }
        }else{
            var checkResult = LoginService.judgeMemberField(mobile);
            if (checkResult && checkResult != "null") {
                ret.state = "mobile_exist";
                out.print(JSON.stringify(ret));
                return;
            }
        }


        if(vMobileInfo.changeMobile == user.mobilPhone && user.checkedphoneStatus == "1"){
            ret.state = "has_verified";
            out.print(JSON.stringify(ret));
            return;
        }


        var relUserId = selfApi.IsoneModulesEngine.memberService.judgeMemberField(mobile);

        var hasCheckPhone = false; //当前用户是否已经验证过手机
        var hasOtherCheckPhone = false;    //当前手机关联的其他用户是否已经验证过手机
        if(user.checkedphoneStatus == "1"){
            hasCheckPhone = true;
        }
        if (userId != relUserId) {
            var jOtherUser = selfApi.MemberFunction.getUser(relUserId);
            if(jOtherUser != null){
                if(user.checkedphoneStatus == "1"){
                    hasOtherCheckPhone = true;
                }
            }
        }

        var oldMobilePhone = user.mobilPhone;
        user.mobilPhone = vMobileInfo.changeMobile;
        user.checkedphoneStatus = "1";

        var date = new selfApi.Date();
        var objSDF = new selfApi.SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        user["lastModifiedTime"] = objSDF.format(date) + "";

        var javaUserJson = $.toJavaJSONObject(user);
        selfApi.IsoneModulesEngine.memberService.addMemberField(user.mobilPhone, userId); //增加唯一的手机号码
        selfApi.IsoneModulesEngine.memberService.updateUser(javaUserJson, userId);

        if(oldMobilePhone){
            selfApi.IsoneModulesEngine.memberService.removeMemberField(oldMobilePhone); //去掉旧手机唯一标记
        }

        //如果已经激活过一次手机的就不再执行赠送规则了
        var recommendedUserId = user["recommendedUserId"];
        if(!recommendedUserId){
            recommendedUserId = "";
        }
        if (!hasCheckPhone && !hasOtherCheckPhone) {
            //执行注册奖励规则
            selfApi.IsoneBusinessRuleEngineEx.registerPlanExecutor.executePlan(selfApi.Global.HEAD_MERCHANT, userId, selfApi.Behavior.email_activation);
            //执行推荐会员奖励规则
            selfApi.IsoneBusinessRuleEngineEx.recommendMemberPlanExecutor.executePlan(selfApi.Global.HEAD_MERCHANT, recommendedUserId, userId, selfApi.Behavior.email_activation);
        }





        var isExists = InternalMemberRegisterService.getById(user.mobilPhone);
        if(isExists && isExists != "null"){
            //内部员工手机
            var validatePageData = pageService.getMerchantPageData("head_merchant","ewj_login","registerEmailValidate");
            var memberGroupId = null;
            if(validatePageData.config && validatePageData.config.employeeMemberGroupId && validatePageData.config.employeeMemberGroupId.value != ""){
                memberGroupId = validatePageData.config.employeeMemberGroupId.value;
            }

            if(memberGroupId){
                //内部员工，加入特定组
                selfApi.IsoneModulesEngine.memberService.addUserToGroup(userId,memberGroupId,new Date().getTime(),4102415999000);
            }else{
                $.log("employeeMemberGroupId_not_config")
            }
        }




        //ret.loginId = userLoginId;
        ret.mobile = user.mobilPhone;
        ret.state = "ok";
        ret.msg = "";
    }catch (e){
        $.log(e);
        ret.state = "system_error";
        ret.msg = "系统错误";
    }
    out.print(JSON.stringify(ret));
})();