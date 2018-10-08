//#import ps20.js
//#import Util.js
//#import login.js
//#import address.js

;(function(){
    var selfApi = new JavaImporter(
    Packages.net.xinshi.isone.commons.Global,
    Packages.net.xinshi.isone.functions.user.MemberFunction,
    Packages.net.xinshi.isone.modules.order.OrderUtil,
    Packages.net.xinshi.isone.modules.user.LoginSessionUtils,
    Packages.org.apache.commons.lang.StringUtils,
    Packages.org.json.JSONObject
    );

    var ret = {
        state:false,
        errorCode:""
    }

        var loggedUser = LoginService.getFrontendUser();
        var userId = "";
        if(loggedUser != null){
            userId = loggedUser.id
        }else{
            ret.errorCode = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }

        var orderId = $.params.orderId;
        var optType = $.params.optType||"oList4Re";
        var toStateType = $.params.toStateType;
        var toState = $.params.toState;

        if (selfApi.StringUtils.isBlank(optType)) {
            if (selfApi.StringUtils.isBlank(userId) || selfApi.StringUtils.isBlank(orderId) || selfApi.StringUtils.isBlank(toStateType) || selfApi.StringUtils.isBlank(toState)) {
                ret.errorCode = "param_empty";
                out.print(JSON.stringify(ret));
                return;
            }
        }

        var description = "前台修改订单状态";

        var jDoResult = selfApi.OrderUtil.ordersSign(orderId, "", userId, description, request, null);
        var Result= JSON.parse(jDoResult);
        if (Result.state != "ok") {
            ret.errorCode = "stateNotOk";
            out.print(JSON.stringify(ret));
            return;
        }else{
            ret.state = true;
            ret.errorCode = "";
            out.print(JSON.stringify(ret));
        }



})();