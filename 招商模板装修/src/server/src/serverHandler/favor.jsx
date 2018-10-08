//#import Util.js
//#import product.js
//#import login.js
//#import user.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js
//#import column.js
//#import $FavoriteProduct:services/FavoriteProductService.jsx
//#import $FavoriteProduct:services/FavoriteProductUtil.jsx

(function () {

    var userId = "";
    var user = LoginService.getFrontendUser();
    if (user) {
        userId = user.id;
    } else {
        var result = {
            state: "notLogin"
        }
        out.print(result);
        return;
    }
    var page = $.params.page || 0;
    var count = 1000;
    //单品
    var recordList = [];
    var jFavorMap = FavoriteProductService.getAllFavoriteList(userId, page, count);
    if (jFavorMap != null) {
        for (var i = 0; i < jFavorMap.length; i++) {
            var favorObj = jFavorMap[i];
            var productId = favorObj && favorObj.productId;
            var product = ProductService.getProduct(productId);
            if (!product) {
                //当商品已经删除，就把收藏也删除掉
                FavoriteProductUtil.cancelFavorite(productId, userId);
                continue;
            }
            favorObj.name = product.htmlname;
            favorObj.createTime = DateUtil.getShortDate(favorObj.createTime);
            //获取图片列表
            var pics = ProductService.getPics(product);
            var relatedUrl;
            if (pics && pics.length > 0) {
                relatedUrl = FileService.getRelatedUrl(pics[0].fileId, "100X100");

            }
            favorObj.pics = relatedUrl;

            var cxt = "{attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true}]}";
            var priceList = ProductService.getPriceValueList(productId, userId, product.merchantId, 1, cxt, 'normalPricePolicy');
            var memberPrice = (priceList[0] && priceList[0].formatTotalPrice) || "暂无价格";
            favorObj.memberPrice = memberPrice;

            recordList.push(favorObj);
        }
    }
    var result = {
        state: "ok",
        favorMap: recordList
    }
    out.print(JSON.stringify(result));


})();