//#import doT.min.js
//#import Util.js
//#import $platformFeedbackServer:services/PlatformFeedbackService.jsx

(function () {
    var merchantId = $.params["m"];
    var id = $.params["id"];
    if(!id || id == ""){
        out.print("参数错误");
        return;
    }

    var jRecord = PlatformFeedbackService.getFeedback(id);
    if(!jRecord){
        out.print("不存在");
        return;
    }

    if(jRecord){
        result = jRecord
        out.print(JSON.stringify(result));
        return;
    }

})();