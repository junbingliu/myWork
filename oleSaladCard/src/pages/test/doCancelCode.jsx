
//#import @server/util/H5CommonUtil.jsx
//#import doT.min.js
//#import Util.js
//#import login.js
//#import $oleSaladCard:services/saladCardCodeService.jsx
//#import $oleSaladCard:services/SignLogService.jsx
(function () {
    try {
        var activityId = $.params["activityId"];
        var userId = $.params["userId"];
        var code=$.params['code'];
        var validateCode=$.params['validateCode'];
        if (!activityId || !userId || !code || !validateCode) {
            H5CommonUtil.setReturnResult('101','参数错误');
            return;
        }
        if(validateCode!='123456'){
            H5CommonUtil.setReturnResult('102','验证码错误');
            return;
        }
        var jUserCodeObj=saladCardCodeService.getUserCode(userId,activityId);
        if(!jUserCodeObj){
            H5CommonUtil.setReturnResult('103','数据不存在');
            return;
        }
        var userCodeList = jUserCodeObj.userCodeList;
        for(var i=0;i<userCodeList.length;i++){
            if(code==userCodeList[i].code){
                userCodeList[i].state='1';
                break;
            }
        }
        jUserCodeObj.userCodeList=userCodeList;
        saladCardCodeService.addUserCode(userId,activityId,jUserCodeObj);
        var jCodeObj=saladCardCodeService.getSaladCardCodeByCode(activityId,code);
        if(!jCodeObj){
            H5CommonUtil.setReturnResult('103','数据不存在');
            return;
        }
        jCodeObj.state='1';
        saladCardCodeService.saveSaladCardCode(activityId, jCodeObj);
        //返回客户端用户绑定的兑换码
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
