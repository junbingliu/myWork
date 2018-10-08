//#import Util.js
//#import product.js
//#import ViewHistory.js
//#import commend.js
//#import price.js
//#import inventory.js
//#import file.js
//#import json2.js

;(function(){
    try{
        var productProcess = function(productList,imgSize){
            var newProductList=[];
            for(var i=0;i<productList.length;i++){
                if(ProductService.getPublishState(productList[i]) == "0"){
                    continue;
                }
                var newProduct={};
                newProduct.id=productList[i].objId;
                newProduct.name=productList[i].name;
                newProduct.merchantId=productList[i].merchantId;
                if(!productList[i].price){
                    var priceObj=priceService.getPrice(productList[i].priceId);
                    productList[i].price=priceObj;
                }
//                newProduct.marketPrice=ProductService.getMarketPrice(productList[i])||"暂无价格";
                newProduct.memberPrice=ProductService.getMemberPrice(productList[i]);
                if(newProduct.memberPrice){
                    var splitPrice = (newProduct.memberPrice + "").split(".");
                    if(splitPrice.length == 1){
                        splitPrice[1] = "00";
                    }
                    newProduct.splitMemberPrice = splitPrice;
                }
                var pics=ProductService.getPics(productList[i]);
                var realPices=[];
                for(var j=0;j<pics.length;j++){
                    var relatedUrl=FileService.getRelatedUrl(pics[j].fileId,imgSize||"90X90");
                    realPices.push(relatedUrl);
                }
                newProduct.pics=realPices;
//                newProduct.salesAmount=ProductService.getSalesAmount(productList[i].objId)||0;
                var skus=ProductService.getSkus(productList[i].objId);
                if(skus.length==1){
                    newProduct.skuId=skus[0].id;
                    var inventory = InventoryService.getSkuInventory(productList[i].objId,newProduct.skuId);
                    newProduct.sellableCount = inventory.sellableCount;
                }

                /*获取促销图标*/
                var allPromotionLogo = {};
                var sysArgumentPromotionLogo = allPromotionLogo[productList[i].merchantId];
                if(!sysArgumentPromotionLogo){
                    sysArgumentPromotionLogo = ProductApi.IsoneModulesEngine.sysArgumentService.getSysArgument(productList[i].merchantId, "c_promotionLogo", false);
                    allPromotionLogo[productList[i].merchantId] = sysArgumentPromotionLogo;
                }
                var promotionLogosArray = [];
                var promotionLogosList = ProductService.getProductPromotionLogo($.toJavaJSONObject(productList[i]), null);
                if(promotionLogosList != null && promotionLogosList.size() > 0){
                    for(var j=0;j<promotionLogosList.size();j++){
                        var logoJson = JSON.parse(promotionLogosList.get(j).toString());
                        logoJson.realPath = FileService.getRelatedUrl(logoJson.value,"35X35");
                        promotionLogosArray.push(logoJson);
                    }
                }
                newProduct.promotionLogosArray = promotionLogosArray;


                newProductList.push(newProduct);
            }
            return newProductList;
        }


        var imgSize = $.params.size||"200X200";
        var count = $.params.count || 5;


        //获取浏览记录
        var viewHistory = ViewHistoryService.getProductViewHistory(count);
        var viewHistoryProducts = productProcess(viewHistory,imgSize);

        var result = {"viewHistory":viewHistoryProducts,"count":viewHistoryProducts.length};
        out.print(JSON.stringify(result));
    }catch(e){
        var ret = {
            state:false
        }
        $.log(e);
        out.print(JSON.stringify(ret));
    }
})();