//#import Util.js
//#import login.js
//#import $FavoriteProduct:services/FavoriteProductService.jsx
//#import $FavoriteCombiProduct:services/FavoriteCombiProductService.jsx

(function () {
    var resulte =
    {
        state:"",
        totalFavoriteNum:0
    }
  try
  {
      var user = LoginService.getFrontendUser();
      if (user)
      {
          //我的收藏数
          var favorCount = FavoriteProductService.getAllFavoriteListSize(user.id)+FavoriteCombiProductService.getAllFavoriteListSize(user.id);;
          resulte.totalFavoriteNum = favorCount;
          resulte.state = 'ok';
      }else
      {
          resulte.state = 'onLogin';
      }
  }catch (error)
  {
      $.log(JSON.stringify(error));
      resulte.state = 'system_error';
  }
    out.print(JSON.stringify(resulte));
})();