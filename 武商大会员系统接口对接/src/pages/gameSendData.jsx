//#import doT.min.js
//#import Util.js
//#import user.js
//#import $wsBigMemberInterface:services/AppArgumentService.jsx

(function () {
    var merchantId = $.params["m"];

    var jRelation = AppArgumentService.getOTORelation();

    $.log("\n=========================jRelation="+JSON.stringify(jRelation));

    var merchantId2branchcodeRecordList = [];

    if (jRelation) {
        merchantId2branchcodeRecordList = jRelation.relValues || [];

    }


    var pageData = {
        merchantId: merchantId,
        merchantId2branchcodeRecordList: merchantId2branchcodeRecordList
    };
    $.log("\n..........................pageData="+JSON.stringify(pageData));
    var template = $.getProgram(appMd5, "pages/gameSendData.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();



