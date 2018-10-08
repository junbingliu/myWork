//#import Util.js
//#import login.js
//#import product.js
//#import $OnlineRechargeEWallet:services/OnlineRechargeArgsService.jsx

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

        var deliveryRuleId = $.params["deliveryRuleId"] || "";
        var eWalletProductId = $.params["eWalletProductId"] || "";
        var myWalletProductId = $.params["myWalletProductId"] || "";

        if (eWalletProductId) {
            var Product = ProductService.getProduct(eWalletProductId);
            var MemberPrice = ProductService.getMemberPrice(Product);
            if (MemberPrice != 1) {
                result.code = "101";
                result.MemberPrice = MemberPrice;
                result.msg = "预存款充值商品支付价格必须为1元!";
                out.print(JSON.stringify(result));
                return;
            }
        }

        if (myWalletProductId) {
            var Product2 = ProductService.getProduct(myWalletProductId);
            var MemberPrice2 = ProductService.getMemberPrice(Product2);
            if (MemberPrice2 != 1) {
                result.code = "102";
                result.MemberPrice2 = MemberPrice2;
                result.msg = "武商网钱包充值商品支付价格必须为1元!";
                out.print(JSON.stringify(result));
                return;
            }
        }


        var jArgs = {};
        jArgs.deliveryRuleId = deliveryRuleId;
        jArgs.eWalletProductId = eWalletProductId;
        jArgs.myWalletProductId = myWalletProductId;

        OnlineRechargeArgsService.saveArgs(jArgs);

        result.code = "ok";
        result.msg = "保存成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
