//#import doT.min.js
//#import Util.js

(function () {
    try {
        var t = $.params["t"] || "all";
        var m = $.params.m;

        var pageData = {
            merchantId : m,
            t:t
        };

    var template = $.getProgram(appMd5, "pages/popUps/popUpsList.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
    }catch(e){
        out.print(e);
    }
})();

