//#import doT.min.js
//#import Util.js
//#import user.js
//#import DateUtil.js
//#import UserUtil.js
//#import search.js
//#import login.js
//#import file.js
//#import $platformFeedbackServer:services/PlatformFeedbackService.jsx
//#import $platformFeedbackServer:services/PlatformFeedbackQuery.jsx


(function () {
    var result = {};
    try {

        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId || loginUserId == "") {
            result.code = "101";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }

        var recordId = $.params["recordId"];
        var ids = $.params["ids"];


        //删除单个数据
        if(recordId){
            PlatformFeedbackService.delFeedback(recordId);
            result.code = "0";
            result.msg = "数据删除成功";
            out.print(JSON.stringify(result));
            return;
        }

        //删除多个数据
        if(ids){
            ids=JSON.parse(ids);
            for(var i=0;i<ids.length;i++){
                PlatformFeedbackService.delFeedback(ids[i]);
            }
            result.code = "0";
            result.msg = "数据删除成功";
            out.print(JSON.stringify(result));
            return;
        }



    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }


})();