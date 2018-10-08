//#import Util.js
//#import login.js
//#import user.js
//#import UserUtil.js
//#import DateUtil.js
;
var UserUtilApi = new JavaImporter(
    Packages.net.xinshi.isone.modules.user,
    Packages.net.xinshi.isone.modules.user.tools,
    Packages.org.json
);
(function () {

    var ret = {
        state: false,
        errorCode: ""
    }
    var userId = "";
    var user = LoginService.getFrontendUser();
    if (user) {
        userId = user.id;
    } else {
        ret.errorCode = "notLogin";
        out.print(JSON.stringify(ret));
        return;
    }
    var searchArgs = {};
    searchArgs.parentId = userId;
    searchArgs.limit = 1000;
    var s = JSON.stringify(searchArgs);
    var args = new UserUtilApi.JSONObject(s);
    var json = UserUtilApi.UserSearchUtil.searchUser(args);
    var results = JSON.parse(json.toString());
    if (results) {
        var records = results.records;
        //var iphone=records.mobilePhone;


        for (var i = 0; i < records.length; i++) {
            var obj = records[i];
            obj.createTime = DateUtil.getLongDate(parseInt(obj.createTime)) + "";
            var userObj = UserService.getUser(obj.id);

            var iphone = "";
            try {
                var mobilePhone = obj.mobilPhone;
                if (mobilePhone) {
                    var length = mobilePhone.length;
                    if (length == 11) {
                        iphone = mobilePhone.substring(0, 3) + "****" + mobilePhone.substring(length - 4);
                    }
                }
            } catch (e) {
                $.log("......................e=" + e);
            }

            obj.iphone = iphone;

            obj.userName = userObj.id;

        }
    }

    ret = {
        state: true,
        total: results.total,
        records: records
    };
    out.print(JSON.stringify(ret));


})();