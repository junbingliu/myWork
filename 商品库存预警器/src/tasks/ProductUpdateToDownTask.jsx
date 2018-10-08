//#import Util.js
//#import DateUtil.js
//#import product.js
//#import log.js
//#import open-product.js
//#import $ProductStockEarlyWarning:services/ProductStockService.jsx

(function () {

    try {

        var jProduct = ProductService.getProductWithoutPrice(productId);
        if(!jProduct){
            return;
        }

        var skus = ProductService.getSkus(productId);
        if (skus && skus.length > 0) {
            var isMultiSku = false;
            if (skus.length > 1) {
                isMultiSku = true;
            }

            var totalSellableCount = 0;
            if (isMultiSku) {
                //多SKU
                for (var k = 0; k < skus.length; k++) {
                    var jSku = skus[k];
                    if (jSku.isHead) {
                        continue;
                    }
                    var sellableCount = ProductService.getSellableCountBySku(jProduct, jSku);
                    totalSellableCount += sellableCount;
                }
            } else {
                //只有一个SKU
                var jSku = skus[0];
                var sellableCount = ProductService.getSellableCountBySku(jProduct, jSku);
                totalSellableCount += sellableCount;
            }

            if (totalSellableCount > 0) {
                //库存大于0，则不下架
                $.log("....................ProductUpdateToDownTask.jsx....totalSellableCount>0...productId="+productId);
                return;
            }
        }

        var oldState = ProductService.getPublishState(jProduct);
        if (oldState.equals("0")) {
            //已经是下架的则不执行自动下架
            $.log("....................ProductUpdateToDownTask.jsx....当前商品已经是下架状态...productId="+productId);
            return;
        }

        var jUpdateResult = OpenProductService.updateProductToDown(productId);
        if (jUpdateResult.code == "0") {
            var objectLog = {};
            objectLog.modifyUser = "系统";
            objectLog.modifyTime = new Date().getTime() + "";
            objectLog.ip = "127.0.0.1";
            objectLog.description = "库存为0超过指定天数，自动下架";
            objectLog.oldValue = "发布状态:上架";
            objectLog.newValue = "发布状态:下架";

            //记录下架日志
            downLog(jProduct);

            LogService.addObjectLog("objectLog", productId, "ObjLogType_product_publishState", objectLog);
        }
    } catch (e) {
        $.log(e);
    }


})();

function downLog(jProduct) {
    var obj_prefixes="ProductStockEarlyWarning_soldOut";
    var curTime = new Date().getTime();
    var formatCreateTime = DateUtil.getLongDate(curTime);
    var arr = formatCreateTime.split(" ");
    var obj_suffix=arr[0];

    var downStock_id=obj_prefixes+"_"+obj_suffix;
    var downStockObj=ProductStockService.getObj(downStock_id);
    if(!downStockObj){
        downStockObj={}
    }
    if(!downStockObj.value){
        downStockObj.value=[];
    }

    var jLog={
        objId:jProduct.objId,
        name:jProduct.name,
        downStockTime:formatCreateTime
    }
    downStockObj.id=downStock_id;
    downStockObj.value.push(jLog);
    ProductStockService.addObj(downStock_id,downStockObj)

}


