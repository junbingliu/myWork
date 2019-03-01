//#import doT.min.js
//#import Util.js
//#import login.js
//#import file.js
//#import DateUtil.js
//#import $popupsManage:services/PopupsService.jsx
(function () {
    try {
        var id = $.params.id;
        var pageData = PopupsService.getPopups(id);

        var beginTempTime=DateUtil.getLongDate(pageData.beginTime);

        var beginTemp=beginTempTime.split(" ");
        var beginDate=beginTemp[0];
        var beginTime=beginTemp[1];

        var endTempTime=DateUtil.getLongDate(pageData.endTime);
        var endTemp=endTempTime.split(" ");
        var endDate=endTemp[0];
        var endTime=endTemp[1];

        $.log("beginTime==>"+"====>"+beginTemp+":::"+beginDate+"===>"+beginTime);
        $.log("endTemp==>"+"====>"+endTemp+":::"+endDate+"===>"+endTime);

        pageData.beginDate=beginDate;
        pageData.beginTime=beginTime;

        pageData.endDate=endDate;
        pageData.endTime=endTime;

        pageData.imageUrl=FileService.getRelatedUrl(pageData.image, "150X150");
        var template = $.getProgram(appMd5, "pages/popUps/updataPopUps.jsxp");
        var pageFn = doT.template(template);
        out.print(pageFn(pageData));
    } catch (e) {
        out.print(e)
    }
})();






