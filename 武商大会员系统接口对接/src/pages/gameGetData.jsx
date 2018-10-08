//#import Util.js
//#import login.js
//#import $wsBigMemberInterface:services/AppArgumentService.jsx


(function () {
    var result = {};

    try {
        var nickName = $.params["nickName"];

        $.log("======>>>>>>>"+nickName);

        if (!nickName || nickName.replace(/\s/g, "").length==0) {
            result.code = "105";
            result.msg = "请填写昵称";
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