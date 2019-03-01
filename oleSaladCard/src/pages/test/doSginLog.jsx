
//#import @server/util/H5CommonUtil.jsx
//#import Util.js
//#import login.js
//#import $oleSaladCard:services/SignLogService.jsx
(function () {
    try {
        var sheetId = $.params["sheetId"];
        var activityId = $.params["activityId"];
        var userId = $.params["userId"];
        $.log("===============打卡")
        if (!activityId || !sheetId || !userId) {
            H5CommonUtil.setReturnResult('101','参数错误');
            return;
        }

        var jSignLog = SignLogService.getSignLogBySheetId(sheetId);
        if(jSignLog){
            H5CommonUtil.setReturnResult('103','当前小票已经被使用');
            return;
        }

        //todo:根据小票号查询线下接口，查询小票对应的商品列表，对比商品是否符合打卡商品


        //下面是表示验证通过的，则添加打卡记录

        //添加打卡记录
        jSignLog = {};
        jSignLog.userId = userId;
        jSignLog.sheetId = sheetId;
        jSignLog.activityId = activityId;

        SignLogService.addSignLog(sheetId, activityId, jSignLog);

        //记录打卡总次数
        SignLogService.updateSignAmount(userId, activityId, 1);

        //获取最新打卡记录
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
