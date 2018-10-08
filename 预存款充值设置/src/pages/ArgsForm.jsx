//#import doT.min.js
//#import Util.js
//#import $OnlineRechargeEWallet:services/OnlineRechargeArgsService.jsx

(function () {


    var merchantId = $.params["m"];

    var eWalletProductId = "";
    var myWalletProductId = "";
    var deliveryRuleId = "";

    var jArgs = OnlineRechargeArgsService.getArgs();
    if (jArgs) {
        if (jArgs.eWalletProductId) eWalletProductId = jArgs.eWalletProductId;
        if (jArgs.deliveryRuleId) deliveryRuleId = jArgs.deliveryRuleId;
        if (jArgs.myWalletProductId) myWalletProductId = jArgs.myWalletProductId;
    }

    var template = $.getProgram(appMd5, "pages/ArgsForm.jsxp");
    var pageData = {
        merchantId: merchantId,
        eWalletProductId: eWalletProductId,
        deliveryRuleId: deliveryRuleId,
        myWalletProductId: myWalletProductId
    };
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

