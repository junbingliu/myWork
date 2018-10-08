//#import Util.js
//#import favorite.js
//#import login.js
//#import $FavoriteProduct:services/FavoriteProductService.jsx

;(function(){
    try{
        var errorMsg = "";
        var result = false,totalCount = 0;
        //获取登录用户信息
        var user = LoginService.getFrontendUser();
        if(!user){
            errorMsg = "notLogin";
        }else{
            var userId = user.id;
            var objId = $.params.objId;
            var jFavorite = {};
            jFavorite.productId = $.params.objId;
            var favoriteId = FavoriteProductService.addFavorite(jFavorite,userId);
            errorMsg = "ok";
            result = true;
        }

        var ret = {
            state:result,
            errorMsg:errorMsg,
            favoriteId:favoriteId
        }
        out.print(JSON.stringify(ret));
    }catch(e){
        var ret = {
            state:false,
            msg:e
        }
        out.print(JSON.stringify(ret));
    }
})();