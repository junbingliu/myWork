//#import Util.js
//#import login.js
//#import merchant.js
//#import $globalUserCacheStore:services/GlobalUserCacheStoreService.jsx

;
(function () {


    var result = {};
    var loginUserId = LoginService.getFrontendUserId();
    if (!loginUserId) {
        result.code = "100";
        result.msg = "请先登录";
        out.print(JSON.stringify(result));
        return;
    }

    GlobalUserCacheStoreService.addValue(loginUserId, "userHasClickSetPassword", "1");

    result.code = "0";
    result.msg = "";
    out.print(JSON.stringify(result));
})();