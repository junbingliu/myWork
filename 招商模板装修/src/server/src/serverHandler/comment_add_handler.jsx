//#import Util.js
//#import login.js
//#import DateUtil.js
//#import sysArgument.js
//#import user.js

(function () {
    var selfApi = new JavaImporter(
        Packages.org.json,
        Packages.net.xinshi.isone.modules,
        Packages.net.xinshi.isone.modules.order,
        Packages.net.xinshi.isone.modules.order.bean,
        Packages.net.xinshi.isone.modules.credit.appraise,
        Packages.java.util,
        Packages.java.util.regex,
        Packages.net.xinshi.isone.functions.account
    );
    var requestURI = request.getRequestURI() + "";
    var ret = {
        state:false,
        errorCode:""
    };
    var userId = "";
    try {
        var user = LoginService.getFrontendUser();
        if (user) {
            userId = user.id;
        } else {
            ret.errorCode = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }

        var mid = "head_merchant";
        var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");

        var orderId = $.params.orderId;
        var buyerUserId = $.params.buyerUserId;
        var productComments = $.params.productComments;

        if (productComments) {
            var comments = $.JSONArray(productComments);
            for (var i = 0; i < comments.length; i++) {
                var jComment = comments[i];
                var productId = jComment.productId;
                var skuId = jComment.skuId;
                var doResult = selfApi.IProductAppraiseService.addAppraise(orderId, buyerUserId, productId, skuId, jComment);
            }
        }


    }catch (e){
        $.log(e);
        ret.state = false;
        ret.errorCode = "system_error";
    }
    out.print(JSON.stringify(result));
})();