//#import doT.min.js
//#import Util.js
//#import $wsBigMemberInterface:services/AppArgumentService.jsx

(function () {
    var merchantId = $.params["m"];

    var address = "";
    var namespaceURI = "";

    var jArgs = AppArgumentService.getArgs(merchantId);
    if (jArgs) {
        if (jArgs.address) address = jArgs.address;
        if (jArgs.namespaceURI) namespaceURI = jArgs.namespaceURI;
    }

    var template = $.getProgram(appMd5, "pages/ArgsForm.jsxp");
    var pageData = {
        merchantId: merchantId,
        address: address,
        namespaceURI: namespaceURI
    };
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

