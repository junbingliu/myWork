//#import Util.js
//#import login.js
//#import DigestUtil.js
//#import DateUtil.js
//#import appraise.js

//#import product.js

;(function () {
    var selfApi = new JavaImporter(
        Packages.net.xinshi.isone.modules.IsoneCreditEngine,
        Packages.net.xinshi.isone.modules.user.LoginSessionUtils,
        Packages.org.apache.commons.lang.StringUtils,
        Packages.org.json.JSONObject,
        Packages.net.xinshi.isone.modules.credit.CreditAppraiseArgumentsUtil,
        Packages.net.xinshi.isone.modules.IsoneModulesEngine,
        Packages.net.xinshi.isone.base.IsoneBaseEngine,
        Packages.net.xinshi.isone.session.ISessionService
    );
        var ret = {
            state: false,
            errorCode: ""
        };

        var loggedUser = LoginService.getFrontendUser();
        var userId = "";
        if (loggedUser != null) {
            userId = loggedUser.id
        } else {
            ret.state = false;
            ret.errorCode = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }

        var productComments = $.params.productComments;
        var orderId = $.params.orderId;
        var isAnonymity = $.params.isAnonymity;
        var Comments = JSON.parse(productComments);
        for (var i = 0; i < Comments.length; i++) {

            var comment = Comments[i];
            var jComment = {
                realSkuId: comment.realSkuId,
                productId: comment.productId,
                star: comment.star,
                comment: comment.comment,
                isAnonymity: isAnonymity
            };

            var doResult = selfApi.IsoneCreditEngine.productAppraiseService.addAppraise(orderId, userId, comment.productId, comment.realSkuId, $.toJavaJSONObject(jComment));

        }
        var Result = JSON.parse(doResult.toString());
        if (Result.state == 0) {
            ret.state = true;
            ret.errorCode = "评价成功";
            out.print(JSON.stringify(ret));
        } else {
            ret.state = false;
            ret.errorCode = Result.msg;
            out.print(JSON.stringify(ret));
            return;
        }
})();