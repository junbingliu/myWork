//#import doT.min.js
//#import Util.js
//#import user.js
//#import DateUtil.js
//#import UserUtil.js
//#import search.js
//#import login.js
//#import file.js
//#import $oleSaladCard:services/saladCardService.jsx
//#import $oleSaladCard:services/saladCardQuery.jsx


(function () {
    var result = {};
    var activity={};
    try {
        activity.title = $.params["title"];
        activity.disc = $.params["disc"];
        activity.startDate = $.params["startDate"];
        activity.endDate = $.params["endDate"];
        activity.shareTitle = $.params["shareTitle"];
        activity.shareDisc = $.params["shareDisc"];
        activity.shareLink = $.params["shareLink"];
        activity.shareImg = $.params["shareImg"];

        if (!activity.title || activity.title== "") {
            result.code = "105";
            result.msg = "数据不存在";
            out.print(JSON.stringify(result));
            return;
        }
        var loginUserId = LoginService.getBackEndLoginUserId();
        saladCardService.addActivity(activity,loginUserId);
        result.code = "0";
        result.msg = "添加活动成功";
        out.print(JSON.stringify(result));
        return;
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();