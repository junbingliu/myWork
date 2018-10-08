//#import Util.js
//#import login.js
//#import sysArgument.js
//#import product.js

;(function(){
    //try{
        var user = LoginService.getFrontendUser();
        var userId = "-1";
        if(user!=null){
            userId = user.id;
        }

        var ret = {
            state:false
        }

        var idsStr = $.params.ids;
        var stockIdsStr = $.params.stockIds;
        if(idsStr){
            var productIds = new Packages.java.util.ArrayList(),idsSplit = idsStr.split(",");
            for(var i=0;i<idsSplit.length;i++){
                if(productIds.indexOf(idsSplit[i]) > -1){
                    continue;
                }
                productIds.add(idsSplit[i]);
            }

            var stockIds = [];
            if(stockIdsStr){
                var stockIdsSplit = stockIdsStr.split(",");
                for(var i=0;i<stockIdsSplit.length;i++){
                    if(stockIds.indexOf(stockIdsSplit[i]) > -1){
                        continue;
                    }
                    stockIds.push(idsSplit[i]);
                }
            }





            //var cxt = "{attrs:{},factories:[{factory:RPF}]}",versionList = [];
            //versionList = ProductService.getProductsByIdsWithoutPrice(productIds);
            //versionList = ProductService.getPriceValueListBatch($.toJSONObjectList(versionList), userId, "head_merchant", cxt, "normalPricePolicy");


            var cxt = "{attrs:{},factories:[{factory:RPF}]}";
            var jContext = new ProductApi.JSONObject(cxt);
            var priceContext = jContext.getObjectMap();

            var versionList = [];
            var versionList = ProductApi.IsoneModulesEngine.productService.getListDataByIds(productIds, false);
            versionList = ProductApi.PricePolicyHelper.getPriceValueList(versionList, userId, "head_merchant", priceContext, "normalPricePolicy");  //一次性获取商品价格
            var jTempJson = new ProductApi.JSONObject();
            jTempJson.put("versionList",versionList);

            var tempJson = JSON.parse(jTempJson.toString());
            var productList = tempJson.versionList;
            var priceMap = {};
            var productStocks = {};
            if(productList.length > 0){
                for (var k = 0, vLength = productList.length; k < vLength; k++) {
                    var newProductPrices = productList[k].priceValues;
                    var productId = productList[k].objId;
                    var tempJ = {};
                    if (newProductPrices) {
                        var realPrice = newProductPrices[0] && newProductPrices[0].formatUnitPrice;
                        if (realPrice) {
                            tempJ.price = realPrice;
                        }
                    }

                    if (stockIds.indexOf(productId) > -1) {

                        if (productStocks[productId]) {
                            tempJ["sellableCount"] = productStocks[productId];
                        }else{
                            var jProduct = $.toJavaJSONObject({"objId":productId,"merchantId":productList[k].merchantId});
                            var jProductStock = Packages.net.xinshi.isone.modules.product.inventory.ProductInventoryHelper.getOneProductInventory(jProduct,jProduct["merchantId"]);
                            productStocks[productId] = jProductStock.optInt(jProduct.optString("objId"));
                            tempJ["sellableCount"] = productStocks[productId];
                        }
                        var sellableCount = parseInt(productStocks[productId]);
                        var stockWidth = sellableCount > 100 ? 100 : sellableCount;
                        tempJ["stockWidth"] = stockWidth;

                    }



                    priceMap[productId] = tempJ;
                }
            }

            ret.priceMap = priceMap;
            ret.state = true;
        }




        out.print(JSON.stringify(ret));
    //}catch(e){
    //    var ret = {
    //        state:false
    //    }
    //    out.print(JSON.stringify(ret));
    //}
})();