//#import doT.min.js
//#import Util.js
//#import $oleSaladCard:services/saladCardCodeService.jsx
(function () {
    var result = {};
    try {
        var activityId = $.params["activityId"];
        if (!activityId) {
            result.code = "101";
            result.msg = "参数错误";
            out.print(JSON.stringify(result));
            return;
        }

        var totalSize = saladCardCodeService.getAllSaladCardCodeListSize(activityId);
        if (totalSize > 0) {
            result.code = "102";
            result.msg = "当前活动已经生成过兑换码";
            out.print(JSON.stringify(result));
            return;
        }

        var totalCreated = 0;
        for (var i = 0; i < 100; i++) {
            var jCode = {};
            jCode.state = "0";
            jCode.code = getFormatCode(i);

            saladCardCodeService.addSaladCardCode(activityId, jCode);
            totalCreated++;
        }


        result.code = "0";
        result.msg = "操作成功，总数量为:" + totalCreated;
        out.print(JSON.stringify(result));
    } catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }


})();

function getFormatCode(number) {
    //todo:number为0则返回SLDK0000，number为1则返回SLDA0001
    return 'SLDK' + (number+10000+'').slice(1);
}