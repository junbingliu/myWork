//#import Util.js
//#import favorite.js
//#import login.js

;(function(){
    try{
        var errorMsg = "";
        var result = false,totalCount = 0;
        //获取登录用户信息
        var user = LoginService.getFrontendUser();
        if(!user){
            errorMsg = "not_login";
        }else{
            var userId = user.id;
            var objId = $.params.objId;
            var objType = $.params.type;
            if(objId && objType){
                var favoriteId = FavoriteService.getFavoriteId(objId,objType);
                var isExist = FavoriteService.isExistFavorite(userId,objType,favoriteId);
                if(isExist){
                    errorMsg = "existed";
                }else{
                    var jFavorite = {};
                    FavoriteService.addFavorite(userId,objId,objType, $.JSONObject(jFavorite));
                    errorMsg = "ok";
                    result = true;
                }
                totalCount = FavoriteApi.IsoneModulesEngine.favoriteService.getFavoriteToTalCount(userId,objType);
            }
        }

        var ret = {
            state:result,
            errorMsg:errorMsg,
            totalCount:totalCount
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