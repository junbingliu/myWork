//#import Util.js
//#import login.js
//#import jobs.js
//#import $wsBigMemberInterface:services/AppArgumentService.jsx

;
(function () {
    var result = {};
    try {
        var userId = LoginService.getBackEndLoginUserId();
        if (!userId) {
            result.code = "100";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }

        var merchantId = $.params["m"];
        var address = $.params["address"] || "";
        var namespaceURI = $.params["namespaceURI"] || "";

        var jArgs = AppArgumentService.getArgs(merchantId);
        if (!jArgs) {
            jArgs = {};
        }

        jArgs.address = address;
        jArgs.namespaceURI = namespaceURI;
        AppArgumentService.saveArgs(merchantId, jArgs);

        result.code = "0";
        result.msg = "修改成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
