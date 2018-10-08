//#import pigeon.js
//#import Util.js
//#import product.js
//#import sku.js
//#import search.js
//#import jobs.js

;
(function () {
    if (typeof ids == "undefined") {
        return;//do nothing
    }

    var idArray = ids.split(",");
    var docs = [];
    for (var i = 0; i < idArray.length; i++) {
        var productId = idArray[i];
        var jProduct = ProductService.getProductWithoutPrice(productId);
        if (jProduct) {

            var skus = ProductService.getSkus(productId);
            if (!skus || skus.length == 0) {
                continue;
            }

            var isMultiSku = false;
            if (skus.length > 1) {
                isMultiSku = true;
            }

            var totalSellableCount = 0;
            var emptyStockFlag = "0";//库存为0标记
            var warningStockFlag = "0";//低于安全库存标记
            if (isMultiSku) {
                //多SKU
                for (var k = 0; k < skus.length; k++) {
                    var jSku = skus[k];

                    if (jSku.isHead) {
                        continue;
                    }

                    var sellableCount = ProductService.getSellableCountBySku(jProduct, jSku);
                    totalSellableCount += sellableCount;
                    if (sellableCount <= 0) {
                        emptyStockFlag = "1";
                        warningStockFlag = "1";
                    } else {
                        var securitySellableCount = ProductService.getSecuritySellableCount(productId, jSku.id);
                        if (Number(sellableCount - securitySellableCount) <= 0) {
                            warningStockFlag = "1";
                        }
                    }

                    if (emptyStockFlag == "1" && warningStockFlag == "1" && totalSellableCount > 0) {
                        //两个都为1就不用再计算其他的SKU了(为了统计所有SKU的总数量是否为0，所以加上了totalSellableCount大于0的条件)
                        break;
                    }
                }
            } else {
                //只有一个SKU
                var jSku = skus[0];
                var sellableCount = ProductService.getSellableCountBySku(jProduct, jSku);
                totalSellableCount += sellableCount;
                if (sellableCount <= 0) {
                    emptyStockFlag = "1";
                    warningStockFlag = "1";
                } else {
                    emptyStockFlag = "0";
                    var securitySellableCount = ProductService.getSecuritySellableCount(productId, jSku.id);
                    if (sellableCount - securitySellableCount <= 0) {
                        warningStockFlag = "1";
                    }
                }

            }

            if (totalSellableCount <= 0) {
                //库存为0,3天后自动下架
                // var when = (new Date()).getTime() + 1000 * 60 * 60 * 24 * 3;
                var when = (new Date()).getTime() + 1000 * 10;//测试
                var jobPageId = "tasks/ProductUpdateToDownTask.jsx";
                var postData = {productId: productId};
                JobsService.submitTask(appId, jobPageId, postData, when);
            }

            var doc = {};
            doc.id = jProduct.objId;
            doc.merchantId = jProduct.merchantId;
            doc.emptyStockFlag = emptyStockFlag;
            doc.warningStockFlag = warningStockFlag;
            doc.ot = "productStockEarlyWarning";
            docs.push(doc);
        }
    }
    if (docs.length == 0) {
        return;
    }
    SearchService.index(docs, ids);

})();