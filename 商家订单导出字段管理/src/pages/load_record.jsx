//#import doT.min.js
//#import Util.js
//#import user.js
//#import column.js
//#import DateUtil.js
//#import UserUtil.js
//#import $merchantOrderExportFieldsMgt:service/OrderExportFieldsService.jsx

(function () {

    var merchantId = $.params["m"];
    var currentPage = $.params["page"];
    if (!currentPage) {
        currentPage = 1;
    }

    var searchParams = {};

    var recordType = "数据";
    var pageLimit = 20;
    var displayNum = 6;
    var totalRecords = 0;//总数量
    var start = (currentPage - 1) * pageLimit;

    var listData = [];

    totalRecords = OrderExportFieldsService.getAllExportListSize();
    listData = OrderExportFieldsService.getAllExportList(start, pageLimit);


    var recordList = [];
    for (var i = 0; i < listData.length; i++) {
        var jRecord = listData[i];
        if (!jRecord) {
            continue;
        }

        var formatCreateTime = "";
        if (jRecord.createTime && jRecord.createTime != "") {
            formatCreateTime = DateUtil.getLongDate(jRecord.createTime);
        }
        jRecord.formatCreateTime = formatCreateTime;

        var createUserName = "";
        var jUser = UserService.getUser(jRecord.createUserId);
        if(jUser){
            createUserName = UserUtilService.getRealName(jUser);
        }
        jRecord.createUserName = createUserName;

        var columnPath = ColumnService.getColumnNamePath(jRecord.columnId, "col_merchant_sort", "/");
        jRecord.columnPath = columnPath;

        var gradePath = ColumnService.getColumnNamePath(jRecord.gradeId, "col_merGrade_100", "/");
        jRecord.gradePath = gradePath;


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

    var template = $.getProgram(appMd5, "pages/load_record.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();
