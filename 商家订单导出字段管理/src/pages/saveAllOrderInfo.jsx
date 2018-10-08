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

        var columnId = $.params["columnId"];
        var gradeId = $.params["gradeId"];
        var type = $.params["type"];

        var list = $.params["list"];

        if (!list) {
            result.code = "105";
            result.msg = "数据不存在";
            out.print(JSON.stringify(result));
            return;
        }

        list = JSON.parse(list);

        var orderInfo = OrderExportFieldsService.getExportConfig(type, columnId, gradeId);
        if (!orderInfo) {
            orderInfo = {};
        }

        if (!orderInfo.values) {
            orderInfo.values = []
        }

        orderInfo.values = list;

        OrderExportFieldsService.saveExportConfig(type, columnId, gradeId, orderInfo);

        result.code = "0";
        result.msg = "保存成功";
        out.print(JSON.stringify(result));


    }
    catch (e) {
        result.code = "99";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }


})();