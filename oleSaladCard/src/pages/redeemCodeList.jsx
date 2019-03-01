//#import doT.min.js
//#import Util.js
//#import $oleSaladCard:services/saladCardCodeService.jsx

(function () {
    var merchantId = $.params["m"];
    var activityId = $.params['activityId'];
    var totalRecords = saladCardCodeService.getAllSaladCardCodeListSize(activityId);

    var pageData = {
        merchantId: merchantId,
        activityId:activityId
    };
    if(totalRecords>0){
        pageData.totalRecords='1'
    }else {
        pageData.totalRecords='0'
    }

    var template = $.getProgram(appMd5, "pages/redeemCodeList.html");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();