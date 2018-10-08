//#import doT.min.js
//#import pigeon.js
//#import Util.js
//#import DateUtil.js
//#import product.js
//#import merchant.js
//#import sku.js
//#import search.js
//#import $ProductStockEarlyWarning:services/ProductStockQuery.jsx
//#import $ProductStockEarlyWarning:services/ProductStockService.jsx

(function () {
    var merchantId = $.params["m"];
    var listType = $.params["t"];
    var keyword = $.params["keyword"];

    var detailList = $.params["d"];


    if(listType && listType == 'downStock' && detailList == 'undefined'){
        var currentPage = $.params["page"];
        if (!currentPage) {
            currentPage = 1;
        }

        var recordType="";
        var pageLimit = 20;
        var displayNum = 6;
        var totalRecords = 0;//总数量
        var start = (currentPage - 1) * pageLimit;

        var listData = [];


        totalRecords = ProductStockService.getAllObjListSize();

        listData = ProductStockService.getAllObjList(start, pageLimit);

        var totalPages = (totalRecords + pageLimit - 1) / pageLimit;
        var pageParams = {
            recordType: recordType,
            pageLimit: pageLimit,
            displayNum: displayNum,
            totalRecords: totalRecords,
            totalPages: totalPages,
            currentPage: currentPage
        };

        var recordList=[];
        for(var i=0;i<listData.length;i++){
            var obj=listData[i];
            var obj_record={};
            obj_record.id=obj.id;
            var arr=obj.id.split('_');
            obj_record.downTime=arr[2];
            obj_record.total=obj.value.length;
            recordList.push(obj_record);
        }

        var pageData = {
            pageParams: pageParams,
            recordList: recordList,
            listType:listType,
            detailList:detailList,
            merchantId:merchantId
        };

        var template = $.getProgram(appMd5, "pages/load_product.jsxp");
        var pageFn = doT.template(template);
        out.print(pageFn(pageData));
        return;
    }


    if(listType && listType == 'downStock' && detailList != 'undefined'){

        var downStock_id = detailList;

        var downStockObj=ProductStockService.getObj(downStock_id);
        if(!downStockObj){
            downStockObj={}
        }
        if(!downStockObj.value){
            downStockObj.value=[];
        }

        var pageData = {
            code:'0',
            downStockDetail:downStockObj.value,
            listType:listType,
            detailList:detailList,
            merchantId:merchantId
        };

        out.print(JSON.stringify(pageData));
        return;
    }



    var currentPage = $.params["page"];
    if (!currentPage) {
        currentPage = 1;
    }

    var searchParams = {};
    if (keyword && keyword != "") {
        searchParams.productId = keyword;
    }
    if (listType && listType == "warningStock") {
        searchParams.warningStockFlag = "1";
    } else {
        searchParams.emptyStockFlag = "1";
    }
    if (merchantId && merchantId != "head_merchant") {
        searchParams.merchantId = merchantId;
    }

    //分页参数 begin
    var recordType = "商品";
    var pageLimit = 20;
    var displayNum = 6;
    var start = (currentPage - 1) * pageLimit;

    //进入搜索
    var searchArgs = {
        fetchCount: pageLimit,
        fromPath: start
    };
    searchArgs.sortFields = [{
        field: "id",
        type: 'LONG',
        reverse: true
    }];

    searchArgs.queryArgs = ProductStockQuery.getQueryArgs(searchParams);
    var result = SearchService.search(searchArgs);
    var totalRecords = result.searchResult.getTotal();
    var ids = result.searchResult.getLists();

    var recordList = [];
    for (var i = 0; i < ids.size(); i++) {
        var productId = ids.get(i);
        var jProduct = ProductService.getProductWithoutPrice(productId);
        if (!jProduct) {
            continue;
        }

        var merchantName = "未知";
        if (merchantId == "head_merchant") {
            var pMerchantId = jProduct.merchantId;
            var jMerchant = MerchantService.getMerchant(pMerchantId);
            if (jMerchant) {
                merchantName = jMerchant.name_cn;
            }
        }

        var publishState = ProductService.getPublishState(jProduct);

        var skus = ProductService.getSkus(productId);
        for (var k = 0; k < skus.length; k++) {
            var jSku = skus[k];

            var sellableCount = ProductService.getSellableCountBySku(jProduct, jSku);
            var securitySellableCount = ProductService.getSecuritySellableCount(productId, jSku.id);

            jSku.sellableCount = sellableCount;
            jSku.securitySellableCount = securitySellableCount;
        }

        var logoUrl = "/upload/none_40.jpg";
        if (jProduct) {
            logoUrl = ProductService.getProductLogo(jProduct, "40X40", "/upload/none_40.jpg");
        }

        jProduct.logoUrl = logoUrl;
        jProduct.merchantName = merchantName;
        jProduct.publishState = publishState;
        jProduct.skus = skus;
        recordList.push(jProduct);
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

    var template = $.getProgram(appMd5, "pages/load_product.jsxp");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})();

