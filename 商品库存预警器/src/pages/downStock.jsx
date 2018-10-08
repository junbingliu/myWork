//#import doT.min.js
//#import Util.js
//#import session.js

(function () {

    var merchantId = $.params["m"];
    var listType = $.params["t"];
    var detail = $.params["d"];

    var pageData = {
        merchantId: merchantId,
        listType: listType,
        detail:detail
    };

    var template = $.getProgram(appMd5, "pages/downStock.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

