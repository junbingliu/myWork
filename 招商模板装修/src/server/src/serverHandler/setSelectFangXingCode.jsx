//#import Util.js
//#import session.js
//#import login.js
//#import $globalUserCacheStore:services/GlobalUserCacheStoreService.jsx

;
(function () {
    var fangXingCode = $.params.fangXingCode || "";
    var roomtype = $.params.roomtype || "";
    var userId = LoginService.getFrontendUserId();
    if(fangXingCode && roomtype){
        GlobalUserCacheStoreService.addValue(userId, "selectFangXingId", fangXingCode);
        GlobalUserCacheStoreService.addValue(userId, "selectFangXingtype", roomtype);
        out.print("ok");
    } else {
        out.print("err");
    }


})();

