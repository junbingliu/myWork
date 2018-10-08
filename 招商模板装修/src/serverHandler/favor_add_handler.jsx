//#import Util.js
//#import login.js
//#import  $FavoriteProduct:services/FavoriteProductService.jsx
;(function(){
    try{
        var productId= $.params.objId;
        var user = LoginService.getFrontendUser();
        if(user){
            var userId=user.id;
            var id=FavoriteProductService.getFavoriteByProductId(productId,userId);
            if(id){
                out.print("existed")
            }else{
                var jFavorite={};
                jFavorite.productId=productId;
               var fid= FavoriteProductService.addFavorite(jFavorite,userId);
                if(fid){
                    out.print("ok");
                }else{
                    out.print("errs");
                }
            }
        }else{
            out.print("none")
        }
    } catch(e){
        var ret = {
            state:"err",
            msg:e
        }
        out.print((e));
    }
})();