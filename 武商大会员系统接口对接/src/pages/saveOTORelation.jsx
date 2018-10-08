//#import Util.js
//#import login.js
//#import $wsBigMemberInterface:services/AppArgumentService.jsx


(function () {
    var result = {};

    try {
        /*var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId || loginUserId == "") {
            result.code = "101";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }*/

        var name = $.params["name"];
        var mid = $.params["mid"];
        var branchcode = $.params["branchcode"];

        $.log("======>>>>>>>"+name);
        $.log("======>>>>>>>"+mid);
        $.log("======>>>>>>>"+branchcode);

        if (!name || name.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "请填写商家名称";
            out.print(JSON.stringify(result));
            return;
        }
        if (!mid || mid.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "商家ID不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!branchcode || branchcode.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "机构编码不存在";
            out.print(JSON.stringify(result));
            return;
        }

        var jRelation = AppArgumentService.getOTORelation();
        if (!jRelation) {
            jRelation = {};
            jRelation.id = "wsBigMemberInterfaceObj_OTORelation";
        }
        if (!jRelation.relValues) {
            jRelation.relValues = [];
        }
        var arr = jRelation.relValues;
        for (var i = 0; i < arr.length; i++) {
            if (mid == arr[i].mid || branchcode == arr[i].branchcode) {
                result.code = "106";
                result.msg = "商家ID或机构编码重复";
                out.print(JSON.stringify(result));
                return;
            }
        }

        var jOTORelation = {
            name: name,
            mid: mid,
            branchcode: branchcode
        };

        arr.push(jOTORelation);
        AppArgumentService.saveOTORelation(jRelation);

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