//#import Util.js
//#import login.js
//#import user.js
//#import $platformFeedbackServer:services/PlatformFeedbackService.jsx

;
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

        var id = $.params["id"];
        var recordState = $.params["state"];
        var recordTitle = $.params["title"];
        var recordContent = $.params["content"];
        var recordContact = $.params["contact"];

        if (!id || id == "") {
            result.code = "103";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }

        if (!recordState || recordState == "") {
            result.code = "104";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }
        if (!recordTitle || recordTitle == "") {
            result.code = "104";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }
        if (!recordContent || recordContent == "") {
            result.code = "104";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }
        if (!recordContact || recordContact == "") {
            result.code = "104";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }

        var jRecord = PlatformFeedbackService.getFeedback(id);
        if(!jRecord){
            result.code = "105";
            result.msg = "数据不存在";
            out.print(JSON.stringify(result));
            return;
        }
        var curTime = new Date().getTime();
        jRecord.state = recordState;
        jRecord.title = recordTitle;
        jRecord.content = recordContent;
        jRecord.contact = recordContact;

        PlatformFeedbackService.updateFeedback(jRecord);

        result.code = "0";
        result.msg = "操作成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
