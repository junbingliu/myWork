//#import user.js
//#import Util.js
//#import order.js
//#import jobs.js
//#import $OnlineRechargeEWallet:services/OnlineRechargeArgsService.jsx

(function () {

    var result = {};
    var orderId = $.params["orderId"];
    if (!orderId) {
        result.code = "101";
        result.msg = "订单号不能为空";
        out.print(JSON.stringify(result));
        return;
    }

    var jOrder;
    if (orderId.indexOf("o_") == -1) {
        jOrder = OrderService.getOrderByAliasCode(orderId);
    } else {
        jOrder = OrderService.getOrder(orderId);
    }
    if (!jOrder) {
        result.code = "102";
        result.msg = "订单不存在";
        out.print(JSON.stringify(result));
        return;
    }

    $.log("\n...............doRechargeEWalletTask.jsx.....doRechargeEWalletTask....begin=" + orderId);

    //获取订单商家ID
    var merchantId = jOrder.sellerInfo.merId;
    //外部订单号
    var orderAliasCode = jOrder.aliasCode;
    orderId = jOrder.id;

    var states = jOrder.states;
    if (!states) return;
    var processState = states.processState;
    var payState = states.payState;
    if (processState.state != 'p101' || payState.state != 'p201') {
        result.code = "100";
        result.msg = "操作终止，原因是：订单号为【" + orderAliasCode + "】的订单不属于已支付、已确认状态";
        out.print(JSON.stringify(result));
        return;
    }

    var eWalletProductId = "";
    var myWalletProductId = "";

    var jArgs = OnlineRechargeArgsService.getArgs();
    if (jArgs) {
        if (jArgs.eWalletProductId) eWalletProductId = jArgs.eWalletProductId;
        if (jArgs.myWalletProductId) myWalletProductId = jArgs.myWalletProductId;
    }

    var isRechargeOrder = false;
    var items = jOrder.items;//（items的name就是 赠送预存款金额）
    //循环遍历
    for (var key in items) {
        //获取items里面的数据
        var jItem = items[key];

        var productId = jItem.productId;
        if (productId == eWalletProductId || productId == myWalletProductId) {
            isRechargeOrder = true;
            break;
        }
    }

    if (!isRechargeOrder) {
        //不是充值订单
        result.code = "103";
        result.msg = "操作终止，原因是：当前订单不是充值订单";
        out.print(JSON.stringify(result));
        return;
    }
    $.log("\n...............doRechargeEWalletTask.jsx.....doRechargeEWalletTask....ok=" + orderId);

    result.code = "ok";
    result.msg = "操作成功";
    out.print(JSON.stringify(result));

    var when = (new Date()).getTime();
    var postData = {orderId: orderId};
    JobsService.submitOrderTask(appId, "tasks/doRechargeEWalletTask.jsx", postData, when);

})();