//#import Util.js
//#import product.js
//#import buyAlsoBuy.js
//#import viewAlsoView.js
//#import file.js
//#import inventory.js
//#import commend.js
//#import price.js

;(function(){
        var id = $.params.id;
        var mid = $.params.mid
        var ret={};
        var productProcess=function(productList,imgSize){
            var newProductList=[];
            for(var i=0;i<productList.length;i++){
                var newProduct={};
                var oldProduct=productList[i];
                newProduct.id=oldProduct.objId;
                newProduct.name=oldProduct.name;
                newProduct.sellingPoint=oldProduct.sellingPoint
                newProduct.merchantId=oldProduct.merchantId;
                if(!oldProduct.price){
                    var priceObj=priceService.getPrice(oldProduct.priceId);
                    oldProduct.price=priceObj;
                }
                newProduct.marketPrice=ProductService.getMarketPrice(oldProduct)||"暂无价格";
                newProduct.memberPrice=ProductService.getMemberPrice(oldProduct)||"暂无价格";
                var pics=ProductService.getPics(oldProduct);
                var realPices=[];
                for(var j=0;j<pics.length;j++){
                    var relatedUrl=FileService.getRelatedUrl(pics[j].fileId,imgSize||"350X350");
                    realPices.push(relatedUrl);
                }
                newProduct.pics=realPices;
                newProduct.salesAmount=ProductService.getSalesAmount(oldProduct.objId)||0;
                var skus=ProductService.getSkus(oldProduct.objId);
                if(skus.length==1){
                    newProduct.skuId=skus[0].id;
                    var inventory = InventoryService.getSkuInventory(oldProduct.objId,newProduct.skuId);
                    newProduct.sellableCount = inventory.sellableCount;
                }
                newProductList.push(newProduct);
            }
            return newProductList;
        }
        //获取买过又买的数据
        var buyAlsoBuyIds=ViewAlsoViewService.getViewAlsoView(id);
        var buyAlsoBuyList=[];
        for(var i=0;i<buyAlsoBuyIds.size();i++){
            buyAlsoBuyList.push(ProductService.getProduct(buyAlsoBuyIds.get(i)));
        }
        var buyAlsoBuy=productProcess(buyAlsoBuyList,"350X350");
        if(buyAlsoBuy.length==0){
            //获取购买过该商品的还购买过的商品列表(后台推荐)
            var commendList=commendService.getCommendObjectList(mid,id,"historyBuy",10);
           buyAlsoBuy=productProcess(commendList,"350X350");
        }
        ret.state="ok";
        ret.result=buyAlsoBuy;
        out.print(JSON.stringify(ret));

})();