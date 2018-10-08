//#import Util.js
//#import product.js
//#import column.js
//#import inventory.js
//#import login.js
//#import file.js
//#import pigeon.js

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){
        var userId = LoginService.getFrontendUserId();
        if(!userId){
            userId = "-1";
        }
        var id = $.params.id;
        var mid = $.params.mid||pageData._m_;
        var jProduct=ProductService.getProduct(id);

        jProduct.marketPrice=ProductService.getMarketPrice(jProduct)||"暂无价格";
//        jProduct.memberPrice=ProductService.getMemberPrice(jProduct)||"暂无价格";
//        jProduct.salesAmount=ProductService.getSalesAmount(id)||0;

        var columnId = jProduct.columnId;

        var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
        var newProductPrices = ProductService.getPriceValueList(id, userId, mid, 1, cxt, "normalPricePolicy");
        var realPrice = {};
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
            //jProduct.sellableCount = inventory.sellableCount;
            jProduct.sellableCount = inventory.zeroSellCount;
            $.log(inventory.toSource())
        }

        var isCanBeBuy = ProductService.isCanBeBuy(jProduct);

        //同款属性
        var sameStyleProduct = {};
        if(true){
            var sameStyleAttr;
            if(columnId){
                var jTemplate = ColumnApi.DynaAttrUtil.getCompleteAttrTemplateByColumnId(columnId);
                var jSameStyleAttr = ColumnApi.DynaAttrUtil.getSameStyleAttr(jTemplate);
                if(jSameStyleAttr != null){
                    sameStyleAttr = JSON.parse(jSameStyleAttr.toString());
                }
            }

            var sameStyleProducts = [];
            var jSameStyleProducts = Packages.net.xinshi.isone.modules.product.ProductSearchUtil.getProductListByProductId(id,"35X35","/upload/nopic_40.gif");
            if(jSameStyleProducts != null && jSameStyleProducts.size() > 0){
                for(var i=0;i<jSameStyleProducts.size();i++){
                    var jPro = jSameStyleProducts.get(i);
                    sameStyleProducts.push(JSON.parse(jPro.toString()));
                }
                //$.log(sameStyleProducts.toSource())
            }
            sameStyleProduct.list = sameStyleProducts;
            sameStyleProduct.count = sameStyleProducts.length;
            if(sameStyleAttr){
                sameStyleProduct.attrName = sameStyleAttr.name;
            }else{
                sameStyleProduct.attrName = "款型";
            }

        }



        //获取商品优惠规则
        var rules = ProductService.getClassifiedPossibleRules(id,jProduct.merchantId,userId);
        //获取换购和赠品图片
        if(rules){

            if(rules.exchange && false){
                for(var i=0;i<rules.exchange.length;i++){
                    var lowPriceBuyProducts=rules.exchange[i].lowPriceBuyProducts;
                    if(lowPriceBuyProducts){
                        for(var j=0;j<lowPriceBuyProducts.length;j++){
                            var exchangeProduct=ProductService.getProduct(lowPriceBuyProducts[j].id);
                            var exchangeProductPic=ProductService.getPics(exchangeProduct);
                            if(exchangeProductPic.length>0){
                                var relatedUrl=FileService.getRelatedUrl(exchangeProductPic[0].fileId,"25X25");
                            }else{
                                var relatedUrl="/upload/nopic_40.jpg";
                            }
                            rules.exchange[i].lowPriceBuyProducts[j].pic=relatedUrl;
                            rules.exchange[i].lowPriceBuyProducts[j].merchantId=exchangeProduct.merchantId;
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
                            var presentProductPic=ProductService.getPics(presentProduct);
                            if(presentProductPic.length>0){
                                var relatedUrl=FileService.getRelatedUrl(presentProductPic[0].fileId,"25X25");
                            }else{
                                var relatedUrl="/upload/nopic_40.gif";
                            }
                            rules.gift[i].presentProducts[j].pic=relatedUrl;
                            rules.gift[i].presentProducts[j].merchantId=presentProduct.merchantId;
                        }
                    }
                }
            }
        }


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



        setPageDataProperty(pageData,"product",jProduct);
        setPageDataProperty(pageData,"productRules",rules);
        setPageDataProperty(pageData,"productId",id);
        setPageDataProperty(pageData,"skus",JSON.stringify(validSkus));
        setPageDataProperty(pageData,"inventoryAttrs",JSON.stringify(inventoryAttrs));

        setPageDataProperty(pageData,"merchantId",mid);//商家id
        setPageDataProperty(pageData,"userId",userId);//用户id
        setPageDataProperty(pageData,"isCanBeBuy",isCanBeBuy);
        setPageDataProperty(pageData,"sameStyleProduct",sameStyleProduct);

    });
})(dataProcessor);