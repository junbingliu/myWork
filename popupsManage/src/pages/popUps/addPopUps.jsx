//#import doT.min.js
//#import Util.js
(function () {
    try {
        var merchantId = $.params["m"];
        var detailImageUrl = "/upload/nopic_200.jpg";
        var template = $.getProgram(appMd5, "pages/popUps/addPopUps.jsxp");
        var pageData = {
            detailImageUrl:detailImageUrl,
            merchantId: merchantId,
        };
        var pageFn = doT.template(template);
        out.print(pageFn(pageData));
    }catch (e) {
        out.print("发生了错误: "+e);
    }

})();
