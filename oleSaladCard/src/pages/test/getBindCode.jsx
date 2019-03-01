
//#import @server/util/H5CommonUtil.jsx
//#import doT.min.js
//#import Util.js
//#import login.js
//#import $oleSaladCard:services/saladCardCodeService.jsx
//#import $oleSaladCard:services/SignLogService.jsx
(function () {
    try {
        //作用：在用户点击兑换码时，从表中获取一个兑换码绑定用户，并生成相应日志
        var activityId = $.params["activityId"];
        var userId = $.params["userId"];
        if (!activityId || !userId) {
            H5CommonUtil.setReturnResult('101','参数错误');
            return;
        }
        var jUserCodeObj=saladCardCodeService.getUserCode(userId,activityId);
        var result={}
        if(!jUserCodeObj||!jUserCodeObj.userCodeList){
            result.userCodeList=[];
        }
        result.userCodeList=jUserCodeObj.userCodeList;
        H5CommonUtil.setSuccessResult(result);
    } catch (e) {
        H5CommonUtil.setExceptionResult();
    }
})();
