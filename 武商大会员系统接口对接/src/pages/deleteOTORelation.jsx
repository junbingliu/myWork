//#import Util.js
//#import login.js
//#import $wsBigMemberInterface:services/AppArgumentService.jsx


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

        var mid = $.params["mid"];
        if (!mid) {
            result.code = "102";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }

        var jRelation = AppArgumentService.getOTORelation();
        if (!jRelation || !jRelation.relValues) {
            result.code = "103";
            result.msg = "没有要删除的数据";
            out.print(JSON.stringify(result));
            return;
        }

        var newValues = [];
        var arr = jRelation.relValues;
        for (var i = 0; i < arr.length; i++) {
            if (mid == arr[i].mid) {
                continue;
            }
            newValues.push(arr[i]);
        }

        jRelation.relValues = newValues;
        AppArgumentService.saveOTORelation(jRelation);

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
