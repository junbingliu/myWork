//#import Util.js
//#import product.js
//#import file.js
//#import price.js
//#import column.js
//#import login.js
//#import bom.js
//#import search.js
//#import user.js
//#import $combiproduct:services/CombiProductService.jsx
//#import  $FavoriteCombiProduct:services/FavoriteCombiProductService.jsx

(function () {
    try{
    var userId = LoginService.getFrontendUserId();
    var id = $.params.id;
    var spec = $.params.spec||"160X160";
    var ids = [];
    var item = [];
     var comboProduct = {};
    ids[0] = id;

    //判断商品是否收藏组合套餐
    var isFavorite=false;
    if(userId){
        var Favorite=FavoriteCombiProductService.getFavoriteByProductId(id,userId);
        if(Favorite){
            isFavorite=true;
        }

    }

    var combiProducts = CombiProductService.getCombiProducts(ids);
    var phoneHtml = combiProducts[0].phoneHtml;
    if (!phoneHtml || phoneHtml == "" || phoneHtml == "phone 版详细描述,如果不填则默认取pc版的详细描述。") {
        phoneHtml = combiProducts[0].pcHtml;
    }
    var userId = LoginService.getFrontendUserId();

    var packagePrice=0;
    var isFixedPrice="N";

        if (combiProducts[0] && combiProducts[0].parts) {
            if (userId) {
                //var user = UserService.getUserTopGroupByUserId(userId);
                var us = UserService.getUserGroups(userId);
            }
            if (combiProducts[0].priceRecs && combiProducts[0].priceRecs.length > 0) {

                var combiProduct = combiProducts[0];
                var fixedPrice = combiProduct.fixedPrice;
                if (fixedPrice == "Y") {
                    isFixedPrice="Y";
                    if(!isNaN(combiProduct.priceRecs[0].price)) {
                        packagePrice = (combiProduct.priceRecs[0].price * 1).toFixed(2);
                    }
                } else {
                    if(!isNaN(combiProduct.price)) {
                        packagePrice =(combiProduct.price * 1).toFixed(2);
                    }
                }
            }


        }

        //获取组合商品中的部件
        var combiParts={};//根据标签获取子商品
        var combiPartLists={};//根据部件名称获取子商品
        var tagLists=[];

        var isCanBuy=true;                               //是否能被购买
        if( combiProducts[0].certified!='T'){
            isCanBuy=false;
        }

        var totalSum=0;           //市场价
        var totalNumber=0;           //子商品总数量
        var packagePriceTwo=0;      //子商品会员价和


        for(var x=0;x < combiProducts[0].parts.length;x++){
            var value=combiProducts[0].parts[x];
            var options=value.options;
            var isNeed=false; //是否有默认商品
            for(var z=0;z< options.length;z++){
                options[z].partsName=value.name;
                options[z].partId=value.partId;

                //根据子商品id获取子商品信息
                var s = ProductService.getProduct(options[z].productId);
                if(s){
                    options[z].name = s.name;
                    //获取商品图片
                    //options[z].pics="../res/case/code.png";
                    var imgs=ProductService.getPics(s);
                    if(imgs){
                        if(imgs[0]){
                            var relatedUrl=FileService.getRelatedUrl(imgs[0].fileId,spec);
                            if(relatedUrl){
                                options[z].pics=relatedUrl;
                            }

                        }
                    }

                    //计算子商品的套餐价
                    options[z].price= (options[z].price*options[z].percentage/100).toFixed(2);

                    // 获取子商品市场价
                    var prices=ProductService.getMarketPrice(s);

                    options[z].prices=prices;
                    if(options[z].isDefault){
                        if(!isNaN(prices)) {
                            totalSum += prices * 1 * Number(options[z].num);
                        }
                            totalNumber += 1 * Number(options[z].num);
                        if(!isNaN(options[z].price)) {
                            packagePriceTwo += options[z].price * 1 * Number(options[z].num);
                        }
                        isNeed=true;
                    }
                    if(z==(options.length-1)&&!isNeed){
                        if(!isNaN(options[0].prices)) {
                            totalSum += options[0].prices * 1 * Number(options[0].num);
                        }
                        if(!isNaN(options[0].price)) {
                            packagePriceTwo += options[0].price * 1 * Number(options[0].num);
                        }
                        options[0].isDefault=true;
                        totalNumber+=1*Number(options[0].num);
                    }

                    var state = ProductService.getPublishState(s);
                    options[z].productState=state;
                    if(isCanBuy&&state!="1"){
                        isCanBuy = false;
                    }

                    var skuIds=options[z].skuIds[0];
                    if(!skuIds&&options[z].skuIds[1]){
                        skuIds=options[z].skuIds[1];
                    }
                    //var skuList={};
                    //    获取商品动态属性
                    var skus = ProductService.getSkusAndAttrs(options[z].productId);


                    var skusList = ProductService.getInventoryAttrs(s);
                    var attrs={};
                    for(var h=0;h< skusList.length;h++){
                        attrs[skusList[h].id]=skusList[h].name;
                    }
                    options[z].hasSku=false;
                    for(var k=0;k< skus.length;k++){
                        if(skus[k].id==skuIds){
                            var sku={};
                            sku.skuId=skus[k].id;
                            if(skus[k]&&skus[k].fullAttrs){
                                for(var j=0;j< skus[k].fullAttrs.length;j++ ){
                                    var sku1=skus[k].fullAttrs[j];
                                    skus[k].fullAttrs[j].title=attrs[sku1.attrId];
                                }
                                sku.fullAttrs=skus[k].fullAttrs;
                            }
                            if(sku!=null&&sku.skuId){
                                options[z].skuList=sku;
                                options[z].hasSku=true;
                            }
                        }

                    }
                }
            }

            //根据标签将子商品分组
            if(combiParts[value.tag]){
                combiParts[value.tag].push(options)
            }else{
                tagLists.push(value.tag);
                combiParts[value.tag]=[];
                combiParts[value.tag].push(options);
            }

            //   根据部件id将子商品分组
            if(options.length>1){
                combiPartLists[value.partId]=options;
            }
        }
        if (combiProducts[0].fixedPrice!="Y"&&!combiProducts[0].isDefault) {
            packagePrice = packagePriceTwo.toFixed(2);
        }




    var bigRelatedUrl=[];
    for(var y=0;y< combiProducts[0].fileIds.length;y++ ){
        if(combiProducts[0].fileIds[y]){
                bigRelatedUrl[y]=FileService.getRelatedUrl(combiProducts[0].fileIds[y],"603X302");
        }
    }
    if(totalSum!=0){
        var savePrice=(totalSum-packagePrice).toFixed(2);
        var chekou=(packagePrice/totalSum*10).toFixed(1);
    }
    combiProducts[0].imgRealyUrl=bigRelatedUrl;

    comboProduct.title = combiProducts[0] && combiProducts[0].title;
    comboProduct.combiProducts =combiProducts[0];//组合商品
    comboProduct.bigRelatedUrl = bigRelatedUrl;//组合商品图片
    comboProduct.totalSum = totalSum.toFixed(2);//套餐市场价总价
    comboProduct.savePrice =savePrice;//节省的钱
    comboProduct.chekou =chekou; //折扣
    comboProduct.isFixedPrice =isFixedPrice; //折扣
    comboProduct.packagePrice = packagePrice;//套餐价
    comboProduct.totalNumber = totalNumber;//套餐内商品数
    comboProduct.combiParts = combiParts;//根据标签分组的部件列表
    comboProduct.combiPartLists = combiPartLists;//根据标签分组的部件列表
    comboProduct.isFavorite = isFavorite;//是否收藏组合商品
    comboProduct.isCanBuy = isCanBuy;//是否能购买;
    comboProduct.tagLists = tagLists;//部件名字列表
    comboProduct.phoneHtml = phoneHtml;//详情描述

    var ret = {
        state: "ok",
        comboProduct: comboProduct
    }
    out.print(JSON.stringify(ret));

}catch(e){
        out.print(JSON.stringify("===================="+e));
}

})();