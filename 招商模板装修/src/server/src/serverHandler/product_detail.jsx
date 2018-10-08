//#import Util.js
//#import credit.js
//#import product.js
//#import productCredit.js
//#import file.js
//#import column.js
//#import appraise.js
//#import message.js
//#import commend.js
//#import price.js
//#import inventory.js
//#import login.js
//#import pageManager.js
//#import sysArgument.js
//#import ProductUtil.js
//#import user.js
//#import merchant.js
//#import $hdLouPanDirectBuy:services/GiftProductService.jsx
//#import  $FavoriteProduct:services/FavoriteProductService.jsx

(function () {
    try{
        //加入浏览历史
        var id = $.params.id;
        var spec = $.params.spec || "640X640";
        var appraisePage = $.params.appraisePage || "1";
        var pageNumber = $.params.pageNumber || 5;
        var productJso = {};
        var jProduct = ProductService.getProduct(id);
        productJso.id = id;
        productJso.columnId=jProduct.columnId;

        var start=0;
        var pageLimit=10;
        var userId = LoginService.getFrontendUserId();

        if(userId){
            var result={};
            var IsShow=false;
            if(productJso.columnId=="c_120000"){
                var totalRecords = GiftProductService.getAllGiftProductListSize(userId);
                var listData = GiftProductService.getAllGiftProductList(userId, start, totalRecords||pageLimit);
                if(listData&&listData.length>0){
                    for(var x=0;x< listData.length;x++ ){
                        var valueId=listData[x].productId;
                        if(id==valueId){
                            IsShow=true;
                            break;
                        }
                    }
                }
            }

        }
        var isCanBuy=false;
        var  isCanBuy1=ProductUtilService.checkProductBelongCategory(id,"c_50019");
        var isCanBuy2=ProductUtilService.checkProductBelongCategory(id,"c_50156");
        var isCanBuy3=ProductUtilService.checkProductBelongCategory(id,"c_50068");
        var isCanBuy4=ProductUtilService.checkProductBelongCategory(id,"c_50008");
        if(isCanBuy3||isCanBuy1||isCanBuy2||isCanBuy4){
            isCanBuy=true;
        }
        productJso.isCanBuy=isCanBuy;
        var isCanBeBuy = ProductService.isCanBeBuy(jProduct);
        var combiType = jProduct.combiType;
        if (combiType == "1") {
            var cxt = "{isCombi:\"true\",attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true}]}";
        } else {
            var cxt = "{attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true}]}";
        }

        var priceList = ProductService.getPriceValueList(id, userId, jProduct.merchantId, 1, cxt, 'normalPricePolicy');

        var memberPrice = (priceList[0] && priceList[0].formatTotalPrice) || "暂无价格";
        var marketPrice = (priceList[1] && priceList[1].formatTotalPrice) || "暂无价格";
        var savePrice = 0;
        if (memberPrice != "暂无价格" && marketPrice != "暂无价格") {
            savePrice = Number(priceList[1] && priceList[1].formatTotalPrice) - Number(priceList[0] && priceList[0].formatTotalPrice);
        }
        if (memberPrice != "暂无价格") {
            productJso.memberPrice = "¥" + memberPrice;
        }
        if (memberPrice != "暂无价格") {
            productJso.marketPrice = "¥" + marketPrice;
        }
        productJso.savePrice = savePrice;
        productJso.salesAmount = ProductService.getSalesAmount(id) || 0;
        /*获取商家信息*/
        var merchantObj = MerchantService.getMerchant(jProduct.merchantId);
        var merchantCredit = CreditService.getCredit(jProduct.merchantId);
        if (merchantObj) {
            productJso.merchantCredit = merchantCredit;
            productJso.merchantId = merchantObj.objId;
            productJso.merchantName = merchantObj.name_cn;
        }
        //获取登录用户信息
        var user = LoginService.getFrontendUser();

        //获取图片列表
        var pics = ProductService.getPics(jProduct);
        var realPices = [];
        for (var i = 0; i < pics.length; i++) {
            var relatedUrl = FileService.getRelatedUrl(pics[i].fileId, spec);
            realPices.push(relatedUrl);
        }
        productJso.pics = realPices;
        productJso.name = jProduct.htmlname;
        //获取商品属性
        productJso.displayAttrs = ProductService.getProductAttrs(jProduct);
        //商品信用对象
        var jCredit = ProductCreditService.getCredit(id);
        var credit = {};
        //获取可卖数
        var skus = ProductService.getSkusAndAttrs(id);
        if (skus.length == 1) {
            productJso.skuId = skus[0].id;
            var inventory = InventoryService.getSkuInventory(id, jProduct.skuId);
            productJso.sellableCount = inventory && inventory.sellableCount;
        }
        for (var i = 0; i < skus.length; i++) {
            var sku = skus[i];
            var inventory = InventoryService.getSkuInventory(id, sku.id);
            sku.sellableCount = inventory && inventory.sellableCount;
        }
        productJso.skus = skus;

        var content = "";
        if(jProduct.content){
            content = jProduct.content;
        }else {
            content = jProduct.mobileContent;
        }
        productJso.content = content;
        //获取商品优惠规则
        if (user == null) {
            user = {};
        }
        var rules = ProductService.getClassifiedPossibleRules(id, jProduct.merchantId, user.id || "-1");
        //获取换购和赠品图片
        if (rules) {
            if (rules.exchange) {
                for (var i = 0; i < rules.exchange.length; i++) {
                    var lowPriceBuyProducts = rules.exchange[i].lowPriceBuyProducts;
                    if (lowPriceBuyProducts) {
                        for (var j = 0; j < lowPriceBuyProducts.length; j++) {
                            var exchangeProduct = ProductService.getProduct(lowPriceBuyProducts[j].id);
                            var exchangeProductPic = ProductService.getPics(exchangeProduct);
                            if (exchangeProductPic.length > 0) {
                                var relatedUrl = FileService.getRelatedUrl(exchangeProductPic[0].fileId, "40X40");
                            } else {
                                var relatedUrl = "/upload/nopic_200.jpg";
                            }
                            rules.exchange[i].lowPriceBuyProducts[j].pic = relatedUrl;
                        }
                    }
                }
            }
            if (rules.gift) {
                for (var i = 0; i < rules.gift.length; i++) {
                    var presentProducts = rules.gift[i].presentProducts;
                    if (presentProducts) {
                        for (var j = 0; j < presentProducts.length; j++) {
                            var presentProduct = ProductService.getProduct(presentProducts[j].id);
                            var merchantId = presentProduct.merchantId;
                            var presentProductPic = ProductService.getPics(presentProduct);
                            if (presentProductPic.length > 0) {
                                var relatedUrl = FileService.getRelatedUrl(presentProductPic[0].fileId, "40X40");
                            } else {
                                var relatedUrl = "/upload/nopic_200.jpg";
                            }
                            rules.gift[i].presentProducts[j].pic = relatedUrl;
                            rules.gift[i].presentProducts[j].merchantId = merchantId;
                        }
                    }
                }
            }
        }

        //获取评价内容
        var appraisSearchArgs = {
            "productId": id,
            "effect": "true",
            "searchIndex": true,
            "doStat": true,
            "page": appraisePage,
            "limit": pageNumber,
            "logoSize": "60X60"
        };
        var appraisSearchResult = AppraiseService.getProductAppraiseList(appraisSearchArgs);
        productJso.appraisCount = appraisSearchResult && appraisSearchResult.recordList && appraisSearchResult.recordList.length || 0;
        productJso.appraislevel = ProductCreditService.getAverageTotalDescStore(jCredit) * 2 * 10;

        //获取商品的sku
        var skus = ProductService.getSkus(id);
        var inventoryAttrs = ProductService.getInventoryAttrs(jProduct, "140X140");
        var validSkus = [];
        var headSkus = {};
        if (skus.length > 1) {
            skus.forEach(function (sku) {
                if (!sku.isHead) {
                    validSkus.push(sku);
                } else {
                    headSkus = (sku);
                }
            });
        }
        else if (skus.length == 1) {
            validSkus.push(skus[0]);
            headSkus = skus[0]
        }
        var onceMustBuyCount = 1;
        onceMustBuyCount = ProductService.getOnceMustBuyCount(id, headSkus.id);
        productJso.onceMustBuyCount = onceMustBuyCount;
        //是否收藏商品
        var isFavor=FavoriteProductService.getFavoriteByProductId(id,userId);
        productJso.isFavor = isFavor;

        result = {
            state: "ok",
            product: productJso,
            rules: rules,
            inventoryAttrs: inventoryAttrs,
            user:userId

        }
        if(IsShow){
            result.IsShow=IsShow;
        }
        out.print(JSON.stringify(result));
    }catch(e){
        $.log(e)
    }


})();