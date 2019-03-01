//#import Util.js
//#import login.js
//#import user.js
//#import $oleSaladCard:services/saladCardService.jsx
;
(function () {
    var result = {};
    var activity={};
    try {
        activity.id = $.params["id"];
        activity.title = $.params["title"];
        activity.disc = $.params["disc"];
        activity.startDate = $.params["startDate"];
        activity.endDate = $.params["endDate"];
        activity.shareTitle = $.params["shareTitle"];
        activity.shareDisc = $.params["shareDisc"];
        activity.shareLink = $.params["shareLink"];
        activity.shareImg = $.params["shareImg"];

        if (!activity.id || activity.id== "") {
            result.code = "105";
            result.msg = "id不存在";
            out.print(JSON.stringify(result));
            return;
        }
        if (!activity.title || activity.title== "") {
            result.code = "105";
            result.msg = "数据不存在105";
            out.print(JSON.stringify(result));
            return;
        }

        var jRecord = saladCardService.getActivity(activity.id);
        if(!jRecord){
            result.code = "106";
            result.msg = "数据不存在106";
            out.print(JSON.stringify(result));
            return;
        }
        jRecord.title = activity.title;
        jRecord.disc = activity.disc;
        jRecord.startDate = activity.startDate;
        jRecord.endDate = activity.endDate;
        jRecord.shareTitle = activity.shareTitle;
        jRecord.shareDisc = activity.shareDisc;
        jRecord.shareLink = activity.shareLink;
        jRecord.shareImg = activity.shareImg;

        saladCardService.updateActivity(jRecord);

        result.code = "0";
        result.msg = "修改成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
