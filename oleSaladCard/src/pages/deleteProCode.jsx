//#import Util.js
//#import $oleSaladCard:services/saladCardService.jsx
;
(function () {
    var result = {};
    var activity = {};
    try {
        var activityId = $.params["activityId"];
        var proCode = $.params["proCode"];
        if (!proCode || proCode == "") {
            result.code = "101";
            result.msg = "proCode不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!activityId || activityId == "") {
            result.code = "102";
            result.msg = "activityId不存在";
            out.print(JSON.stringify(result));
            return;
        }

        var proCodeListObj = saladCardService.getActivityProductList(activityId);
        if (!proCodeListObj) {
            result.code = "103";
            result.msg = "活动不存在";
            out.print(JSON.stringify(result));
            return;
        }
        var proCodeList = proCodeListObj.productList;
        if (!proCodeList) {
            result.code = "103";
            result.msg = "商品编码不存在";
            out.print(JSON.stringify(result));
            return;
        }
        for (var i = 0; i < proCodeList.length; i++) {
            if (proCode == proCodeList[i]) {
                proCodeList.splice(i, 1);
                break;
            }
        }
        proCodeListObj.productList=proCodeList;
        saladCardService.saveActivityProductList(activityId, proCodeListObj);
        result.code = "0";
        result.msg = "删除成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
