//#import doT.min.js
//#import Util.js
//#import login.js
//#import merchant.js
//#import session.js
//#import user.js
//#import UserUtil.js

(function () {
    var merchantId = $.params["m"];

    var loginUserId = LoginService.getBackEndLoginUserId();
    var jUser = UserService.getUser(loginUserId);

    var merchantName = "未知";
    var loginName = "未知";
    var jMerchant = MerchantService.getMerchant(merchantId);
    if (jMerchant) {
        merchantName = jMerchant.name_cn;
    }
    if (jUser) {
        loginName = UserUtilService.getRealName(jUser);
    }

    var pageData = {
        merchantId: merchantId,
        merchantName: merchantName,
        loginName: loginName
    };

    var template = $.getProgram(appMd5, "pages/include_nav.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

