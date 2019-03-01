//#import doT.min.js
//#import Util.js
//#import card.js
//#import user.js
//#import UserUtil.js
//#import DateUtil.js
//#import search.js
//#import file.js
//#import $popupsManage:services/PopupsService.jsx
//#import $popupsManage:services/PopupsQuery.jsx

(function () {
    // var result = {};
    //try {
    var merchantId = $.params["m"];
    var t = $.params["t"];
    var currentPage = $.params["page"];
    var keyword = $.params["keyword"];
    var isEnable = $.params["isEnable"];

    if (!currentPage) {
        currentPage = 1;
    }

    var isSearch = false;
    var searchParams = {};
    //关键字
    if (keyword && keyword != "") {
        searchParams.keyword = keyword;
        isSearch = true;
    }

    //关键字
    if (isEnable && isEnable != "") {
        searchParams.isEnable = isEnable;
        isSearch = true;
    }

    var recordType = "弹窗浮标";
    var pageLimit = 10;
    var displayNum = 6;
    var totalRecords = 0;//总数量
    var start = (currentPage - 1) * pageLimit;

    var listData = [];
    if (isSearch) {
        var searchArgs = {
            fetchCount: pageLimit,
            fromPath: start
        };
        searchArgs.sortFields = [{
            field: "createTime",
            type: 'LONG',//STRING
            reverse: true
        }];
        searchArgs.queryArgs = PopupsQuery.getQueryArgs(searchParams);
        var result = SearchService.search(searchArgs);
        totalRecords = result.searchResult.getTotal();
        var ids = result.searchResult.getLists();
        for (var i = 0; i < ids.size(); i++) {
            var objId = ids.get(i);
            var record = PopupsService.getPopups(objId);
            if (record) {
                listData.push(record);
            }
        }
    } else {
        if (t == "deleted") {
            totalRecords = PopupsService.getDeletedPopupsListSize(merchantId);
            listData = PopupsService.getDeletedPopupsList(merchantId, start, pageLimit);
        } else {
            totalRecords = PopupsService.getPopupsListSize(merchantId);
            listData = PopupsService.getPopupsList(merchantId, start, pageLimit);
        }
    }

    var recordList = [];

    // for (var i = 0; i < listData.length; i++) {
    //     var jRecord=listData[i];
    //     jRecord.createTime=DateUtil.getLongDate(jRecord.createTime);
    //     jRecord.image = FileService.getRelatedUrl(jRecord.image, "100X100");
    //     recordList.push(jRecord);
    // }

    for (var i = 0; i < listData.length; i++) {
        var jRecord = listData[i];
        if (t != "deleted") {
            if (!jRecord || jRecord.isDeleted) {
                continue;
            }
        }
        jRecord.formatCreateTime = getFormatTime(jRecord, "create");
        jRecord.formatDeleteTime = getFormatTime(jRecord, "delete");
        jRecord.imageLogo = FileService.getRelatedUrl(jRecord.image, "100X100");
        jRecord.imageFullPath = FileService.getFullPath(jRecord.image);
        jRecord.createUserName = getFormatUserName(jRecord, "create");
        jRecord.changeUserName = getFormatUserName(jRecord, "change");
        jRecord.deleteUserName = getFormatUserName(jRecord, "delete");

        var jState = getEnableStateName(jRecord);
        jRecord.enableStateStyle = jState.stateStyle;
        jRecord.enableStateName = jState.stateName;

        jRecord.beginTime=DateUtil.getLongDate(jRecord.beginTime);
        jRecord.endTime=DateUtil.getLongDate(jRecord.endTime);

        // var validateTime = "";
        // if (jRecord.beginTime && jRecord.beginTime != "") {
        //     validateTime += DateUtil.getLongDate(Number(jRecord.beginTime));
        // }
        // if (jRecord.endTime && jRecord.endTime != "") {
        //     var preDepositRuleEndTime = DateUtil.getLongDate(Number(jRecord.endTime));
        //     if (preDepositRuleEndTime != "") {
        //         validateTime += " 至<br>" + preDepositRuleEndTime;
        //     }
        // }
        // jRecord.validateTime = validateTime;
        recordList.push(jRecord);
    }
    //
    // recordList=listData;
    // $.log("\n..........recordList。。。。。="+JSON.stringify(recordList));

    var totalPages = (totalRecords + pageLimit - 1) / pageLimit;
    var pageParams = {
        recordType: recordType,
        pageLimit: pageLimit,
        displayNum: displayNum,
        totalRecords: totalRecords,
        totalPages: totalPages,
        currentPage: currentPage
    };

    var pageData = {
        merchantId: merchantId,
        pageParams: pageParams,
        recordList: recordList,
        t: t
    };

    var template = $.getProgram(appMd5, "pages/popUps/load_records.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
    //}catch (e) {
    //        result.code = "99";
    //        result.msg = "操作出现异常：" + e.toString();
    //        out.print(JSON.stringify(result));
    //}
})();

function getEnableStateName(jPopups) {
    var jResult = {};

    if(jPopups.isDeleted){
        jResult.stateStyle = "danger";
        jResult.stateName = "已删除";
        return jResult;
    }

    var beginDateTime = jPopups.beginTime;
    var endDateTime = jPopups.endTime;
    var isEnable = jPopups.isEnable;

    if (!beginDateTime || !endDateTime || beginDateTime == "" || endDateTime == "" || isEnable == "N") {
        jResult.stateStyle = "default";
        jResult.stateName = "未生效";
        return jResult;
    }

    var curTime = new Date().getTime();

    if (curTime < beginDateTime) {
        jResult.stateStyle = "info";
        jResult.stateName = "未开始";
        return jResult;
    }
    if (curTime > endDateTime) {
        jResult.stateStyle = "warning";
        jResult.stateName = "已过期";
        return jResult;
    }
    jResult.stateStyle = "success";
    jResult.stateName = "生效中";
    return jResult;
}

function getFormatTime(jRecord, type) {
    var formatTime = "";
    if (type == "delete") {
        if (jRecord.deleteTime && jRecord.deleteTime != "") {
            formatTime = DateUtil.getLongDate(jRecord.deleteTime);
        }
    } else {
        if (jRecord.createTime && jRecord.createTime != "") {
            formatTime = DateUtil.getLongDate(jRecord.createTime);
        }
    }
    return formatTime;
}

function getFormatUserName(jRecord, type) {
    var userName = "";

    var jUser;
    if (type == "delete") {
        if (jRecord.deleteUserId && jRecord.deleteUserId != "") {
            jUser = UserService.getUser(jRecord.deleteUserId);
        }
    } else if (type == "create") {
        if (jRecord.createUserId && jRecord.createUserId != "" && jRecord.createUserId != "undefined") {
            jUser = UserService.getUser(jRecord.createUserId);
        }
    } else if (type == "change") {
        if (jRecord.changeUserId && jRecord.changeUserId != "") {
            jUser = UserService.getUser(jRecord.changeUserId);
        }
    }

    if (jUser) {
        userName = UserUtilService.getRealName(jUser);
    }
    return userName;
}
