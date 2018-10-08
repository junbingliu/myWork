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

        var columnId=$.params["columnId"]
        var gradeId=$.params["gradeId"]
        var type=$.params["type"]
        var id=$.params["id"]


        if (!id) {
            result.code = "102";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }

        var orderInfo = OrderExportFieldsService.getExportConfig(type,columnId,gradeId)
        if (!orderInfo || !orderInfo.values) {
            result.code = "103";
            result.msg = "没有要删除的数据";
            out.print(JSON.stringify(result));
            return;
        }

        var newValues = [];
        var arr = orderInfo.values;
        for (var i = 0; i < arr.length; i++) {
            if (id == arr[i].id) {
                continue;
            }
            newValues.push(arr[i]);
        }

        orderInfo.values = newValues;
        OrderExportFieldsService.saveExportConfig(type,columnId,gradeId,orderInfo)

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
