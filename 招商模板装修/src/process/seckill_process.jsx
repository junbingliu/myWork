//#import Util.js
//#import login.js
//#import product.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js
//#import merchant.js
//#import $GlobalVariableManagementApp:services/globalVariableManagementService.jsx
//#import $limitActivity:services/limitActivity.jsx
(function (processor) {

    processor.on("all",function(pageData,dataIds,elems){

        var mid = "head_merchant";
        var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn");
//        var webUrl = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webUrl");
        var userId = "unknown";
        var user = LoginService.getFrontendUser();
        if(user){
            userId = user.id;
        }
        setPageDataProperty(pageData,"webName",webName);
//        setPageDataProperty(pageData,"webUrl",webUrl);
        setPageDataProperty(pageData,"userId",userId);

    });


    processor.on(":productGroup", function (pageData, dataIds, elems) {
        var selfApi = new JavaImporter(
            Packages.net.xinshi.isone.modules,
            Packages.net.xinshi.isone.modules.product.inventory,
            Packages.net.xinshi.isone.modules.appmarket,
            Packages.net.xinshi.isone.modules.appmarket.service.impl,
            Packages.org.json
        );
        try {
            var productIds = [],getInventoryProductIds = [], versionList = [];
            var user = LoginService.getFrontendUser();
            var userId = user ? user.id : '-1';

            for (var i = 0, iLength = elems.length; i < iLength; i++) {
                var elem = elems[i];
                if (elem) {
                    var dataId = dataIds[i];
                    for (var j = 0, jLength = elem.length; j < jLength; j++) {
                        var productId = elem[j].id;
                        if (productIds.indexOf(productId) == -1) {
                            productIds.push(productId);
                        }
                        if(dataId == "qiangxian" || dataId == "groupOn" || dataId.indexOf("qiangxian1.pro_") > -1){
                            if (getInventoryProductIds.indexOf(productId) == -1) {
                                getInventoryProductIds.push(productId);
                            }
                        }
                    }
                }
            }

            if (productIds.length > 0) {
//                var cxt = "{isGetInventory:'true',attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                versionList = ProductService.getProductsByIdsWithoutPrice(productIds);
                versionList = ProductService.getPriceValueListBatch($.toJSONObjectList(versionList), userId, pageData["_m_"], cxt, "normalPricePolicy");

                //var allPromotionLogo = {};
                //for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                //    /*获取促销图标*/
                //    var sysArgumentPromotionLogo = allPromotionLogo[versionList[k].merchantId];
                //    if(!sysArgumentPromotionLogo){
                //        sysArgumentPromotionLogo = ProductApi.IsoneModulesEngine.sysArgumentService.getSysArgument(versionList[k].merchantId, "c_promotionLogo", false);
                //        allPromotionLogo[versionList[k].merchantId] = sysArgumentPromotionLogo;
                //    }
                //
                //
                //    var promotionLogosArray = [];
                //    var promotionLogosList = ProductService.getProductPromotionLogo($.toJavaJSONObject(versionList[k]), sysArgumentPromotionLogo);
                //    if(promotionLogosList != null && promotionLogosList.size() > 0){
                //        for(var ix=0;ix<promotionLogosList.size();ix++){
                //            var logoJson = JSON.parse(promotionLogosList.get(ix).toString());
                //            logoJson.realPath = FileService.getRelatedUrl(logoJson.value,"58X58");
                //            promotionLogosArray.push(logoJson);
                //        }
                //    }
                //    versionList[k].promotionLogosArray = promotionLogosArray;
                //}

                if (versionList.length > 0) {
                    var productStocks = {};
                    for (var i = 0, iLength = elems.length; i < iLength; i++) {
                        var elem = elems[i];
                        if (elem) {
                            for (var j = 0, jLength = elem.length; j < jLength; j++) {
                                var productId = elem[j].id;
                                var newProduct=ProductService.getProduct(productId);
                                var limitActivity = LimitActivityService.getCurrentActivity(productId);
                                var limitActivityBeginTime = 12344,limitActivityEndTime = "", numberPerActivity = 888;
                                if(limitActivity){
                                    limitActivityBeginTime = limitActivity.beginTime;
                                    limitActivityEndTime = limitActivity.endTime;
                                    numberPerActivity = limitActivity.numberPerActivity;
                                }
                                elem[j]["limitActivityBeginTime"] = limitActivityBeginTime;//活动开始时间
                                elem[j]["limitActivityEndTime"] = limitActivityEndTime;//活动结束时间
                                elem[j]["numberPerActivity"] = numberPerActivity;

                                //获取已购买数
                                var activity = LimitActivityService.getActivityBoughtNumber(limitActivity.id);
                                elem[j]["activity"] = activity;
                                $.log("测试招商购买数量"+JSON.stringify(activity));

                                for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                                    var product = versionList[k];
                                    if (productId == product.objId) {
                                        elem[j].merchantId = product.merchantId + "";
                                        elem[j].name = product.name;
                                        if(product.sellingPoint){
                                            elem[j].sellingPoint = Packages.net.xinshi.isone.commons.TextUtil.cleanHTML(product.sellingPoint,"") + "";
                                        }
                                        var newProductPrices = product.priceValues;
                                        if (newProductPrices) {
                                            var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
                                            if (realPrice) {
                                                var price = parseFloat(realPrice).toFixed(2);
                                                elem[j]["memberPriceString"] = "<i>&yen;</i>" + price;
                                                elem[j]["memberPrice"] = price;
                                                elem[j]["sellableCount"] = newProductPrices[1].sellableCount;
                                                elem[j]["beginDateTime"] = newProductPrices[1].beginDateTime;
                                                elem[j]["endDateTime"] = newProductPrices[1].endDateTime;
                                                elem[j]["priceName"] = newProductPrices[1].priceName;
                                                elem[j]["salesAmount"] = newProductPrices[1].salesAmount;
                                            } else {
                                                elem[j]["memberPriceString"] = "";
                                                elem[j]["memberPrice"] = 0;
                                            }
                                            ;


                                            var marketPrice = newProductPrices[0] && newProductPrices[0].formatUnitPrice;
                                            if (marketPrice) {
                                                var price = parseFloat(marketPrice).toFixed(2);
                                                elem[j]["marketPriceString"] = "￥" + price;
                                                elem[j]["marketPrice"] = price;
                                            }else{
                                                elem[j]["marketPriceString"] = "";
                                                elem[j]["marketPrice"] = 0;
                                            }
                                        }

                                        if (getInventoryProductIds.indexOf(productId) > -1) {
                                            if (productStocks[productId]) {
                                                elem[j]["sellableCount"] = productStocks[productId];
                                            }else{
                                                var jProduct = $.toJavaJSONObject({"objId":product.objId,"merchantId":product.merchantId});
                                                var jProductStock = selfApi.ProductInventoryHelper.getOneProductInventory(jProduct,jProduct["merchantId"]);
                                                productStocks[productId] = jProductStock.optInt(jProduct.optString("objId"));
                                                elem[j]["sellableCount"] = productStocks[productId];
                                            }
                                            //var sellableCount = parseInt(productStocks[productId]);
                                            //var stockWidth = sellableCount > 100 ? 100 : sellableCount;
                                            //elem[j]["stockWidth"] = stockWidth;

                                        }

                                        var pics = ProductService.getPics(product);
                                        if(pics.length > 0){
                                            elem[j]["imgUrl"] = FileService.getRelatedUrl(pics[0].fileId,elem[j]["spec"]);
                                        }


                                        var supplyAndDeliveryDescAttrId = GlobalVariableManagementService.getValueByName("supplyAndDeliveryDescAttrId");//供货发货简述
                                        var countryNameAttrId = GlobalVariableManagementService.getValueByName("countryNameAttrId");//取国旗
                                        var supplyAndDeliveryDesc = "",countryPicUrl = "";
                                        if(product.DynaAttrs){
                                            if(supplyAndDeliveryDescAttrId && product.DynaAttrs[supplyAndDeliveryDescAttrId]){
                                                supplyAndDeliveryDesc = product.DynaAttrs[supplyAndDeliveryDescAttrId].value;
                                            }

                                            if(countryNameAttrId && product.DynaAttrs[countryNameAttrId]){
                                                var value = (product.DynaAttrs[countryNameAttrId].value).trim();
                                                countryPicUrl = GlobalVariableManagementService.getValueByName(value + "_20X20");
                                                if(!countryPicUrl){
                                                    countryPicUrl = GlobalVariableManagementService.getValueByName(value);
                                                }
                                            }

                                        }

                                        elem[j].supplyAndDeliveryDesc = supplyAndDeliveryDesc;
                                        elem[j].countryPicUrl = countryPicUrl;


                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            $.log(e);
        }
    });

})(dataProcessor);
