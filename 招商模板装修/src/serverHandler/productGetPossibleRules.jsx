//#import Util.js
//#import product.js
//#import file.js
//#import login.js

;(function(){
    try{
        var id = $.params.id;
        if(!id){
            out.print(JSON.stringify({"state":false}));
            return;
        }

        var userId = LoginService.getFrontendUserId();
        if(!userId){
            userId = "-1";
        }
        var jProduct=ProductService.getProduct(id);
        //获取商品优惠规则
        var rules = ProductService.getClassifiedPossibleRules(id,jProduct.merchantId,userId);
        //获取换购和赠品图片
        if(rules){

            if(rules.coupon){
                var typeAndName = {"pdf":"运费优惠","php":"送积分","pds":"满减","pgc":"送券","pnds":"第N件优惠","ods":"满减","odf":"运费优惠","OGC":"送券","puc":"用券","OUC":"用券"};
                for(var i=0;i<rules.coupon.length;i++){
                    rules.coupon[i].typeName = typeAndName[rules.coupon[i].type];
                }
            }

            if(rules.moreCoupon){
                var typeAndName = {"puc":"用券","OUC":"用券"};
                for(var i=0;i<rules.moreCoupon.length;i++){
                    rules.moreCoupon[i].typeName = typeAndName[rules.moreCoupon[i].type];
                }
            }

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
                                var relatedUrl=FileService.getRelatedUrl(presentProductPic[0].fileId,"40X40");
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

        var result ={
            state:true,
            productRules:rules
        }

        out.print(JSON.stringify(result));
    }catch(e){
        var ret = {
            state:false
        }
        $.log(e);
        out.print(JSON.stringify(ret));
    }
})();