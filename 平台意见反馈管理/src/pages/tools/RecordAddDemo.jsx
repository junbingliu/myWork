//#import Util.js
//#import login.js
//#import $platformFeedbackServer:services/PlatformFeedbackService.jsx

(function () {

    var result = {};
    try {
        var loginUserId = LoginService.getFrontendUserId();
        if (!loginUserId || loginUserId == "") {
            result.code = "101";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }

        var jRecord = {};
        jRecord.type = "pay";//产品问题
        jRecord.title = "想咨询一下支付中国人问题1";
        jRecord.content = "想咨询一下支付问题";
        jRecord.contact = "13800138001";

        var newId = PlatformFeedbackService.addFeedback(jRecord, loginUserId);

        result.code = "0";
        result.msg = "操作成功";
        result.newId = newId;
        out.print(JSON.stringify(result));
    } catch (e) {
        result.code = "110";
        result.msg = "操作出现异常，异常信息为："+e;
        out.print(JSON.stringify(result));
    }


})();

