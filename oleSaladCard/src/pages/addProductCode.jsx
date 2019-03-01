//#import doT.min.js
//#import Util.js
//#import $oleSaladCard:services/saladCardService.jsx
(function () {
    var result={};
    try{
        var activityId = $.params["activityId"];
        var productCode = $.params["proCode"];
        if(!activityId || !productCode){
            result.code = "100";
            result.msg = "参数错误";
            out.print(JSON.stringify((result)));
            return;
        }
        var productListObj = saladCardService.getActivityProductList(activityId);
        if (!productListObj) {
            productListObj = {};
        }

        var proCodeList = productListObj.productList;
        if (!proCodeList) {
            proCodeList = [];
            productListObj.productList = proCodeList;
        }
        for (var i = 0; i < proCodeList.length; i++) {
            if (productCode == proCodeList[i]) {
                result.code = "101";
                result.msg = "商品编码重复";
                out.print(JSON.stringify((result)));
                return;
            }
        }
        productListObj.productList.push(productCode);

        saladCardService.saveActivityProductList(activityId, productListObj);
        result.code = "0";
        result.msg = "商品编码添加成功";
        out.print(JSON.stringify(result));
    }catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }


})()