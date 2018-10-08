//#import Util.js
//#import login.js
//#import user.js

(function () {
    var ret = {};
    try {
        var user = LoginService.getFrontendUser();
        if (!user) {
            ret.state = "notLogin";
            out.print(JSON.stringify(ret));
            return;
        }

        var groupId = "c_111";   //业主所属会员组
        var userId = user.id;
        var isMatchGroup = UserService.checkMemberGroup(userId, groupId);
        if (isMatchGroup) {
            ret.state = "owner";
            out.print(JSON.stringify(ret));
        } else {
            ret.state = "Login404";
            out.print(JSON.stringify(ret));
        }
    } catch (e) {
        ret.state = "err";
        out.print(JSON.stringify(ret));
    }

})();