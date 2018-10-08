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
    var testObj={};
    try {

        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId || loginUserId == "") {
            result.code = "101";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }

        testObj.title = $.params["title"];
        testObj.contact = $.params["contact"];
        testObj.content = $.params["content"];

        if (!testObj.title || testObj.title== "") {
            result.code = "105";
            result.msg = "数据不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if(testObj){
            var loginUserId = LoginService.getBackEndLoginUserId();
            PlatformFeedbackService.addFeedback(testObj,loginUserId);
        }

        var id=testObj.id;
        var getObj=PlatformFeedbackService.getFeedback(id);
        if(getObj){
            result.code = "0";
            result.msg = "well done，添加数据成功";
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