//#import Util.js
//#import column.js
//#import user.js
//#import $wsBigMemberInterface:services/WSMemberService.jsx
//#import $wsBigMemberInterface:services/AppArgumentService.jsx
//#import $globalLogCenter:services/GlobalLogService.jsx
//#import $wsBigMemberIntegralCenter:services/WSMemberIntegralService.jsx

;
(function () {
    $.log("\n...................................8888888888888888888............ReduceIntegralBeforeAdd.jsx....begin");
    var javaOrder = ctx.get("order_object");//java对象
    if (!javaOrder) {
        return;
    }

    var jOrder = JSON.parse(javaOrder.toString() + "");
    var orderAliasCode = jOrder.aliasCode;
    var sellerId = jOrder.sellerInfo.merId;
    var buyerUserId = jOrder.buyerInfo.userId;
    var priceInfo = jOrder.priceInfo;

    var shopName = "";
    var branchcode = null;
    var jRel = getRelByMerchantId(sellerId);
    if (jRel) {
        branchcode = jRel.branchcode;
        shopName = jRel.name;
    }
    if (!branchcode) {
        //没有配置关联关系
        return;
    }

    var logContent = "";
    try {
        var jArgs = AppArgumentService.getArgs("head_merchant");

        var jUser = UserService.getUser(buyerUserId);
        var wsBigMemberInfo = jUser.wsBigMemberInfo;
        if (!wsBigMemberInfo || !wsBigMemberInfo.memberId) {
            throw "您还没有绑定实体卡，绑定后才能使用积分购买";
        }

        var memberId = wsBigMemberInfo.memberId;
        var postData = {
            "memberid": memberId
        };
        $.log("\n...................................8888888888888888888............ReduceIntegralBeforeAdd.jsx..getBranchPointList..postData=" + JSON.stringify(postData));
        var checkResult = WSMemberService.getBranchPointList(jArgs, postData);
        $.log("\n...................................8888888888888888888............ReduceIntegralBeforeAdd.jsx..getBranchPointList..checkResult=" + checkResult);
        var jCheckResult = JSON.parse(checkResult);
        if (jCheckResult.errcode != 0) {
            throw "获取会员积分失败，失败原因：" + jCheckResult.errtext;
        }


        var totalLessPoint = 0;
        var branchPointList = jCheckResult.BranchPointList;
        if (branchPointList) {
            for (var i = 0; i < branchPointList.length; i++) {
                var jBranchPoint = branchPointList[i];
                if (jBranchPoint.branchcode == branchcode) {
                    totalLessPoint = Number(jBranchPoint.onlinetotalpoint) + Number(jBranchPoint.offlinetotalpoint);
                }
            }
        }

        var useIntegralPrice = Number(priceInfo.fIntegralBuyPrice || 0);

        if (totalLessPoint <= 0 || totalLessPoint < useIntegralPrice) {
            throw "会员积分余额不足";
        }
        var amount = Number(0 - useIntegralPrice).toFixed(2);

        var postData = {
            branchcode: branchcode,
            memberid: memberId,
            shopname: shopName,
            point: amount,
            paypassword: "",
            remark: "积分兑换商品支付",
            type: 3
        };
        $.log("\n...................................8888888888888888888............ReduceIntegralBeforeAdd.jsx....postData=" + JSON.stringify(postData));
        var result = WSMemberService.updateBranchPoint(jArgs, postData);
        $.log("\n...................................8888888888888888888............ReduceIntegralBeforeAdd.jsx....result=" + result);
        var jResult = JSON.parse(result);
        if (jResult.errcode != 0) {
            throw "积分扣减失败，失败原因：" + jResult.errtext;
        }

        //增加交易明细记录....begin
        var transactionLog = {};
        transactionLog.userId = buyerUserId;
        transactionLog.beforeAmount = totalLessPoint + "";
        transactionLog.amount = amount;
        transactionLog.afterAmount = (totalLessPoint + Number(amount)) + "";
        transactionLog.reason = "积分兑换商品支付";
        transactionLog.orderId = orderAliasCode;
        transactionLog.type = "recharge";
        WSMemberIntegralService.addLog(buyerUserId, transactionLog);
        //增加交易明细记录....end

        $.log("\n...................................8888888888888888888............ReduceIntegralBeforeAdd.jsx....end");
    } catch (e) {
        logContent = GlobalLogService.appendLog(logContent, e);
        throw e;
    } finally {
        var logObjectId = buyerUserId + "|" + orderAliasCode;
        GlobalLogService.addLog("log_BMS_jifenOrder", logObjectId, "/wsBigMemberInterface/eventHandlers/ReduceIntegralBeforeAdd.jsx", logContent);
    }

})();

function getRelByMerchantId(merchantId) {
    var jRelation = AppArgumentService.getOTORelation();
    if (jRelation && jRelation.relValues) {
        for (var m = 0; m < jRelation.relValues.length; m++) {
            var jRel = jRelation.relValues[m];
            if (jRel.mid == merchantId) {
                return jRel;
            }
        }
    }
    return null;
}
