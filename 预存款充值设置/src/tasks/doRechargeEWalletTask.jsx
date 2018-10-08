//#import pigeon.js
//#import Util.js
//#import order.js
//#import OrderLog.js
//#import jobs.js
//#import account.js
//#import $globalLogCenter:services/GlobalLogService.jsx
//#import $OnlineRechargeEWallet:services/OnlineRechargeArgsService.jsx
;
(function () {
    //获取订单
    var jOrder = OrderService.getOrder(orderId);
    if (!jOrder) {
        return;
    }
    $.log("\n...............doRechargeEWalletTask.jsx..begin...orderId=" + orderId);

    var orderAliasCode = jOrder.aliasCode;//外部订单号
    var states = jOrder.states;
    if (!states) return;
    var processState = states.processState;
    var payState = states.payState;
    if (processState.state != 'p101' || payState.state != 'p201') {
        $.log("\n订单号为【" + orderAliasCode + "】的订单不属于已支付、已确认状态,操作终止");
        return;
    }


    var logContent = "";
    var isNeedLog = false;

    try {
        var isUpdated = false;
        var sellerId = jOrder.sellerInfo.merId;//用户ID

        var eWalletProductId = "";
        var myWalletProductId = "";
        var jArgs = OnlineRechargeArgsService.getArgs();
        if (jArgs) {
            if (jArgs.eWalletProductId) eWalletProductId = jArgs.eWalletProductId;
            if (jArgs.myWalletProductId) myWalletProductId = jArgs.myWalletProductId;
        }

        var createOrderUserId = jOrder.buyerInfo.userId;//用户ID
        var items = jOrder.items;//（items的name就是 赠送预存款金额）
        //循环遍历
        for (var key in items) {
            //获取items里面的数据
            var jItem = items[key];

            var productId = jItem.productId;
            var skuId = jItem.skuId;
            var amount = jItem.amount;
            if (productId == eWalletProductId) {
                //充值预存款
                isUpdated = doAddEWallet(createOrderUserId, amount, "eWallet", orderAliasCode);

            } else if (productId == myWalletProductId) {
                //充值武商网钱包
                isUpdated = doAddEWallet(createOrderUserId, amount, "myWallet", orderAliasCode);
            }
        }

        if (isUpdated) {
            //充值完成，自动把订单修改为已签收
            var when = (new Date()).getTime() + 10 * 1000;
            var jobPageId = "tasks/doAutoCompletedOrderTask.jsx";
            var postData = {orderId: orderId};
            JobsService.submitOrderTask(appId, jobPageId, postData, when);

            OrderLogService.addErrorLog(orderId, "u_sys", "添加到自动完成队列成功");
        }
    } catch (e) {
        logContent = GlobalLogService.appendLog(logContent, "下单充值预存款出现异常，异常信息为：" + e);
        isNeedLog = true;
    } finally {
        if (isNeedLog) {
            GlobalLogService.addLog("log_OnlineRechargeEWallet", orderAliasCode, "/OnlineRechargeEWallet/tasks/doRechargeEWalletTask.jsx", logContent);
        }
    }
})();

function doAddEWallet(userId, eWalletAmount, accountType, orderAliasCode) {
    //修改的金额
    var amount = Number(Number(eWalletAmount) * 100);

    var merchantId = "head_merchant";
    // var accountType = "eWallet";
    var objTypeId = "objType_user";
    var transactionType = "transationType_recharge";
    var fillReason = "会员自主充值，订单号" + orderAliasCode;
    //判断修改用户预存金额是否修改成功
    var isOk = AccountService.updateAccount(userId, merchantId, accountType, amount, fillReason, "u_sys", objTypeId, transactionType);

    return isOk;
}




