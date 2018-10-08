//#import user.js
//#import Util.js
//#import order.js
//#import jobs.js
//#import $OnlineRechargeEWallet:services/OnlineRechargeArgsService.jsx

(function () {

    if (!ctx) return;
    var orderId = "" + ctx.get("order_id");
    var order = ctx.get("order_object");
    if (!order) return;
    var jOrder = JSON.parse(order.toString());

    $.log("\n...............doRechargeEWalletTask.jsx.....doRechargeEWalletTask....begin=" + orderId);

    //获取订单商家ID
    var merchantId = jOrder.sellerInfo.merId;
    //外部订单号
    var orderAliasCode = jOrder.aliasCode;

    var states = jOrder.states;
    if (!states) return;
    var processState = states.processState;
    var payState = states.payState;
    if (payState.state != 'p201') {
        $.log("\n订单号为【" + orderAliasCode + "】的订单不属于已支付、已确认状态,操作终止");
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
        return;
    }
    $.log("\n...............doRechargeEWalletTask.jsx.....doRechargeEWalletTask....ok=" + orderId);
    //2秒后开始充值
    var when = (new Date()).getTime() + 2 * 1000;
    var postData = {orderId: orderId};
    JobsService.submitOrderTask(appId, "tasks/doRechargeEWalletTask.jsx", postData, when);

})();