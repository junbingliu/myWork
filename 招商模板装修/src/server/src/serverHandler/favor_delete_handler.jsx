//#import Util.js
//#import login.js
//#import address.js
//#import $FavoriteProduct:services/FavoriteProductService.jsx
//#import $FavoriteProduct:services/FavoriteProductUtil.jsx
//#import $FavoriteCombiProduct:services/FavoriteCombiProductUtil.jsx

;(function(){

    var ret = {
        state:false
    }
    try{
        var operateWay = $.params.operateWay;
        var loggedUser = LoginService.getFrontendUser();
        var userId = "";
        if(loggedUser != null){
            userId = loggedUser.id
        }else{
            ret.errorMsg = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }
        var ids = $.params.ids;
        var splitIds = ids.split(",");
        for (var i=0;i<splitIds.length;i++) {
            var id = splitIds[i];
            if (id) {
                    // product单品，combiProduct 组合套餐
                    if(operateWay=='product')
                    {
                        FavoriteProductUtil.cancelFavorite(id, userId);
                    }else if(operateWay=='combiProduct')
                    {
                        FavoriteCombiProductUtil.cancelFavorite(id,userId);
                    }
            }
        }
        ret.state = true;
        out.print(JSON.stringify(ret));
    }catch(e){
        ret.errorMsg = "system_error";
        out.print(JSON.stringify(getId));
    }
})();