//#import doT.min.js
//#import Util.js
//#import session.js

(function () {

    var merchantId = $.params["m"];
    var listType = $.params["t"];

    var pageData = {
        merchantId: merchantId,
        listType: listType
    };

    var template = $.getProgram(appMd5, "pages/ProductList.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

