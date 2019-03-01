//#import Util.js
//#import login.js
//#import user.js
//#import $oleSaladCard:services/saladCardService.jsx
//#import $oleSaladCard:services/saladCardCodeService.jsx
;
(function () {
    var result = {};
    try {
        var activityId = $.params["id"];
        if (!activityId || activityId== "") {
            result.code = "105";
            result.msg = "activityId不存在";
            out.print(JSON.stringify(result));
            return;
        }
        var jRecord = saladCardService.getActivity(activityId);
        if(!jRecord){
            result.code = "106";
            result.msg = "活动不存在";
            out.print(JSON.stringify(result));
            return;
        }
        var listSize = saladCardCodeService.getAllSaladCardCodeListSize(activityId);
        if(listSize>0){
            var listData =[];
            listData = saladCardCodeService.getAllSaladCardCodeList(activityId,0, 10000);
            for(var i=0;i<listData.length;i++){
                var id=listData[i].id;
                saladCardCodeService.delSaladCardCode(activityId,id);
            }
        }
        var productList =saladCardService.getActivityProductList(activityId);
        if(productList){
            saladCardService.delActivityProductList(activityId);
        }
        saladCardService.delActivity(activityId);
        result.code = "0";
        result.msg = "活动删除成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
