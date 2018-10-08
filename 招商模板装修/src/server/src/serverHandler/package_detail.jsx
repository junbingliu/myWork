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
//#import user.js
//#import merchant.js
//#import $hdLouPanDirectBuy:services/GiftProductService.jsx
//#import $globalUserCacheStore:services/GlobalUserCacheStoreService.jsx

(function () {
    try{
        //加入浏览历史
        var id = $.params.id;
        var combiProductId = $.params.combiProductid;
        var spec = $.params.spec || "640X640";
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

        //记录关联的套餐
        if(userId && combiProductId){
            var tempValues = {};
            tempValues.productId = id;
            tempValues.relationCombiProductId = combiProductId;
            GlobalUserCacheStoreService.addValues(userId, tempValues);
        }

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
        //商品礼包属性id
        var packageId = jProduct&&jProduct.DynaAttrs&&jProduct.DynaAttrs.attr_80000&&jProduct.DynaAttrs.attr_80000.valueId;
        productJso.packageId =packageId;
        //商品礼包详情
        var info = jProduct&&jProduct.DynaAttrs&&jProduct.DynaAttrs.attr_100000&&jProduct.DynaAttrs.attr_100000.value;
        productJso.info =info;

        result = {
            state: "ok",
            product: productJso,
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