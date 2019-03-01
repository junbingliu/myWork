//#import doT.min.js
//#import Util.js
//#import user.js
//#import DateUtil.js
//#import UserUtil.js
//#import search.js
//#import file.js
//#import $oleSaladCard:services/saladCardCodeService.jsx
//#import $oleSaladCard:services/saladCardCodeQuery.jsx


(function () {
    var merchantId = $.params["m"];
    var currentPage = $.params["page"];
    var keyword = $.params["keyword"];
    var activityId = $.params['activityId'];
    if (!currentPage) {
        currentPage = 1;
    }

    var isSearch = false;
    var searchParams = {};
    //关键字
    if (keyword && keyword != "") {
        keyword = saladCardCodeService.getSaladCardCodeId(activityId,keyword);
        searchParams.keyword = keyword;
        isSearch = true;
    }

    var recordType = "反馈";
    var pageLimit = 20;
    var displayNum = 6;
    var totalRecords = 0;//总数量
    var start = (currentPage - 1) * pageLimit;

    var listData = [];
    if (isSearch) {
        //进入搜索
        var searchArgs = {
            fetchCount: pageLimit,
            fromPath: start
        };
        searchArgs.sortFields = [{
            field:"createTime",
            type:'LONG',
            reverse:true
        }];

        searchArgs.queryArgs = saladCardCodeQuery.getQueryArgs(searchParams);
        var result = SearchService.search(searchArgs);
        totalRecords = result.searchResult.getTotal();
        var ids = result.searchResult.getLists();


        for (var i = 0; i < ids.size(); i++) {
            var objId = ids.get(i);
            var record = saladCardCodeService.getSaladCardCode(objId);
            if (record) {
                listData.push(record);
            }
        }
    } else {
        totalRecords = saladCardCodeService.getAllSaladCardCodeListSize(activityId);
        listData = saladCardCodeService.getAllSaladCardCodeList(activityId,start, pageLimit);
    }

    var recordList = [];
    for (var i = 0; i < listData.length; i++) {
        var jRecord = listData[i];
        if (!jRecord) {
            continue;
        }

        var formatCreateTime = "";

        $.log("创建时间"+jRecord.createTime)
        if (jRecord.createTime && jRecord.createTime != "") {
            formatCreateTime = DateUtil.getLongDate(jRecord.createTime);
        }
        var nullifyTime ="";
        if (jRecord.nullifyTime && jRecord.nullifyTime != "") {
            nullifyTime = DateUtil.getLongDate(jRecord.nullifyTime);
        }
        jRecord.nullifyTime=nullifyTime;
        $.log("创建时间"+formatCreateTime)
        jRecord.formatCreateTime = formatCreateTime;

        var createUserName = "";
        var jUser = UserService.getUser(jRecord.createUserId);
        if(jUser){
            createUserName = UserUtilService.getRealName(jUser);
        }
        jRecord.createUserName = createUserName;

        recordList.push(jRecord);
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

    var pageData = {
        merchantId: merchantId,
        pageParams: pageParams,
        recordList: recordList
    };

    var template = $.getProgram(appMd5, "pages/load_redeemCode.html");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();
