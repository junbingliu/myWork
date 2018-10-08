//#import Util.js
//#import open-order.js
//#import OrderLog.js
;
(function () {

    $.log("\n....................8888...88888...task...doAutoCompletedOrderTask.jsx.jsx...begin...orderId=" + orderId);

    var shippedResult = OpenOrderService.shippedOrderNoLogistics(orderId, "");
    if (shippedResult.code != "0") {
        OrderLogService.addErrorLog(orderId, "u_sys", "订单自动修改为已出库失败，失败原因：" + shippedResult.msg);
        return;
    }

    var signResult = OpenOrderService.signOrder(orderId, "");
    if (signResult.code != "0") {
        OrderLogService.addErrorLog(orderId, "u_sys", "订单自动修改为已签收失败，失败原因：" + signResult.msg);
    }

})();









