
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
        //todo:判断打卡次数
        var jSignLog = SignLogService.getUserAmountSign(userId);
        if(!jSignLog){
            H5CommonUtil.setReturnResult('102','记录不存在');
            return;
        }
        var signLog=jSignLog[activityId];
        signLog=Number(signLog);
        if(signLog<5){
            H5CommonUtil.setReturnResult('103','打卡次数不足');
            return;
        }


        var start = 0;
        var totalSize = saladCardCodeService.getAllSaladCardCodeListSize(activityId);
        var jAvailableCode = null;
        while (start < totalSize) {
            var recordList = saladCardCodeService.getAllSaladCardCodeList(activityId, start, 100);
            start = start + 100;
            for (var i = 0; i < recordList.length; i++) {
                var jCode = recordList[i];
                if (!jCode.userId) {
                    jAvailableCode = jCode;
                    break;
                }
            }
        }
        jAvailableCode.userId = userId;
        jAvailableCode.bindTime = new Date().getTime();
        saladCardCodeService.saveSaladCardCode(activityId, jAvailableCode);
        var jUserCodeObj=saladCardCodeService.getUserCode(userId,activityId);
        if(!jUserCodeObj.userCodeList){
            jUserCodeObj.userCodeList=[];
        }
        jUserCodeObj.userCodeList.push(jAvailableCode);
        saladCardCodeService.addUserCode(userId,activityId,jUserCodeObj)
        SignLogService.updateSignAmount(userId,activityId,-5);
        //获取用户绑定的兑换码列表
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
