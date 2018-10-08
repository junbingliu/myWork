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

        var columnId=$.params["columnId"];
        var gradeId=$.params["gradeId"];
        var type=$.params["type"];


        var id = $.params["id"];
        var name = $.params["name"];
        var columnWidth = $.params["columnWidth"];
        var index = $.params["index"];
        var isChecked = $.params["isChecked"];
        var isShow = $.params["isShow"];


        if (!id || id.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "id不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!name || name.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "名称不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!isChecked || isChecked.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "是否默认选中不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!columnWidth || columnWidth.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "宽度不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!index || index.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "排序不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!isShow || isShow.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "是否生效不存在";
            out.print(JSON.stringify(result));
            return;
        }

        var orderInfo = OrderExportFieldsService.getExportConfig(type,columnId,gradeId)
        if(!orderInfo){
            orderInfo={};
        }

        if(!orderInfo.values){
            orderInfo.values=[]
        }

        var arr=orderInfo.values

        for (var i = 0; i < arr.length; i++) {
            if (id == arr[i].id || name == arr[i].name) {
                result.code = "106";
                result.msg = "id或者名称重复";
                out.print(JSON.stringify(result));
                return;
            }
        }

        var obj={
            id:id,
            name:name,
            columnWidth:columnWidth,
            index:index,
            isChecked:isChecked,
            isShow:isShow
        };

        orderInfo.values.push(obj);

        OrderExportFieldsService.saveExportConfig(type,columnId,gradeId,orderInfo);

        result.code = "0";
        result.msg = "添加成功";
        out.print(JSON.stringify(result));



    }
    catch (e) {
        result.code = "99";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }


})();