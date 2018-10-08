//#import Util.js
//#import login.js
//#import $FavoriteCombiProduct:services/FavoriteCombiProductService.jsx
//#import $FavoriteCombiProduct:services/FavoriteCombiProductUtil.jsx

(function () {
//
    var strGoodsId = $.params.id;
    var strOperateWay = $.params.operateWay;
    var userId = "";
    var user = LoginService.getFrontendUser();
    if(user){
        userId = user.id;
    }else{

        var result = {
            state: "notLogin"
        }
        if(strOperateWay!='getFaroviteState')
        {
            //加随机值是为了 每次弹框提示
            result.state = "notLogin_showMsg"+(Math.random()*1000000);;
        }
        out.print(JSON.stringify(result));
        return;
    }
    /*
    //测试
    var result = {
        state: "notLogin"
    }
    if(strOperateWay!='getFaroviteState')
    {
         //加随机值是为了 每次弹框提示
         result.state = "notLogin_showMsg"+(Math.random()*1000000);;
    }
    out.print(JSON.stringify(result));
    return;
    */
    //
    var jFavorite = {};
    jFavorite.combiProductId = strGoodsId;//"combiProduct_80000";
    var result = {
        state: "ok",
    };
    //获取收藏状态
    if(strOperateWay=='getFaroviteState')
    {
        try {
            result.setFavoriteState = FavoriteCombiProductUtil.hasFavorite(strGoodsId, userId);;
            out.print(JSON.stringify(result));
        }catch (evt)
        {
            //out.print('====error==='+evt);
            result.setFavoriteState = false;
            out.print(JSON.stringify(result));
        }
    }else if (strOperateWay=='addFavorite')
    {
        try
        {
            result.setFavoriteState =FavoriteCombiProductUtil.hasFavorite(strGoodsId, userId);
            if(result.setFavoriteState==false)
            {
                result.data = FavoriteCombiProductService.addFavorite(jFavorite, userId);
                if (result.data)
                {
                    result.setFavoriteState = true;
                }else
                {
                    result.setFavoriteState = false;
                }
            }
            out.print(JSON.stringify(result));
        }catch (evt)
        {
            result.state = "system_error";
            out.print(JSON.stringify(result));
        };
    }else
    {
        FavoriteCombiProductUtil.cancelFavorite(strGoodsId, userId);
        result.setFavoriteState = false;
        out.print(JSON.stringify(result));
    }
})();