/**
 * Created by zengxianlin on 16/6/16.
 */

//#import Util.js
//#import product.js
//#import login.js
//#import user.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js
//#import column.js
//#import $FavoriteCombiProduct:services/FavoriteCombiProductService.jsx
//#import $FavoriteCombiProduct:services/FavoriteCombiProductUtil.jsx
//#import $combiproduct:services/CombiProductService.jsx
(function () {
    try {
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
        //套餐
        var jFavorMap = FavoriteCombiProductService.getAllFavoriteList(userId, page, count);
        var arrFavoriteList = [];
        if (jFavorMap != null) {

            for (var i = 0; i < jFavorMap.length; i++) {

                var favorObj = jFavorMap[i];
                var productId = favorObj && favorObj.combiProductId;
                if(!productId){
                    continue;
                }
                var product = CombiProductService.getCombiProduct(productId);
                if(!product){
                    //当商品已经删除，就把收藏也删除掉
                    FavoriteCombiProductUtil.cancelFavorite(productId, userId);
                    continue;
                }

                var objItem = {};
                objItem.productId = productId;
                objItem.name = product.title;
                objItem.createTime = DateUtil.getShortDate(favorObj.createTime);
                //获取图片列表
                objItem.pics = FileService.getRelatedUrl(product.fileIds[0], "240X60");
                objItem.memberPrice = product.price;
                arrFavoriteList.push(objItem);

            }
        }
        var result = {
            state: "ok",
            favorMap: arrFavoriteList
        }
        out.print(JSON.stringify(result));
    } catch (e) {
        $.log(e);
        out.print(e);
    }


})();