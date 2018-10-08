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


        if (!columnId || columnId.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "商家分类不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!gradeId || gradeId.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "商家等级不存在";
            out.print(JSON.stringify(result));
            return;
        }

        var jExport={};
        jExport.gradeId=gradeId;
        jExport.columnId=columnId;

        var newId = OrderExportFieldsService.addExport(jExport,loginUserId);

        result.code = "0";
        result.msg = "添加成功";
        result.newId = newId;
        out.print(JSON.stringify(result));



    }
    catch (e) {
        result.code = "99";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }


})();