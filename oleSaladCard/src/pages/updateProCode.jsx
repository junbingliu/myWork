//#import Util.js
//#import $oleSaladCard:services/saladCardService.jsx
;
(function () {
    var result = {};
    try {
        var newProCode = $.params["newProCode"];
        var activityId = $.params["activityId"];
        var oriProCode=$.params["oriProCode"];

        if (!oriProCode || oriProCode== "") {
            result.code = "105";
            result.msg = "oriProCode不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!activityId || activityId== "") {
            result.code = "105";
            result.msg = "activityId不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!newProCode || newProCode== "") {
            result.code = "105";
            result.msg = "newProCode不存在";
            out.print(JSON.stringify(result));
            return;
        }

        var proCodeListObj=saladCardService.getActivityProductList(activityId);
        var proCodeList=proCodeListObj.productList;
        for(var i=0;i<proCodeList.length;i++){
            if(oriProCode==proCodeList[i]){
                proCodeList[i]=newProCode
                break;
            }
        }
        proCodeListObj.productList=proCodeList;
        saladCardService.saveActivityProductList(activityId,proCodeListObj)
        result.code = "0";
        result.msg = "修改成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
