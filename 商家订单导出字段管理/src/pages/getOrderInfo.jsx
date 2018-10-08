//#import doT.min.js
//#import Util.js
//#import user.js
//#import $merchantOrderExportFieldsMgt:service/OrderExportFieldsService.jsx
;
(function () {
    var merchantId = $.params["m"];
    var columnId = $.params["columnId"];
    var gradeId = $.params["gradeId"];
    var type = $.params["type"];

    var orderInfo = OrderExportFieldsService.getExportConfig(type, columnId, gradeId);
    if (!orderInfo) {
        orderInfo = OrderExportFieldsService.getDefaultConfig(type)
    }

    var orderInfoFieldsList = [];
    if (orderInfo) {
        orderInfoFieldsList = orderInfo.values || [];
        orderInfoFieldsList.sort(compareField("index"));
    }


    for(var i=0;i<orderInfoFieldsList.length;i++){
        var jValue = orderInfoFieldsList[i];
        if(!jValue.isShow){
            jValue.isShow = "true";
        }
    }

    var pageData = {
        merchantId: merchantId,
        columnId: columnId,
        gradeId: gradeId,
        type: type,
        orderInfoFieldsList: orderInfoFieldsList
    };
    var template = $.getProgram(appMd5, "pages/getOrderInfo.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));

})();

function compareField(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return Number(value1) - Number(value2);
    }
}