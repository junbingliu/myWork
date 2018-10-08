//#import Util.js
//#import login.js
//#import DateUtil.js
//#import sysArgument.js
//#import user.js

(function () {
    var selfApi = new JavaImporter(
        Packages.org.json,
        Packages.net.xinshi.isone.modules,
        Packages.java.util,
        Packages.java.util.regex,
        Packages.net.xinshi.isone.functions.account
    );
    var requestURI = request.getRequestURI() + "";

    var userId = "";
    var user = LoginService.getFrontendUser();
    if (user) {
        userId = user.id;
    } else {
        var result = {
            state: "notLogin"
        }
        out.print(result);
        return;
    }

    var mid = "head_merchant";
    var webName = SysArgumentService.getSysArgumentStringValue(mid, "col_sysargument", "webName_cn");

    var direction = $.params.direction || "";//increase：获得 reduce：消耗
    if (direction == "all") {
        direction = "";
    }
    var page = $.params.page || 1;

    //var userGroup = UserService.getUserTopGroupByUserId(userId);
    var accountType = Packages.net.xinshi.isone.modules.account.IAccountService.ACCOUNT_TYPE_SHOPPINGINTEGRAL + "";
    var accountTypeName = UserService.getAccountType(accountType);
    var userAccount = UserService.getUserAccount(userId, accountType);
    var userAccountAmount = 0;
    if (userAccount) {
        userAccountAmount = UserService.getObjAmount(userAccount.id, userId) / 100;
    }

    var number = "1200", beginTime = $.params.beginTime || "", endTime = $.params.endTime || "";
    var recordMap;
    var jRecordMap = selfApi.AccountFunction.getAccountRecords(userId, direction, beginTime, endTime, accountType, page, number);
    if (jRecordMap != null) {
        recordMap = JSON.parse(new selfApi.JSONObject(jRecordMap).toString());
        if (recordMap.rowCount > 0) {
            for (var i = 0; i < recordMap.lists.length; i++) {
                var record = recordMap.lists[i];
                record.transactionTimeFormat = DateUtil.getLongDate(parseInt(record.transactionTime));
                record.transactionAmount = Number(record.transactionAmount) / 100;
            }
        }
    }

    var showTransRecord = "true";
    var jCardInfo = user.wjCardInfo || {};
    var wjCardNo = jCardInfo.wjCardNo;
    var wjShopId = jCardInfo.wjShopId;
    var wjMemberId = jCardInfo.wjMemberId;
    if (wjCardNo && wjShopId && wjMemberId) {
        showTransRecord = "false";
    }
    var result = {
        state: "ok",
        recordMap: recordMap,
        userAccountAmount: userAccountAmount
    }
    out.print(JSON.stringify(result));

    /*  setPageDataProperty(pageData, "requestURI", requestURI + "");
     setPageDataProperty(pageData, "webName", webName);
     setPageDataProperty(pageData, "user", user);
     setPageDataProperty(pageData, "userAccountAmount", userAccountAmount);
     setPageDataProperty(pageData, "recordMap", recordMap);
     setPageDataProperty(pageData, "direction", direction);
     setPageDataProperty(pageData, "beginTime", beginTime);
     setPageDataProperty(pageData, "endTime", endTime);
     setPageDataProperty(pageData, "showTransRecord", showTransRecord);*/

})();