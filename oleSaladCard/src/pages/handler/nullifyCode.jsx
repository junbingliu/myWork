//#import doT.min.js
//#import Util.js
//#import login.js
//#import $oleSaladCard:services/saladCardCodeService.jsx
//#import $oleSaladCard:services/SignLogService.jsx
(function () {
    try {
        var result={}
        var id = $.params["id"];
        if (!id) {
            result.code = "101";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }
        var loginUserId = LoginService.getBackEndLoginUserId();
        if(!loginUserId){
            result.code = "102";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }
        var jCodeObj=saladCardCodeService.getSaladCardCode(id);
        if(!jCodeObj){
            result.code = "103";
            result.msg = "数据不存在";
            out.print(JSON.stringify(result));
            return;
        }
        jCodeObj.state='3';//0:未使用，1：待兑换，2：已兑换，3：已核销
        jCodeObj.nullifyTime=new Date().getTime();
        jCodeObj.createUserId=loginUserId;
        saladCardCodeService.saveSaladCardCodeById(id, jCodeObj);
        result.code = "0";
        result.msg = "核销成功";
        out.print(JSON.stringify(result));
        return;
    } catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
