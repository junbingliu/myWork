//#import Util.js
//#import login.js
//#import $popupsManage:services/PopupsService.jsx
(function () {
    var result = {};
    // try {
        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId) {
            result.code = "101";
            result.msg = "您还未登录, 请登录后操作";
            out.print(JSON.stringify(result));
            return;
        }
        var merchantId = $.params.merchantId;
        var handle=$.params.handle;
        var id = $.params.id;
        var type = $.params.type;
        var isEnable = $.params.isEnable;
        var image = $.params.image;
        var returnUrl = $.params.returnUrl;
        var beginTime = $.params.beginTime;
        var endTime = $.params.endTime;
        var channel = $.params.channel;
        var applicablePage = $.params.applicablePage;
        var description = $.params.description;
        if (handle == "add") {
            var jTempAct = {};
            jTempAct.type = type;
            jTempAct.isEnable = isEnable;
            jTempAct.image = image;
            jTempAct.returnUrl = returnUrl;
            jTempAct.beginTime = beginTime;
            jTempAct.endTime = endTime;
            jTempAct.channel = channel;
            jTempAct.applicablePage = applicablePage;
            jTempAct.description = description;
            jTempAct.merchantId=merchantId;
            PopupsService.addPopups(loginUserId, jTempAct);
        } else if (handle == "edit" && id != "") {
            var obj = PopupsService.getPopups(id);
            if (!obj) {
                result.code = "104";
                result.msg = "该弹窗、浮标不存在,修改失败!";
                out.print(JSON.stringify(result));
                return;
            }
            obj.type = type;
            obj.isEnable = isEnable;
            obj.image = image;
            obj.returnUrl = returnUrl;
            obj.beginTime = beginTime;
            obj.endTime = endTime;
            obj.channel = channel;
            obj.applicablePage = applicablePage;
            obj.description = description;
            PopupsService.updatePopups(obj);
        }else {
            result.code = "102";
            result.msg = "操作非法!";
            out.print(JSON.stringify(result));
            return;
        }
        result.code = "0";
        out.print(JSON.stringify(result));
    // } catch (e) {
    //     $.log("\n............................e="+e);
    //     result.code = "99";
    //     result.msg = "操作出现异常，请稍后再试";
    //     out.print(JSON.stringify(result));
    // }
})();



