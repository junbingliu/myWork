//#import Util.js
//#import product.js
//#import login.js
//#import user.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js
//#import order.js
//#import column.js
//#import $orderLogInfoManualMgt:services/LogisService.jsx

(function () {
    var selfApi = new JavaImporter(
        Packages.org.json,
        Packages.org.apache.commons.lang,
        Packages.net.xinshi.isone.modules,
        Packages.net.xinshi.isone.modules.price,
        Packages.net.xinshi.isone.commons,
        Packages.java.util,
        Packages.java.lang,
        Packages.java.math,
        Packages.java.net,
        Packages.java.util.regex,
        Packages.net.xinshi.isone.functions.order,
        Packages.net.xinshi.isone.modules.order.bean,
        Packages.net.xinshi.isone.modules.order,
        Packages.net.xinshi.isone.modules.order.afterservice,
        Packages.net.xinshi.isone.modules.order.afterservice.tools,
        Packages.net.xinshi.isone.modules.order.OrderSearchUtil,
        Packages.net.xinshi.isone.functions.product
    );
    var ret = {
        state:false,
        errorCode:""
    }
    var requestURI = request.getRequestURI() + "";
    var userId = "";
    var user = LoginService.getFrontendUser();
    if (user) {
        userId = user.id;
    } else {
        var result = {
            errorCode: "notLogin"
        }
        out.print(result);
    }

    var mid = "head_merchant";
    var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");
    var rateOfRmb = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "RateOfRmb2IntegralExchange");

    var orderId = $.params.id;

    var order = OrderService.getOrder(orderId);

    var orderAliasCode = order.aliasCode;
    var logisList = LogisService.get(orderAliasCode);
    var total = logisList ? logisList.length : 0;

    var javaOrder = null;
    if (order) {
        var buyerUserId;
        if(order.buyerInfo){
            buyerUserId = order.buyerInfo.userId;
        }

        if((!buyerUserId) || buyerUserId != userId){
            var result = {
                errorCode: "notIsYouOrder"
            }
            out.print(result);
            return;
        }


        javaOrder = $.toJavaJSONObject(order);
    }
    order.createTimeFormat = DateUtil.getLongDate(parseInt(order.createTime)) + "";
    var itemList = selfApi.OrderHelper.getNewItemsWithChildItemsWithPresent(javaOrder);
    order.itemList = JSON.parse(itemList.toString());
    for (var j = 0; j < order.itemList.length; j++) {
        var item = order.itemList[j];
        var orderProduct = ProductService.getProduct(item.productId);
        var pics = ProductService.getPics(orderProduct);
        var realPics = [];
        for (var k = 0; k < pics.length; k++) {
            var relatedUrl = FileService.getRelatedUrl(pics[k].fileId, "90X90");
            realPics.push(relatedUrl);
        }
        orderProduct.pics = realPics;
        item.orderProduct = orderProduct;
    }
    order.states.processState.desc = selfApi.OrderState.valueOf(order.states.processState.state).getBuyerDesc() + "";
    order.states.payState.desc = selfApi.OrderState.valueOf(order.states.payState.state).getBuyerDesc() + "";
    order.states.approvalState.desc = selfApi.OrderState.valueOf(order.states.approvalState.state).getBuyerDesc() + "";

    if(order.states.refundState&&order.states.refundState.state){
        order.states.refundState.desc = selfApi.OrderState.valueOf(order.states.refundState.state).getBuyerDesc() + "";
    }

    order.isCashOnDelivery = selfApi.OrderHelper.isCashOnDelivery(javaOrder);

    if (order.deliveryInfo) {
        order.deliveryInfo.regionPath = ColumnService.getColumnNamePath(order.deliveryInfo.regionId, 'c_region_1602', "");
    }

    var jPayInfoArr = selfApi.OrderUtil.getPayRecArrayInfo(javaOrder);
    var payInfoList = [];
    var integralAmount = 0, ticketAmount = 0;
    for (var j = 0; j < jPayInfoArr.length(); j++) {
        var jPayInfo = jPayInfoArr.optJSONObject(j);
        if (jPayInfo.optString("paymentId").equals("mpay_50700")) {
            integralAmount += jPayInfo.optLong("payMoneyAmount");
        }//积分支付金额
        if (jPayInfo.optString("paymentId").equals("mpay_50601")) {
            ticketAmount += jPayInfo.optLong("payMoneyAmount");
        }//卡券支付金额
        payInfoList.push(JSON.parse(jPayInfo.toString()));
    }
    order.payInfoList = payInfoList;
    order.payInfo = {
        payModeList: payInfoList
    };
    if (order.states.payState.state == "p201") {
        var payStateTime = selfApi.OrderUtil.getOrderStateValueOfStateType($.toJavaJSONObject(order.states), selfApi.OrderStateType.payState);
        var jPayState = payStateTime.optJSONObject("p201");
        if (jPayState != null) {
            var lastModifyTime = jPayState.optLong("lastModifyTime");
            order.payInfo.payTime = DateUtil.getLongDate(lastModifyTime);
        }
    }

    if (order.priceInfo) {
        var priceInfo = order.priceInfo;
        if (priceInfo.integralPayPrice && priceInfo.integralPayPrice != 0) {
            priceInfo.fIntegralPayMoney = selfApi.PriceUtil.getMoneyValue(priceInfo.integralPayPrice * parseFloat(rateOfRmb)) + "";
        }
        var deliveryPreferPrice = 0;
        if (priceInfo.deliveryProductPreferPrice && priceInfo.deliveryProductPreferPrice != 0) {
            deliveryPreferPrice += priceInfo.deliveryProductPreferPrice;
        }
        if (priceInfo.deliveryCategoryPreferPrice && priceInfo.deliveryCategoryPreferPrice != 0) {
            deliveryPreferPrice += priceInfo.deliveryCategoryPreferPrice;
        }
        if (deliveryPreferPrice > 0) {
            priceInfo.fDeliveryPreferPrice = selfApi.PriceUtil.getMoneyValue(deliveryPreferPrice) + "";
        }

        if (order.orderType == 'preSale') {
            var payAmount = 0;
            if (order.isPayDeposit) {
                payAmount = priceInfo.fTotalDepositPrice
            } else {
                payAmount = priceInfo.fTotalOrderNeedPayPrice
            }
            priceInfo.fPreSaleNeedPayMoneyAmount = payAmount;
        }

    }


    //包裹单信息
    var packLength = 0;


    if (packLength == 0) {
        if (order.logisticsInfo && order.logisticsInfo.billNo && order.logisticsInfo.delMerchantColumnId) {
            //var deliObj = selfApi.OrderFunction.getCompanyCodeByBill(order.logisticsInfo.delMerchantColumnId);
            //if(deliObj != null && deliObj.optString("supportInterface").equals("Open_API_APICode_URL")){
            //    order.logisticsInfo.deJudge = true;
            //}else{
            //    order.logisticsInfo.deJudge = false;
            //}
            //
            //
            //
            //var jDelMerchant = selfApi.IsoneModulesEngine.delMerchantService.getDelMerchant(order.logisticsInfo.delMerchantColumnId);
            //if(jDelMerchant != null){
            //    order.logisticsInfo.delMerchantName = jDelMerchant.optString("delMerchantName") + "";
            //}

            var jDeliveryMerchant = selfApi.IsoneModulesEngine.delMerchantService.getDeliveryMerchantByDelMerchantId(order.logisticsInfo.delMerchantColumnId);
            if (jDeliveryMerchant != null) {
                order.logisticsInfo.delMerchantName = jDeliveryMerchant.optString("deliveryMerchantName") + "";
                var webSite = jDeliveryMerchant.optString("deliveryMerchantWebsite") + "";
                if (webSite.indexOf("http://") > -1 || webSite.indexOf("https://") > -1) {

                } else {
                    webSite = "http://" + webSite;
                }
                order.logisticsInfo.delMerchantWebsite = webSite;
            }

        }
    }

    //订单跟踪信息
    //var jOrderLogs = new selfApi.JSONObject();
    //var logsList = selfApi.IsoneOrderEngine.orderLogService.getLogs(order.id, selfApi.OrderLogType.OLT107);
    //if (logsList == null) {
    //    logsList = new selfApi.JSONArray();
    //}else{
    //    for(var i=0;i<logsList.length();i++){
    //        var jLog = logsList.getJSONObject(i);
    //        jLog.put("timeFormat",DateUtil.getLongDate(jLog.optLong("time")) + "");
    //        jLog.put("description",jLog.optString("description").replaceAll("<br/>|<BR/>","&nbsp;&nbsp;"));
    //    }
    //}
    //jOrderLogs.put("total", logsList.length());
    //jOrderLogs.put("records", logsList);

    var result = {
        state: true,
        errorCode:"",
        order: order,
        user: user,
        packLength: packLength,
        logisList:logisList,
        logisTotal:total
    }
    out.print(JSON.stringify(result));

})();