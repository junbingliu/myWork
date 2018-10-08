//#import Util.js
//#import login.js
//#import product.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js
//#import merchant.js
//#import app.js
//#import $GlobalVariableManagementApp:services/globalVariableManagementService.jsx

(function (processor) {


    processor.on("all",function(pageData,dataIds,elems){

        var user = LoginService.getFrontendUser();
        var alreadyLogin = false,loggedUserName = "";
        if(user!=null){
            alreadyLogin = true;
            if(user.realName){
                loggedUserName = user.realName;
            }else if(user.loginId){
                loggedUserName = user.loginId;
            }else{
                loggedUserName = user.id;
            }
        }
        setPageDataProperty(pageData,"alreadyLogin",alreadyLogin);
        setPageDataProperty(pageData,"loggedUserName",loggedUserName + "");
        setPageDataProperty(pageData,"commonCss",true);

        //判断浏览器缓存
        if(pageData.productionMode && false) {
            if (pageData.config && pageData.config.cacheControlTime && pageData.config.cacheControlTime.value != "") {
                var cacheControlTime = Number(pageData.config.cacheControlTime.value);
                if (cacheControlTime && cacheControlTime > 0) {
                    //var notModified = false;
                    //var prevModified = request.getDateHeader("If-Modified-Since");
                    var pageLastModified = -1;//记录的页面最后修改时间，毫秒数。
                    if (pageData.lastModified) {
                        //var sdf = new Packages.java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        //var dateTime = sdf.parse(parseInt(pageData.lastModified));
                        //pageLastModified = dateTime.getTime();
                        pageLastModified = parseInt(pageData.lastModified);
                    }

                    //if (prevModified > 0 && pageLastModified > 0) {
                    //    if (prevModified == pageLastModified) {
                    //        //如果请求头的最后修改时间等于服务端记录的最后修改时间
                    //        //判断有没有超出缓存时间
                    //        if (new Date().getTime() - prevModified <= cacheControlTime * 1000) {
                    //            //未过期了
                    //            notModified = true;
                    //        }
                    //    }
                    //}
                    response.setHeader("Cache-Control", "max-age=" + pageData.config.cacheControlTime.value);//max-age=7200
                    if(pageLastModified > 0){
                        var sdf = new Packages.java.text.SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Packages.java.util.Locale.US);
                        sdf.setTimeZone(Packages.java.util.TimeZone.getTimeZone("GMT"));
                        response.setHeader("Last-Modified", sdf.format(pageLastModified));
                        //response.setHeader("Expires",sdf.format(new Packages.java.util.Date().getTime() + (cacheControlTime * 1000)));
                    }
                    //if (notModified) {
                    //    response.setStatus(304);
                    //    return;
                    //} else {
                    //
                    //}
                }
            }
        }
        //判断浏览器缓存 end



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
        setPageDataProperty(pageData,"appMd5",appMd5);
        
        
        var showFloor = {};
        var showLevel = "1,2,3,4,5";
        if(pageData.config && pageData.config.showLevel && pageData.config.showLevel.value){
            showLevel = pageData.config.showLevel.value;
        }
        if(showLevel){
            var levelSplit = showLevel.split(",");
            if(levelSplit.length > 0){
                for(var f=0;f < levelSplit.length;f++){
                    showFloor[levelSplit[f]] = true;
                }
            }
            
        }
        setPageDataProperty(pageData,"showFloor",showFloor);



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

            //var kuajingLogoUrl = "";
            //var app = AppService.getApp(rappId);
            //var fileId = Packages.net.xinshi.isone.modules.appmarket.Is1AppMarketEngine.appPages.getResFileId(app.md5, "res/images/kuajing.png");
            //if(fileId) {
            //    var kuajingLogoUrl = selfApi.Is1AppMarketEngine.appPages.getUrlFromFileId(fileId, "");
            //    if(kuajingLogoUrl){
            //        kuajingLogoUrl = kuajingLogoUrl + "";
            //    }
            //}
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
                                for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                                    var product = versionList[k];
                                    if (productId == product.objId) {
                                        elem[j].merchantId = product.merchantId + "";
                                        elem[j].name = product.name;
                                        if(product.sellingPoint){
                                            elem[j].sellingPoint = Packages.net.xinshi.isone.commons.TextUtil.cleanHTML(product.sellingPoint,"") + "";
                                        }
                                        //if(product.promotionLogosArray.length > 0){
                                        //    elem[j].promotionLogo = product.promotionLogosArray[0];
                                        //}

                                        var merchant =  MerchantService.getMerchant(product.merchantId);
                                        if(merchant.mainColumnId == "c_cross_border_merchant"){
                                            if(kuajingLogoUrl){
                                                var pLogo = {realPath:kuajingLogoUrl};
                                                elem[j].promotionLogo = pLogo;
                                            }
                                        }


                                        var newProductPrices = product.priceValues;

                                        if (newProductPrices) {
                                            var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
                                            if (realPrice) {
                                                var price = parseFloat(realPrice).toFixed(2);
                                                elem[j]["memberPriceString"] = "<i>&yen;</i>" + price;
                                                elem[j]["memberPrice"] = price;
//                                                elem[j]["sellableCount"] = newProductPrices[1].sellableCount;
                                                elem[j]["beginDateTime"] = newProductPrices[1].beginDateTime;
                                                elem[j]["endDateTime"] = newProductPrices[1].endDateTime;
                                                elem[j]["priceName"] = newProductPrices[1].priceName;
                                                elem[j]["salesAmount"] = newProductPrices[1].salesAmount;
                                            } else {
                                                elem[j]["memberPriceString"] = "";
                                                elem[j]["memberPrice"] = 0;
                                            }
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
                                        elem[j].salesAmount = ProductService.getSalesAmount(productId)||0;

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

//    processor.on("#groupOn", function (pageData, dataIds, elems) {
//        var selfApi = new JavaImporter(
//            Packages.net.xinshi.isone.modules,
//            Packages.net.xinshi.isone.modules.product.inventory,
//            Packages.org.json
//        );
//        var elem = elems[0][0];
//        if(elem){
//            var productId = elem.id;
//            var jProduct = selfApi.IsoneModulesEngine.productService.getProduct(productId);
//            var jProductStock = selfApi.ProductInventoryHelper.getOneProductInventory(jProduct,jProduct.optString("merchantId"));
//            elem["sellableCount"] = jProductStock.optInt(jProduct.optString("objId"));
//        }
//    });

})(dataProcessor);
