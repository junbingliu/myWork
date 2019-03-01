//#import @server/util/H5CommonUtil.jsx
//#import Util.js
//#import login.js
//#import $oleSaladCard:services/SignLogService.jsx
(function () {
    try {
        var activityId = $.params["activityId"];
        var userId = $.params["userId"];
        if (!activityId || !userId) {
            H5CommonUtil.setReturnResult('101','参数错误');
            return;
        }
        var jSignLog = SignLogService.getUserAmountSign(userId);
        if(!jSignLog){
            H5CommonUtil.setReturnResult('102','记录不存在');
            return;
        }
        var result={
            signLog:jSignLog[activityId],
            totalSignLog:jSignLog[activityId+'_total']
        }
        H5CommonUtil.setSuccessResult(result);
    } catch (e) {
        H5CommonUtil.setExceptionResult();
    }
})();
