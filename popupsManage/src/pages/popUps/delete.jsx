//#import Util.js
//#import login.js
//#import $popupsManage:services/PopupsService.jsx
(function () {
    var result = {};
    var id = $.params.id;
    try {
        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId) {
            result.status = 404;
            result.msg = "您还未登录,请先登录";
            out.print(JSON.stringify(result));
            return;
        }
        PopupsService.deletePopups(id,loginUserId);

        result.status = 200;
        out.print(JSON.stringify(result));
    } catch (e) {
        result.status = 500;
        result.msg = e + "";
        out.print(JSON.stringify(result));
    }
})();

