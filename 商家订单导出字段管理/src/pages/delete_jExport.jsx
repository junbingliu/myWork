//#import Util.js
//#import login.js
//#import $merchantOrderExportFieldsMgt:service/OrderExportFieldsService.jsx


(function () {
    var result = {};
    try {

        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId || loginUserId == "") {
            result.code = "101";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }

        var id = $.params["id"];

        if (!id) {
            result.code = "102";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }

        OrderExportFieldsService.delExport(id)

        result.code = "0";
        result.msg = "操作成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "99";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
