//#import Util.js
//#import product.js
//#import productCredit.js
//#import credit.js
//#import file.js
//#import column.js
//#import appraise.js
//#import message.js
//#import merchant.js
//#import commend.js
//#import price.js
//#import inventory.js
//#import ViewHistory.js
//#import login.js
//#import pageManager.js
//#import bom.js
//#import buyAlsoBuy.js
//#import viewAlsoView.js
//#import sysArgument.js
//#import pigeon.js
//#import json2.js
//#import @process/sample_product_json.jsx
//#import $GlobalVariableManagementApp:services/globalVariableManagementService.jsx
//#import  $FavoriteProduct:services/FavoriteProductService.jsx

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){

        //if(pageData.config && pageData.config.cacheControlTime && pageData.config.cacheControlTime.value !=""){
        //    response.setHeader("Cache-Control", "max-age=3600");//max-age=3600
        //}


        //加入浏览历史
        ViewHistoryService.addProductViewHistory();
        var id = $.params.id;
        var mid = $.params.mid|| $.params.m;
        var spec = $.params.spec||"470X470";
        var messagePage = $.params.messagePage||"1";
        var enquiryType = $.params.enquiryType||"";

        var jProduct=ProductService.getProduct(id);
        if((!pageData.productionMode) && !jProduct){
            //后台装修用的
            jProduct = sampleProductJson;
        }

        if(false){
            var merchantDomain = SysArgumentService.getSysArgumentStringValue("head_merchant",'col_sysargument','merchantDomain');
            if(merchantDomain && merchantDomain != ""){
                var splitStr1 = merchantDomain.split(",");
                for(var i=0;i<splitStr1.length;i++){
                    var splitStr2 = splitStr1[i].split(":");
                    if(splitStr2.length == 2){
                        if(!mid){
                            mid = jProduct.merchantId;
                        }
                        if(splitStr2[0] == mid){
                            response.sendRedirect("http://" + splitStr2[1] + "/product.html?id=" + id + "&mid=" + mid);
                            return false;
                        }
                    }
                }
            }
        }

        jProduct.marketPrice=ProductService.getMarketPrice(jProduct)||"暂无价格";
        jProduct.memberPrice=ProductService.getMemberPrice(jProduct)||"暂无价格";
        jProduct.salesAmount=ProductService.getSalesAmount(id)||0;

        mid = mid||jProduct.merchantId;
        var columnId = jProduct.columnId;

        //获取登录用户信息
        var userId = LoginService.getFrontendUserId();
        if(!userId){
            userId = "-1";
        }

        var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
        var newProductPrices = ProductService.getPriceValueList(id, userId, mid, 1, cxt, "normalPricePolicy");
        var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
        if (realPrice) {
            var price = parseFloat(realPrice).toFixed(2);
            var memberPrice = {};
            memberPrice["price"]=price;
            memberPrice["beginDateTime"] = newProductPrices[1].beginDateTime;
            memberPrice["endDateTime"] = newProductPrices[1].endDateTime;
            memberPrice["priceName"] = newProductPrices[1].priceName;
            memberPrice["limitCount"] = newProductPrices[1].limitCount;
            jProduct.realPrice=memberPrice;
        }else{
            var price = parseFloat(0);
            jProduct.realPrice = {"price":price};
        }

        //获取商品的sku
        var skus = ProductService.getSkus(id);
        var inventoryAttrs = ProductService.getInventoryAttrs(jProduct,"140X140");
        if(inventoryAttrs && inventoryAttrs.length > 0){
            for(var i=0;i<inventoryAttrs.length;i++){
                if(inventoryAttrs[i].userOperation == ""){}
            }
        }
        var validSkus =[];
        if(skus.length>1){
            skus.forEach(function(sku){
                if(!sku.isHead){
                    validSkus.push(sku);
                }
            });
        }
        else if(skus.length==1){
            validSkus.push(skus[0]);
        }

        //获取可卖数
        if(skus.length==1){
            jProduct.skuId=skus[0].id;
            var inventory = InventoryService.getSkuInventory(id,jProduct.skuId);
            jProduct.sellableCount = inventory.sellableCount;
        }
        var isCanBeBuy = ProductService.isCanBeBuy(jProduct);


        //获取商家信息
//        var merchantInfo=MerchantService.getMerchant(mid);
//        var merchantCredit=CreditService.getCredit(mid);
//        merchantInfo.merchantCredit=merchantCredit;

        //获取面包线数据
        var jColumn = {};
        if(columnId){
            jColumn=ColumnService.getColumn(jProduct.columnId);
        }
        var position=[];
        if(jColumn){
            position=ColumnService.getProductColumnPath(jColumn,true);
        }
        var sameLevelColumns = [];
        if(position && position.length > 0){
            if(position.length == 1){
                sameLevelColumns = ColumnService.getChildren(position[0].id);
            }else{
                sameLevelColumns = ColumnService.getChildren(position[position.length - 2].id);
            }
        }


        if(jProduct.combiType){
            position.push({name:"组合套餐"});
        }
        //获取图片列表
        var pics=ProductService.getPics(jProduct);

        var realPices={"normalPics":[],"bigPics":[],"smallPics":[],"pics180":[]};
        for(var i=0;i<pics.length;i++){
            var relatedUrl=FileService.getRelatedUrl(pics[i].fileId,spec);
            var bigRelatedUrl=FileService.getRelatedUrl(pics[i].fileId,"800X800");
            var smallRelatedUrl=FileService.getRelatedUrl(pics[i].fileId,"100X100");
            var relatedUrl_140=FileService.getRelatedUrl(pics[i].fileId,"140X140");
            realPices.normalPics.push(relatedUrl);
            realPices.bigPics.push(bigRelatedUrl);
            realPices.smallPics.push(smallRelatedUrl);
            realPices.pics180.push(relatedUrl_140);
        }
        jProduct.pics=realPices;

        //获取商品属性
        jProduct.displayAttrs = ProductService.getProductAttrs(jProduct);
        //if(jProduct.displayAttrs.length > 0){
        //    for(var i=0;i<jProduct.displayAttrs.length;i++){
        //        if(jProduct.displayAttrs[i].id == "attr_product_notice" || jProduct.displayAttrs[i].id == "attr_product_service"){
        //            jProduct.displayAttrs.splice(i,1);
        //            break;
        //        }
        //    }
        //
        //
        //}


        var supplyAndDeliveryDescAttrId = GlobalVariableManagementService.getValueByName("supplyAndDeliveryDescAttrId");//供货发货简述
        var countryNameAttrId = GlobalVariableManagementService.getValueByName("countryNameAttrId");//取国旗

        var supplierDescAttrId = GlobalVariableManagementService.getValueByName("supplierDescAttrId");//取供货商说明
        var tariffDescAttrId = GlobalVariableManagementService.getValueByName("tariffDescAttrId");//取关税说明

        if(jProduct.DynaAttrs){
            if(supplyAndDeliveryDescAttrId && jProduct.DynaAttrs[supplyAndDeliveryDescAttrId]){
                jProduct.supplyAndDeliveryDesc = jProduct.DynaAttrs[supplyAndDeliveryDescAttrId].value;
            }

            if(countryNameAttrId && jProduct.DynaAttrs[countryNameAttrId]){
                var value = (jProduct.DynaAttrs[countryNameAttrId].value).trim();
                var countryPicUrl = GlobalVariableManagementService.getValueByName(value + "_20X20");
                if(!countryPicUrl){
                    countryPicUrl = GlobalVariableManagementService.getValueByName(value);
                }
                jProduct.countryPicUrl = countryPicUrl;
            }

            if(supplierDescAttrId && jProduct.DynaAttrs[supplierDescAttrId]){
                jProduct.supplierDesc = jProduct.DynaAttrs[supplierDescAttrId].value;
            }

            if(tariffDescAttrId && jProduct.DynaAttrs[tariffDescAttrId]){
                jProduct.tariffDesc = jProduct.DynaAttrs[tariffDescAttrId].value;
            }

        }



        //商品信用对象
        var jCredit=ProductCreditService.getCredit(id);
        var credit={};
        //平均得分
        credit.averageDescStore=ProductCreditService.getAverageTotalDescStore(jCredit);
        //评价数量
        credit.descAmount=ProductCreditService.getDescAmount(jCredit);
        //好评率
        credit.positiveCommentRate=ProductCreditService.getPositiveCommentRate(jCredit);
        //中评率
        credit.moderateCommentRate=ProductCreditService.getModerateCommentRate(jCredit);
        //差评率
        credit.negativeCommentRate=ProductCreditService.getNegativeCommentRate(jCredit);


        if(true){
            var prefix = "limitBuy";
            var data = ps20.getContent(prefix + "_" + id);
            if(data){
                data = JSON.parse(data);
            }
            var config =  data || {minNumber:-1,maxNumber:-1};
            setPageDataProperty(pageData,"limitBuyConfig",config);
            setPageDataProperty(pageData,"limitBuyConfigStr",JSON.stringify(config));
        }



        //获取商品咨询
        var messageSearchArgs = {"productId":id,"certifyState":"1","page":messagePage,"limit":20,"enquiryType":enquiryType};
        var messageSearchResult = MessageService.getProductEnquiry(id,enquiryType,messageSearchArgs);


        var productProcess=function(productList,imgSize){
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
                newProduct.marketPrice=ProductService.getMarketPrice(productList[i])||"";
                newProduct.memberPrice=ProductService.getMemberPrice(productList[i])||"";
                var pics=ProductService.getPics(productList[i]);
                var realPices=[];
                for(var j=0;j<pics.length;j++){
                    var relatedUrl=FileService.getRelatedUrl(pics[j].fileId,imgSize||"140X140");
                    realPices.push(relatedUrl);
                }
                newProduct.pics=realPices;
                newProduct.salesAmount=ProductService.getSalesAmount(productList[i].objId)||0;
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
                var promotionLogosList = ProductService.getProductPromotionLogo($.toJavaJSONObject(productList[i]), sysArgumentPromotionLogo);
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

        //判断商品是否收藏
        var isFavorite=false;
        if(userId){
            var Favorite=FavoriteProductService.getFavoriteByProductId(jProduct.objId,userId);
            if(Favorite){
                isFavorite=true;
            }

        }


        //获取浏览记录
//        var viewHistory=ViewHistoryService.getProductViewHistory(4);
//        var viewHistoryProducts=productProcess(viewHistory,"180X180");
        var viewHistoryProducts = [];


        //获取最佳组合
        var bestCommendList=commendService.getCommendObjectList(mid,id,"combination",50);
        var bestCommend=productProcess(bestCommendList,"180X180");

        //获取超值组合
        if(jProduct.combiType==1){
            //当前商品是组合套餐
            var mealList=[];
            var boms=bomService.getListByObjid(id);
            mealList.push({boms:boms});
        }else{
            var mealList=bomService.getCBNListByProductId('col_m_Promotional_004',mid,id,-1);
        }
        for(var i=0;i<mealList.length;i++){
            var bomObj=mealList[i];
            var cxt='{isGetInventory:\"true\",isCombi:\"true\",attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true},{factory:UGF,isGroup:true,entityId:c_101},{factory:UGF,isGroup:true,entityId:c_102},{factory:UGF,isGroup:true,entityId:c_103}]}';
//            bomObj.price=ProductService.getPriceValueList(bomObj.objId,'',bomObj.merchantId||mid,1,cxt,'normalPricePolicy');
            var boms=bomObj.boms;//套餐内商品
            for(var j=0;j<boms.length;j++){
                var productId=boms[j].relObjId;
                boms[j].product=ProductService.getProduct(productId);
                boms[j].product.memberPrice=ProductService.getMemberPrice(boms[j].product)||"暂无价格";
                var pics=ProductService.getPics(boms[j].product);
                var realPices=[];
                for(var i=0;i<pics.length;i++){
                    var relatedUrl=FileService.getRelatedUrl(pics[i].fileId,"180X180");
                    realPices.push(relatedUrl);
                }
                boms[j].product.pics=realPices;
            }
            bomObj.boms=boms;
        }


        //获取商品优惠规则

        var rules=ProductService.getClassifiedPossibleRules(id,jProduct.merchantId,userId||"-1");

        //获取换购和赠品图片
        if(rules){
            if(rules.exchange){
                for(var i=0;i<rules.exchange.length;i++){
                    var lowPriceBuyProducts=rules.exchange[i].lowPriceBuyProducts;
                    if(lowPriceBuyProducts){
                        for(var j=0;j<lowPriceBuyProducts.length;j++){
                            var exchangeProduct=ProductService.getProduct(lowPriceBuyProducts[j].id);
                            var exchangeProductPic=ProductService.getPics(exchangeProduct);
                            if(exchangeProductPic.length>0){
                                var relatedUrl=FileService.getRelatedUrl(exchangeProductPic[0].fileId,"40X40");
                            }else{
                                var relatedUrl="/upload/nopic_200.jpg";
                            }
                            rules.exchange[i].lowPriceBuyProducts[j].pic=relatedUrl;
                        }
                    }
                }
            }
            if(rules.gift){
                for(var i=0;i<rules.gift.length;i++){
                    var presentProducts=rules.gift[i].presentProducts;
                    if(presentProducts){
                        for(var j=0;j<presentProducts.length;j++){
                            var presentProduct=ProductService.getProduct(presentProducts[j].id);
                            var merchantId = presentProduct.merchantId;
                            var presentProductPic=ProductService.getPics(presentProduct);
                            if(presentProductPic.length>0){
                                var relatedUrl=FileService.getRelatedUrl(presentProductPic[0].fileId,"40X40");
                            }else{
                                var relatedUrl="/upload/nopic_200.jpg";
                            }
                            rules.gift[i].presentProducts[j].pic=relatedUrl;
                            rules.gift[i].presentProducts[j].merchantId=merchantId;
                        }
                    }
                }
            }
        }



        var seo={};
        //获取所有同级的分类
        var allChildrenColumn=[];
        if(jColumn){
            allChildrenColumn=ColumnService.getChildren(jColumn.parentId);
        }
        var seoColumnNames="";
        for(var i=0;i<allChildrenColumn.length;i++){
            seoColumnNames+=allChildrenColumn[i].name+",";
        }

        //用于seo得商品属性
        var seoProductAttr="";
        for(var i=0;i<jProduct.displayAttrs.length;i++){
            seoProductAttr+=jProduct.displayAttrs[i].name+":"+jProduct.displayAttrs[i].value;
        }
        //商品SEO优化
        var webName = SysArgumentService.getSysArgumentStringValue("head_merchant",'col_sysargument','webName_cn');
        if(!jProduct.seo_keywords){
            var seo_keywords=jProduct.name+"-"+webName+","+seoProductAttr+","+seoColumnNames;
            seo.seo_keywords=seo_keywords;
        }else{
            seo.seo_keywords=jProduct.seo_keywords
        }

        if(!jProduct.seo_title){
            var seo_title=jProduct.name+"-"+webName+","+jColumn.name+","+jProduct.name+"报价";
            seo.seo_title=seo_title;
        }else{
            seo.seo_title=jProduct.seo_title
        }
        if(!jProduct.seo_description){
            var seo_description=jProduct.name+"-"+webName+"报价"+seoProductAttr+",销量"+jColumn.name+","+webName+seoColumnNames+"价格优惠";
            seo.seo_description=seo_description;
        }else{
            seo.seo_description=jProduct.seo_description;
        }


        setPageDataProperty(pageData,"product",jProduct);
        setPageDataProperty(pageData,"productId",id);
        setPageDataProperty(pageData,"skus",JSON.stringify(validSkus));
        setPageDataProperty(pageData,"productRules",rules);
        //$.log("ruls==="+JSON.stringify(rules))
        setPageDataProperty(pageData,"inventoryAttrs",JSON.stringify(inventoryAttrs));
        setPageDataProperty(pageData,"credit",credit);
        setPageDataProperty(pageData,"messageList",messageSearchResult);
        setPageDataProperty(pageData,"position",position);//面包线
        setPageDataProperty(pageData,"bestCommend",bestCommend);//最佳组合
        setPageDataProperty(pageData,"bomList",mealList);//组合套餐
        setPageDataProperty(pageData,"viewHistoryProducts",viewHistoryProducts);
        //setPageDataProperty(pageData,"buyAlsoBuy",buyAlsoBuy);//买了又买
        //setPageDataProperty(pageData,"viewAlsoView",viewAlsoView);//看了又看
        setPageDataProperty(pageData,"seo",seo);//seo
        setPageDataProperty(pageData,"webName",webName);//webName
        setPageDataProperty(pageData,"isFavorite",isFavorite);//是否收藏商品
        //$.log("isFavorite===="+isFavorite)
//        setPageDataProperty(pageData,"merchantInfo",merchantInfo);//商家信息
        setPageDataProperty(pageData,"merchantId",mid);//商家id
        setPageDataProperty(pageData,"userId",userId);//用户id
        setPageDataProperty(pageData,"sameLevelColumns",sameLevelColumns);
        setPageDataProperty(pageData,"isCanBeBuy",isCanBeBuy);


        //if(true){
        //    response.setHeader("Cache-Control", "max-age=3600");
        //    var lastModifyTime = jProduct.lastModifyTime;
        //    if(lastModifyTime){
        //        lastModifyTime = parseInt(lastModifyTime);
        //        var sdf = new Packages.java.text.SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss 'GMT'", Packages.java.util.Locale.US);
        //        sdf.setTimeZone(Packages.java.util.TimeZone.getTimeZone("GMT"));
        //        response.setHeader("Last-Modified", sdf.format(lastModifyTime));
        //    }
        //}

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


                                        //var supplyAndDeliveryDescAttrId = GlobalVariableManagementService.getValueByName("supplyAndDeliveryDescAttrId");//供货发货简述
                                        //var countryNameAttrId = GlobalVariableManagementService.getValueByName("countryNameAttrId");//取国旗
                                        //var supplyAndDeliveryDesc = "",countryPicUrl = "";
                                        //if(product.DynaAttrs){
                                        //    if(supplyAndDeliveryDescAttrId && product.DynaAttrs[supplyAndDeliveryDescAttrId]){
                                        //        supplyAndDeliveryDesc = product.DynaAttrs[supplyAndDeliveryDescAttrId].value;
                                        //    }
                                        //
                                        //    if(countryNameAttrId && product.DynaAttrs[countryNameAttrId]){
                                        //        var value = (product.DynaAttrs[countryNameAttrId].value).trim();
                                        //        countryPicUrl = GlobalVariableManagementService.getValueByName(value + "_20X20");
                                        //        if(!countryPicUrl){
                                        //            countryPicUrl = GlobalVariableManagementService.getValueByName(value);
                                        //        }
                                        //    }
                                        //
                                        //}
                                        //
                                        //elem[j].supplyAndDeliveryDesc = supplyAndDeliveryDesc;
                                        //elem[j].countryPicUrl = countryPicUrl;


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