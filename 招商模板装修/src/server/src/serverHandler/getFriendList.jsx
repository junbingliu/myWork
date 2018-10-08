//#import Util.js
//#import login.js
//#import user.js
//#import UserUtil.js
//#import DateUtil.js
//#import open-user.js
;
(function () {

    var result = {};
    try {
        var ret = {
            state:false,
            errorCode:""
        }
        var userId = "";
        var user = LoginService.getFrontendUser();
        if (user) {
            userId = user.id;
        } else {
            ret.errorCode="notLogin";
            out.print(JSON.stringify(ret));
            return;
        }


        var beginCreateTime = $.params.beginCreateTime;
        var endCreateTime = $.params.endCreateTime;
        var currentPage = $.params["page"];
        if (!currentPage) {
            currentPage = 1;
        }

        //分页参数 begin
        var recordType = "会员";
        var pageLimit = 20;
        var displayNum = 6;
        var searchArgs = {
            "fields": "userId,loginId,realName,mobile,createTime,",
            "page": currentPage,
            "page_size": pageLimit
        };

        if (beginCreateTime && beginCreateTime != "") {
            searchArgs.beginCreateTime = beginCreateTime;
        }
        if (endCreateTime && endCreateTime != "") {
            searchArgs.endCreateTime = endCreateTime;
        }

        searchArgs.parentId = userId;
        searchArgs.fillParentId = "1";//有填写推荐人的会员

        var jSearchResult = OpenUserService.getUsers(searchArgs);
        var users = jSearchResult.users;
        var totalRecords = jSearchResult.total;

        var recordList = [];
        for (var k = 0; k < users.length; k++) {
            var jUser = users[k];
            var userName = "";
            if (jUser.realName) {
                userName = jUser.realName;
            }else if (jUser.loginId) {
                userName = jUser.loginId;
            } else if (jUser.mobile) {
                userName = jUser.mobile;
            } else {
                userName = jUser.userId;
            }
            $.log("\n......................................userId="+jUser.userId);

            //userInfo.userId = jUser.userId;
                   //var phone = jUser.mobile;
            //var mphone =phone.substr(3,7);
            //var lphone = phone.replace(mphone,"****");

            var  iphone = "";
            try {
                iphone =  jUser.mobile;
                var length = iphone.length;
                if (length == 11) {
                    iphone= iphone.substring(0, 3) + "****" + iphone.substring(length - 4);
                }
            } catch (e) {
                $.log("错误" + iphone);
            }

            var userInfo = {};
            userInfo.loginId = jUser.loginId;
            userInfo.userName = jUser.userId;
            userInfo.iphone = iphone;
            userInfo.createTime = jUser.createTime;
            recordList.push(userInfo);
        }

        var totalPages = (totalRecords + pageLimit - 1) / pageLimit;
        var pageParams = {
            recordType: recordType,
            pageLimit: pageLimit,
            displayNum: displayNum,
            totalRecords: totalRecords,
            totalPages: totalPages,
            currentPage: currentPage
        };

        var ret = {
            //merchantId: merchantId,
            pageParams: pageParams,
            recordList: recordList,
            state: true
        };
        out.print(JSON.stringify(ret));
    }
    catch (e) {
        result.code = "100";
        result.msg = "获取失败" + e;
        out.print(JSON.stringify(result));
    }

})();