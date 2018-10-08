//#import Util.js
//#import DateUtil.js
//#import user.js
//#import open-user.js
//#import UserUtil.js
//#import order.js
//#import login.js
//#import merchant.js
//#import session.js
//#import open-order.js
;
(function () {

    var ret = {};
    try {
        var userId = LoginService.getFrontendUserId();
        if(!userId || userId == ""){
            ret.state = "err";
            ret.msg = "请先登录";
            out.print(JSON.stringify(ret));
            return;
        }
        var currentPage = $.params["page"];
        if (!currentPage) {
            currentPage = 1;
        }

        var recordType = "订单";
        var pageLimit = 10;
        var displayNum = 6;
        var totalRecords = 0;
        var searchArgs = {
            fields: "orderAliasCode,createTime,totalOrderRealPrice"
        };
        var otherParams = {};
        otherParams.isResellerOrder = "Y";
        otherParams.resellerUserId = userId;//todo:

        searchArgs.otherParams = otherParams;
        searchArgs.page = currentPage;
        searchArgs.page_size = pageLimit;
        var searchResult = OpenOrderService.getOrders(searchArgs);

        var orderList = [];
        if (searchResult.code == "0") {
            var orders = searchResult.orders;
            totalRecords = searchResult.total;
            for (var i = 0; i < orders.length; i++) {
                var jSmallOrder = orders[i];
                var orderInfo = {};
                orderInfo.createTime = jSmallOrder.createTime;
                orderInfo.orderAliasCode=jSmallOrder.orderAliasCode;
                orderInfo.totalOrderRealPrice=jSmallOrder.totalOrderRealPrice;
                orderInfo.totalRecords=totalRecords;
                orderList.push(orderInfo);
            }
        }
        var ret = {

            orderList: orderList,
            state:true,
        };
        out.print(JSON.stringify(ret));
    }catch(e){
        $.log(e);
        ret.state = "err";
        ret.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(ret));
    }

})();

