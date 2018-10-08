//#import Util.js
//#import product.js
//#import login.js
//#import user.js
//#import sysArgument.js
//#import column.js
//#import search.js
//#import file.js
//#import DigestUtil.js
//#import pigeon.js
//#import $GlobalVariableManagementApp:services/globalVariableManagementService.jsx

(function (processor) {
    var allPromotionLogo = {};

    processor.on("all", function (pageData, dataIds, elems) {

        var keyword = $.params.keyword || "";
        var page = $.params.page || 1;
        var spec = $.params.spec || "200X200";
        var showState = "s";
        var columnId = $.params.columnId || "c_10000";
        var brandId = $.params.brandId;
        var brandIds = $.params.brandIds;
        var brands = $.params.brands || "";//品牌名称，多个以“,”隔开
        var orderBy = $.params.orderBy || "";
        var lowTotalPrice = $.params.lowTotalPrice;
        var highTotalPrice = $.params.highTotalPrice;
        var otherParams = $.params.otherParams || "";
        var stockState = $.params.stock || "";

        var pageSize = 20;
        var requestURI = request.getRequestURI() + "";
        var curColumn = ColumnService.getColumn(columnId);
        if(!curColumn){
            response.sendRedirect(requestURI + "?columnId=c_10000");
            return;
        }

        var dataCacheKey = (function(){
            var str = keyword + columnId + brands + orderBy + otherParams + page + stockState;
            var md5Hex = DigestUtil.md5(str);
            return "product_list_cache_" + md5Hex;
        })();
        var cacheTime = 2;//分钟
        if(pageData.config && pageData.config.cacheTime && pageData.config.cacheTime.value != ""){
            var confnigCacheTime = parseInt(pageData.config.cacheTime.value);
            if(!isNaN(confnigCacheTime)){
                cacheTime = confnigCacheTime;
            }
        }
        $.log("===========configCacheTime="+confnigCacheTime)
        var processTime = new Date().getTime();
        if(cacheTime > 0 && pageData.productionMode && false){
            var useCache = false;
            var productListData = null;
            var cacheContent = ps20.getContent(dataCacheKey);
            if(cacheContent){
                productListData = JSON.parse(cacheContent)
            }
            if(productListData){
                var lastProcessTime = productListData["lastProcessTime"];
                if(lastProcessTime){
                    if(new Date().getTime() - lastProcessTime < cacheTime * 60 * 1000){
                        useCache = true;
                    }
                }
            }
            if(useCache){
                for(var dKey in productListData){
                    setPageDataProperty(pageData, dKey, productListData[dKey]);
                }
                $.log("=======cacheUseTime=" + (new Date().getTime() - processTime) + "ms")
                return;
            }

        }

        var requestParams = $.params;
        var UrlBuilder = {
            rebuildPageUrl:function(key,value){
                var addKey = (!requestParams[key]) && value != "";
                var queryString = "?";
                for(var k in requestParams){

                    var val = requestParams[k];
                    if(k == key){
                        if(value == "")continue;
                        val = value;
                    }
                    queryString += k + "=" + val + "&";
                }
                if(addKey){
                    queryString += key + "=" + value;
                }else{
                    queryString = queryString.substring(0,queryString.length - 1);
                }
                return requestURI + queryString;
            },
            rebuildUrl:function(key,value){
                var addKey = (!requestParams[key]) && value != "";
                var queryString = "?";
                for(var k in requestParams){
                    if(requestParams[k] == ""|| k == "page"){continue;}
                    var val = requestParams[k];
                    if(k == key){
                        if(value == "")continue;
                        val = value;
                    }
                    queryString += k + "=" + val + "&";
                }
                if(addKey){
                    queryString += key + "=" + value;
                }else{
                    queryString = queryString.substring(0,queryString.length - 1);
                }
                return requestURI + queryString;
            },
            removeBrandIdsUrl:function(value){
                var addKey = (!requestParams["brandIds"]) && value != "";
                var queryString = "?";
                for(var k in requestParams){
                    if(requestParams[k] == ""|| k == "page"){continue;}
                    var val = requestParams[k];
                    if(k == "brandIds"){
                        //if(value == "" || val == "")continue;
                        continue;
                    }
                    if(val != ""){
                        queryString += k + "=" + val + "&";
                    }
                }
                queryString = queryString.substring(0,queryString.length - 1);
                return requestURI + queryString;
            },
            removeBrandsUrl:function(value){
                var addKey = (!requestParams["brandIds"]) && value != "";
                var queryString = "?";
                for(var k in requestParams){
                    if(requestParams[k] == ""|| k == "page"){continue;}
                    var val = requestParams[k];
                    if(k == "brandIds"){
                        if(value == "" || val == "")continue;
                        var tempVal = "";
                        var splitVal = val.split(",");
                        for(var j=0;j< splitVal.length;j++){
                            if(value != splitVal[j]){
                                tempVal += splitVal[j] + ",";
                            }
                        }
                        if(tempVal != ""){tempVal = tempVal.substring(0,tempVal.length - 1);}
                        val = tempVal;
                    }
                    if(val != ""){
                        queryString += k + "=" + val + "&";
                    }
                }
                queryString = queryString.substring(0,queryString.length - 1);
                return requestURI + queryString;
            },
            rebuildAttrUrl:function(key,value){
                var otherParams = requestParams["otherParams"];
                var params = "";
                if(otherParams){
                    var addKey = otherParams.indexOf(key) == -1;
                    var split1 = otherParams.split(";");
                    for(var i=0;i< split1.length;i++){
                        if(split1[i] == ""){continue;}
                        var split2 = split1[i].split("--");
                        if(split2[0] == key){
                            if(value != ""){
                                params+=key+"--"+value + ";";
                            }else{

                            }

                        }else{
                            params+=split2[0]+"--"+split2[1] + ";";
                        }
                    }

                    if(addKey){
                        if(value !=""){
                            params+=key+"--"+value;
                        }
                    }else{
                        if(params !=""){
                            params = params.substring(0,params.length - 1);
                        }
                    }
                }else{
                    if(value!=""){
                        params+=key+"--"+value;
                    }else{
                        params="";
                    }
                }
                var queryString = "?";
                for(var k in requestParams){
                    if(k == "otherParams" || k == "page" ){continue;}
                    queryString += k + "=" + requestParams[k] + "&";
                }
                if(params != ""){
                    queryString+="otherParams="+params;
                }else{
                    queryString = queryString.substring(0,queryString.length - 1);
                }

                return requestURI + queryString;
            }
        }


        var userId = LoginService.getFrontendUserId();
        //获取面包线数据
        var position = [];
        position.push({id: curColumn.id, title: curColumn.title, url: requestURI + "?columnId=" + curColumn.id});
        var tempColumn = curColumn;
        var safeCount = 10;
        while (tempColumn.parentId != "col_ProductRoot") {
            tempColumn = ColumnService.getColumn(tempColumn.parentId);
            position.unshift({id: tempColumn.id, title: tempColumn.title, url: requestURI + "?columnId=" + tempColumn.id});
            if(safeCount < 0){
                //超出10层了
                break;
            }
            safeCount--;
        }

        var fetchCount = 20;
        var searchArgs = {keyword: keyword, fromPath: (page - 1) * fetchCount, fetchCount: fetchCount, showState: showState, path: columnId};

        if(stockState && (stockState == "1" || stockState == "0")){
            searchArgs["stockout"] = stockState;
        }

        if (brandIds) {
            var ids = [];
            var splitBrand = brandIds.split("--");
            for (var i = 0; i < splitBrand.length; i++) {
                ids.push(splitBrand[i]);
            }
            searchArgs["brandIds"] = ids;
        }
        if(brands){
            var brandNames = [];
            var splitName = brands.split(",");
            for (var i = 0; i < splitName.length; i++) {
                brandNames.push(splitName[i]);
            }
            searchArgs["brands"] = brandNames;
        }
        if (otherParams) {
            var jOtherParams = {};
            var attrsParams = otherParams.split(";");
            for(var i=0;i<attrsParams.length;i++){
                var attrParam = attrsParams[i].split("--");
                jOtherParams[attrParam[0] + '_multiValued'] = attrParam[1];

            }
            searchArgs.otherParams = jOtherParams;
        }
        if (lowTotalPrice) {
            searchArgs.lowTotalPrice = parseFloat(lowTotalPrice * 100);
        }
        if (highTotalPrice) {
            searchArgs.highTotalPrice = parseFloat(highTotalPrice * 100);
        }

        var searchFactLevel = 3 + position.length - 1;
        var column_facetColumn = "column_facetColumn" + searchFactLevel;
        var column_facetColumn1 = "column_facetColumn" + (searchFactLevel + 1);
        var column_facetColumn2 = "column_facetColumn" + (searchFactLevel + 2);
        searchArgs.facetFields = ["brand","brandId", column_facetColumn, column_facetColumn1, column_facetColumn2];
        //属性搜索参数
        var attrTemp = ColumnService.getCompleteAttrTemplateByColumnId(columnId);
        if (attrTemp) {
            attrTemp = $.toJavaJSONObject(attrTemp);
        }
        var attrGroups = ColumnService.getAttrGroups(attrTemp);
        var importAttrList = [];
        for (var num = 0; num < attrGroups.size(); num++) {
            var obj = attrGroups.get(num);
            var importAttrs = ColumnService.getImportantPropertyAttrs(obj);
            if (importAttrs) {
                for (var num2 = 0; num2 < importAttrs.size(); num2++) {
                    var attr = JSON.parse("" + importAttrs.get(num2).toString());
                    searchArgs.facetFields.push(attr.id + "_multiValued");
                    importAttrList.push(attr);
                }
            }
        }

        if (orderBy == 'saleCount') {
            searchArgs.sortFields = [
                {field: "salesCount", type: "LONG", reverse: true}
            ];
        }
        if (orderBy == 'priceHigh') {
            searchArgs.sortFields = [
                {
                    field: "price",
                    type: "LONG",
                    reverse: true
                }
            ];
        }
        if (orderBy == 'priceLow') {
            searchArgs.sortFields = [
                {
                    field: "price",
                    type: "LONG",
                    reverse: false
                }
            ];
        }
        if (orderBy == 'publishTime') {
            searchArgs.sortFields = [
                {
                    field: "lastModifyTime",
                    type: "STRING",
                    reverse: true
                }
            ];
        }
        if (orderBy == 'default' || !orderBy) {
            searchArgs.sortFields = [
                {
                    field: "head_merchant_"+columnId+"_PosOrder",
                    type: "LONG",
                    reverse: false
                },
                {
                    field: "lastModifyTime",
                    type: "STRING",
                    reverse: true
                }
            ];
        }


        var searchArgsString = JSON.stringify(searchArgs);
        var javaArgs = ProductApi.ProductSearchArgs.getFromJsonString(searchArgsString);
        var results = ProductApi.IsoneFulltextSearchEngine.searchServices.search(javaArgs);
        var versionIds = results.getLists();

        var products = [];
        if(versionIds.size() > 0){
            var cxt = "{attrs:{},factories:[{factory:RPF},{factory:MF,isBasePrice:true}]}";
            var jContext = new ProductApi.JSONObject(cxt);
            var priceContext = jContext.getObjectMap();

            var versionList = [];
            var defaultSize = spec.split("X")[0];
            var versionList = ProductApi.IsoneModulesEngine.productService.getListDataByIds(versionIds, false);
            versionList = ProductApi.PricePolicyHelper.getPriceValueList(versionList, userId, pageData["_m_"], priceContext, "normalPricePolicy");  //一次性获取商品价格
            versionList = Packages.net.xinshi.isone.modules.filemanagement.ImageRelatedFileUtil.getProductsFirstRelatedSizeImageFullPath(versionList, spec, "/upload/nopic_" + defaultSize + ".jpg");//一次性获取商品大小图


            for (var i = 0; i < versionList.size(); i++) {
                var jProduct = JSON.parse(versionList.get(i).toString());
                var highlight = ProductApi.DiscoveryHelper.getHighLightText(results, javaArgs, jProduct.objId, jProduct.name);
                jProduct.name = "" + highlight;

                /*获取促销图标*/
                var sysArgumentPromotionLogo = allPromotionLogo[jProduct.merchantId];
                if(!sysArgumentPromotionLogo){
                    sysArgumentPromotionLogo = ProductApi.IsoneModulesEngine.sysArgumentService.getSysArgument(jProduct.merchantId, "c_promotionLogo", false);
                    allPromotionLogo[jProduct.merchantId] = sysArgumentPromotionLogo;
                }

                var promotionLogosArray = [];
                var promotionLogosList = ProductService.getProductPromotionLogo(versionList.get(i), sysArgumentPromotionLogo);
                if(promotionLogosList != null && promotionLogosList.size() > 0){
                    for(var j=0;j<promotionLogosList.size();j++){
                        var logoJson = JSON.parse(promotionLogosList.get(j).toString());
                        logoJson.realPath = FileService.getRelatedUrl(logoJson.value,"");
                        promotionLogosArray.push(logoJson);
                    }
                }

                var priceList = jProduct.priceValues;
                var memberPrice = "",marketPrice = "";
                if (priceList && priceList.length > 0) {
                    if (priceList[0]) {
                        memberPrice = priceList[0].formatTotalPrice;
                    }
                    if (priceList[1]) {
                        marketPrice = priceList[1].formatTotalPrice;
                    }
                }

                var supplyAndDeliveryDescAttrId = GlobalVariableManagementService.getValueByName("supplyAndDeliveryDescAttrId");//供货发货简述
                var countryNameAttrId = GlobalVariableManagementService.getValueByName("countryNameAttrId");//取国旗
                var supplyAndDeliveryDesc = "",countryPicUrl = "";
                if(jProduct.DynaAttrs){
                    if(supplyAndDeliveryDescAttrId && jProduct.DynaAttrs[supplyAndDeliveryDescAttrId]){
                        supplyAndDeliveryDesc = jProduct.DynaAttrs[supplyAndDeliveryDescAttrId].value;
                    }

                    if(countryNameAttrId && jProduct.DynaAttrs[countryNameAttrId]){
                        var value = (jProduct.DynaAttrs[countryNameAttrId].value).trim();
                        countryPicUrl = GlobalVariableManagementService.getValueByName(value + "_20X20");
                        if(!countryPicUrl){
                            countryPicUrl = GlobalVariableManagementService.getValueByName(value);
                        }
                    }

                }

                var productData = {
                    name: jProduct.name,
                    memberPrice: memberPrice,
                    marketPrice: marketPrice,
                    titleColor: (jProduct.title1 && jProduct.title1.style && jProduct.title1.style.color ? jProduct.title1.style.color : ''),
                    name: jProduct.name,
                    logos: [jProduct.image0],
                    id: jProduct.objId,
                    salesAmount: ProductService.getSalesAmount(jProduct.objId)||0,
                    merchantId: jProduct.merchantId,
                    sellingPoint: jProduct.sellingPoint,
                    promotionLogosArray:promotionLogosArray,
                    supplyAndDeliveryDesc:supplyAndDeliveryDesc,
                    countryPicUrl:countryPicUrl
                };
                products.push(productData);
            }
        }

        var result = {
            products: products,
            total: 0 + results.getTotal()
        }

        var searchCondition = ProductService.getFacets(results.getFacets(), column_facetColumn);

        //过滤搜索有效的分类
        var columnFilter = function (columnData, displayColumn) {
            var newColumnData = [];
            for (var i = 0; i < columnData.length; i++) {
                for (var j = 0; j < displayColumn.length; j++) {
                    if (columnData[i].id == displayColumn[j].name) {
                        newColumnData.push(columnData[i]);
                    }
                }
            }
            return newColumnData;
        }
        //搜索出来的商品所属分类
        var allSearchColumnsValue = [];
        for (var i = 0; i < 3; i++) {
            var searchColumnsValue = $.java2Javascript(results.getFacets().get("column_facetColumn" + (searchFactLevel + i)));
            for (var j = 0; j < searchColumnsValue.length; j++) {
                allSearchColumnsValue.push(searchColumnsValue[j]);
            }
        }
        //获取侧栏分类数据
        //取3级
        var leftColumnData = {};
//        leftColumnData["curColumn"] = ColumnService.getColumn(position[1].id);
//        var childrenColumns = ColumnService.getChildren(position[1].id);
//        for(var i =0;i<childrenColumns.length;i++){
//            var childrenList = ColumnService.getChildren(childrenColumns[i].id);
//            if(childrenList){
//                childrenColumns[i].children = childrenList;
//
//            }
//        }
//        leftColumnData["columnList"] = childrenColumns;

        var columnData = ColumnService.getChildren(columnId);
        columnData = columnFilter(columnData, allSearchColumnsValue);//过滤分类
        if(columnData){
            for (var i = 0; i < columnData.length; i++) {
                var childObj = ColumnService.getChildren(columnData[i].id);
                childObj = columnFilter(childObj, allSearchColumnsValue);//过滤分类
                columnData[i].children = childObj;
            }
        }


        searchCondition.DynaAttr = [];
        if (importAttrList && importAttrList.length > 0) {
            for (var i = 0; i < importAttrList.length; i++) {
                var attr = importAttrList[i];
                if(!(attr.standardValues && attr.standardValues.length > 0)){
                    continue;
                }
                //$.log(attr.standardValues.toSource())
                var list = results.getFacets().get(attr.id + "_multiValued");

                if(!(list && list.size() > 0)){
                    continue;
                }
                var matchValues = JSON.parse(ProductService.getJSONFormList(list));

                if(matchValues && matchValues.length > 0){
                    var displayValues = [],isSelected = false,selectedKey = "";
                    //for(var j=0;j<matchValues.length;j++){
                    //    for(var k=0;k<attr.standardValues.length;k++){
                    //        if(matchValues[j].name == attr.standardValues[k].id){
                    //            displayValues.push({id:matchValues[j].name,name:attr.standardValues[k].name,value:matchValues[j].value});
                    //            break;
                    //        }
                    //    }
                    //
                    //    if(searchArgs.otherParams){
                    //        for(var key in searchArgs.otherParams){
                    //            if(attr.id + "_multiValued" == key && matchValues[j].name == searchArgs.otherParams[key]){
                    //                isSelected = true;
                    //                selectedKey = matchValues[j].name
                    //                break;
                    //            }
                    //        }
                    //    }
                    //}

                    for(var k=0;k<attr.standardValues.length;k++){
                        for(var j=0;j<matchValues.length;j++){
                            if(matchValues[j].name == attr.standardValues[k].id){
                                displayValues.push({id:matchValues[j].name,name:attr.standardValues[k].name,value:matchValues[j].value});
                                break;
                            }
                        }
                        if(searchArgs.otherParams){
                            for(var key in searchArgs.otherParams){
                                if(attr.id + "_multiValued" == key && matchValues[j].name == searchArgs.otherParams[key]){
                                    isSelected = true;
                                    selectedKey = matchValues[j].name
                                    break;
                                }
                            }
                        }
                    }




                    if(displayValues.length == 0){
                        continue;
                    }
                    searchCondition.DynaAttr.push({
                        attrName:attr.name,
                        attrId:attr.id,
                        displayValues:displayValues,
                        isSelected:isSelected,
                        selectedKey:selectedKey
                    });
                }
            }
        }




        var selectedConditions = [];
        //if(searchCondition.brandNameList && searchArgs["brands"]){
        //    for(var i=0;i< searchCondition.brandNameList.length;i++){
        //        //for(var j=0;j < searchArgs["brandIds"].length;j++){
        //        //    if(searchArgs["brandIds"][j] == searchCondition.brandList[i].name){
        //                selectedConditions.push({key:"品牌",value:searchCondition.brandNameList[i].displayName,type:"brand"});
        //            //}
        //        //}
        //    }
        //}

        if(searchCondition.brandList){

            searchCondition.brandList.unshift({
                displayName:"全部",
                url:UrlBuilder.rebuildUrl('brandIds',"")
            });

            for(var i=1;i< searchCondition.brandList.length;i++){

                searchCondition.brandList[i].url = UrlBuilder.rebuildUrl('brandIds',searchCondition.brandList[i].name);

                if(searchArgs["brandIds"]){
                    for(var j=0;j < searchArgs["brandIds"].length;j++){
                        if(searchArgs["brandIds"][j] == searchCondition.brandList[i].name){
                            selectedConditions.push({key:"品牌",value:searchCondition.brandList[i].displayName,type:"brand",url:UrlBuilder.removeBrandIdsUrl(searchCondition.brandList[i].name)});
                        }
                    }
                }

            }
        }

        if(searchCondition.column_facetColumn){
            for(var i=0;i< searchCondition.column_facetColumn.length;i++){

                searchCondition.column_facetColumn[i].url = UrlBuilder.rebuildUrl('columnId',searchCondition.column_facetColumn[i].name);

                //if(searchArgs["columnId"]){
                //
                //    if(searchArgs["columnId"][j] == searchCondition.column_facetColumn[i].name){
                //        selectedConditions.push({key:"类别",value:searchCondition.column_facetColumn[i].displayName,type:"column",url:UrlBuilder.rebuildUrl("columnId","")});
                //    }
                //
                //}

            }
        }


        if(searchCondition.DynaAttr){
            for(var i=0;i< searchCondition.DynaAttr.length;i++){
                if(searchCondition.DynaAttr[i].isSelected){
                    var condition = {
                        key:searchCondition.DynaAttr[i].attrName
                    };
                    var value = "";
                    var displayValues = searchCondition.DynaAttr[i].displayValues;
                    if(displayValues){
                        for(var j=0;j<displayValues.length;j++){
                            if(displayValues[j].id = searchCondition.DynaAttr[i].selectedKey){
                                value = displayValues[j].name;
                                break;
                            }
                        }
                    }
                    condition.value = value;
                    condition.type = "attr";
                    condition.attrId = searchCondition.DynaAttr[i].attrId;
                    selectedConditions.push(condition);
                }
            }
        }

        if(false){
            var brandConditionIndex = 0,maxCount = 0;
            if(curColumn.DynaAttrs && curColumn.DynaAttrs['attr_product_col_002'] && curColumn.DynaAttrs['attr_product_col_002'].value != ""){
                brandConditionIndex = parseInt(curColumn.DynaAttrs['attr_product_col_002'].value) - 1;
                if(brandConditionIndex < 0){
                    brandConditionIndex = 0;
                }
            }


            var conditionList = [];
            if(searchCondition.DynaAttr  && searchCondition.DynaAttr.length > 0){
                for(var i=0;i< searchCondition.DynaAttr.length;i++){
                    conditionList.push({
                        type:"attr",
                        data:searchCondition.DynaAttr[i],
                        showName:searchCondition.DynaAttr[i].attrName
                    });
                }

                if(searchCondition.brandNameList && searchCondition.brandNameList.length > 0){
                    var tempBrandData = {
                        type:"brand",
                        data:searchCondition.brandNameList,
                        showName:"品牌"
                    };
                    if(brandConditionIndex > searchCondition.DynaAttr.length - 1){
                        conditionList.push(tempBrandData);
                    }else{
                        conditionList.splice(brandConditionIndex,0,tempBrandData)
                    }
                }



            }else{
                if(searchCondition.brandNameList && searchCondition.brandNameList.length > 0){
                    conditionList.push({
                        type:"brand",
                        data:searchCondition.brandNameList,
                        showName:"品牌"
                    });
                }
            }


            //可用搜索条件
            setPageDataProperty(pageData, "conditionList", conditionList);

        }

        //$.log(ProductService.getJSONFormList(results.getFacets().get("brand")))




        //获取浏览记录
        var viewHistoryProducts = [];
        //var viewHistory = ProductService.getProductViewHistory(request, 6);
        //for (var i = 0; i < viewHistory.length; i++) {
        //    var historyProduct = {};
        //    var salesAmount = ProductService.getSalesAmount(viewHistory[i].objId) || 0;
        //    historyProduct.salesAmount = salesAmount;
        //    historyProduct.id = viewHistory[i].objId;
        //    historyProduct.name = viewHistory[i].name;
        //    var hMarketPrice = ProductService.getMarketPrice(viewHistory[i]);
        //    var hMemberPrice = ProductService.getMemberPrice(viewHistory[i]);
        //    if (hMarketPrice) {
        //        historyProduct.marketPrice = parseFloat(hMarketPrice).toFixed(2);
        //    } else {
        //        historyProduct.marketPrice = "暂无价格";
        //    }
        //    if (hMemberPrice) {
        //        historyProduct.memberPrice = parseFloat(hMemberPrice).toFixed(2);
        //    } else {
        //        historyProduct.memberPrice = "暂无价格";
        //    }
        //
        //    var pics = ProductService.getPics(viewHistory[i]);
        //    var realPices = [];
        //    for (var j = 0; j < pics.length; j++) {
        //        var relatedUrl = FileService.getRelatedUrl(pics[j].fileId, "180X180");
        //        realPices.push(relatedUrl);
        //    }
        //    historyProduct.pics = realPices;
        //    viewHistoryProducts.push(historyProduct);
        //}

        //seo数据
        var seo = {};
        var columnObj = curColumn;
        var allChildrenColumn = ColumnService.getChildren(columnObj.parentId);
        var seoColumnNames = "";
        for (var i = 0; i < allChildrenColumn.length; i++) {
            seoColumnNames += allChildrenColumn[i].name + ",";
        }
        var webName = SysArgumentService.getSysArgumentStringValue("head_merchant", 'col_sysargument', 'webName_cn');
        seo.seo_description = columnObj.name + "-" + webName + ",销售" + seoColumnNames + "," + webName + seoColumnNames + "价格优惠";
        seo.seo_title = columnObj.name + "-" + webName + "," + columnObj.name + "报价";
        seo.seo_keywords = columnObj.name + "-" + webName + "," + seoColumnNames;


        var webUrl = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl");
        setPageDataProperty(pageData,"webUrl",webUrl);
        setPageDataProperty(pageData,"userId",!userId ? "unknown" : userId);



        setPageDataProperty(pageData, "searchKeyword", keyword + "");
        setPageDataProperty(pageData, "searchKeywordEncode", encodeURIComponent(keyword) + "");
        //商品分类
        setPageDataProperty(pageData, "curColumn", curColumn);
        setPageDataProperty(pageData, "seo", seo);
        setPageDataProperty(pageData, "columnId", columnId);
        setPageDataProperty(pageData, "columnChildren", columnData);
        setPageDataProperty(pageData, "leftColumnData", leftColumnData);
        //面包线
        setPageDataProperty(pageData, "position", position);
        //商品列表数据
        setPageDataProperty(pageData, "productList", result);
        //可用搜索条件
        setPageDataProperty(pageData, "searchCondition", searchCondition);
        setPageDataProperty(pageData, "selectedConditions", selectedConditions);
        //用户已选搜索条件
        searchArgs.orderBy = orderBy;
        setPageDataProperty(pageData, "searchHistory", searchArgs);
        //浏览历史
        setPageDataProperty(pageData, "viewHistoryProducts", viewHistoryProducts);
        setPageDataProperty(pageData, "allSearchColumnsValue", allSearchColumnsValue);

        setPageDataProperty(pageData, "paramBrandId", brandId + "");
        setPageDataProperty(pageData, "requestURI", requestURI + "");
        setPageDataProperty(pageData, "requestParams", $.params);
        setPageDataProperty(pageData, "pageCur", parseInt(page));
        setPageDataProperty(pageData, "pageSize", parseInt(pageSize));
        setPageDataProperty(pageData, "pageNum", parseInt((result.total + pageSize - 1) / pageSize));


        setPageDataProperty(pageData, "defaultOrderByLink", UrlBuilder.rebuildUrl('orderBy','default'));
        setPageDataProperty(pageData, "priceHighOrderByLink", UrlBuilder.rebuildUrl('orderBy','priceHigh'));
        setPageDataProperty(pageData, "priceLowOrderByLink", UrlBuilder.rebuildUrl('orderBy','priceLow'));
        setPageDataProperty(pageData, "saleCountOrderByLink", UrlBuilder.rebuildUrl('orderBy','saleCount'));
        setPageDataProperty(pageData, "publishTimeOrderByLink", UrlBuilder.rebuildUrl('orderBy','publishTime'));


        setPageDataProperty(pageData, "prevPageLink", (parseInt(page) > 1 ? UrlBuilder.rebuildPageUrl('page',(parseInt(page) - 1) + '') : 'javascript:;'));
        setPageDataProperty(pageData, "nextPageLink", (pageData['pageCur'] < pageData['pageNum'] ? UrlBuilder.rebuildPageUrl('page',(parseInt(page) + 1) + '') : 'javascript:;'));





        if(cacheTime > 0 && pageData.productionMode && false){
            setPageDataProperty(pageData, "lastProcessTime", new Date().getTime());

            ps20.saveContent(dataCacheKey,JSON.stringify(pageData));

        }
        $.log("=======nocacheUseTime=" + (new Date().getTime() - processTime) + "ms")

    });



    processor.on(":productGroup", function (pageData, dataIds, elems) {
        var selfApi = new JavaImporter(
            Packages.net.xinshi.isone.modules,
            Packages.net.xinshi.isone.modules.product.inventory,
            Packages.net.xinshi.isone.modules.appmarket,
            Packages.net.xinshi.isone.modules.appmarket.service.impl,
            Packages.org.json
        );
        try {

            //var kuajingLogoUrl = "";
            //var app = AppService.getApp(rappId);
            //var fileId = Packages.net.xinshi.isone.modules.appmarket.Is1AppMarketEngine.appPages.getResFileId(app.md5, "res/images/kuajing.png");
            //if(fileId) {
            //    var kuajingLogoUrl = selfApi.Is1AppMarketEngine.appPages.getUrlFromFileId(fileId, "");
            //    if(kuajingLogoUrl){
            //        kuajingLogoUrl = kuajingLogoUrl + "";
            //    }
            //}
            var productIds = [],getInventoryProductIds = [], versionList = [];
            var user = LoginService.getFrontendUser();
            var userId = user ? user.id : '-1';

            for (var i = 0, iLength = elems.length; i < iLength; i++) {
                var elem = elems[i];
                if (elem) {
                    var dataId = dataIds[i];
                    for (var j = 0, jLength = elem.length; j < jLength; j++) {
                        var productId = elem[j].id;
                        if (productIds.indexOf(productId) == -1) {
                            productIds.push(productId);
                        }
                        if(dataId == "qiangxian" || dataId == "groupOn" || dataId.indexOf("qiangxian1.pro_") > -1){
                            if (getInventoryProductIds.indexOf(productId) == -1) {
                                getInventoryProductIds.push(productId);
                            }
                        }
                    }
                }
            }


            if (productIds.length > 0) {
//                var cxt = "{isGetInventory:'true',attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                var cxt = "{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                versionList = ProductService.getProductsByIdsWithoutPrice(productIds);
                versionList = ProductService.getPriceValueListBatch($.toJSONObjectList(versionList), userId, pageData["_m_"], cxt, "normalPricePolicy");

                //var allPromotionLogo = {};
                //for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                //    /*获取促销图标*/
                //    var sysArgumentPromotionLogo = allPromotionLogo[versionList[k].merchantId];
                //    if(!sysArgumentPromotionLogo){
                //        sysArgumentPromotionLogo = ProductApi.IsoneModulesEngine.sysArgumentService.getSysArgument(versionList[k].merchantId, "c_promotionLogo", false);
                //        allPromotionLogo[versionList[k].merchantId] = sysArgumentPromotionLogo;
                //    }
                //
                //
                //    var promotionLogosArray = [];
                //    var promotionLogosList = ProductService.getProductPromotionLogo($.toJavaJSONObject(versionList[k]), sysArgumentPromotionLogo);
                //    if(promotionLogosList != null && promotionLogosList.size() > 0){
                //        for(var ix=0;ix<promotionLogosList.size();ix++){
                //            var logoJson = JSON.parse(promotionLogosList.get(ix).toString());
                //            logoJson.realPath = FileService.getRelatedUrl(logoJson.value,"58X58");
                //            promotionLogosArray.push(logoJson);
                //        }
                //    }
                //    versionList[k].promotionLogosArray = promotionLogosArray;
                //}



                if (versionList.length > 0) {
                    var productStocks = {};
                    for (var i = 0, iLength = elems.length; i < iLength; i++) {
                        var elem = elems[i];
                        if (elem) {
                            for (var j = 0, jLength = elem.length; j < jLength; j++) {
                                var productId = elem[j].id;
                                for (var k = 0, vLength = versionList.length; k < vLength; k++) {
                                    var product = versionList[k];
                                    if (productId == product.objId) {
                                        elem[j].merchantId = product.merchantId + "";
                                        elem[j].name = product.name;
                                        if(product.sellingPoint){
                                            elem[j].sellingPoint = Packages.net.xinshi.isone.commons.TextUtil.cleanHTML(product.sellingPoint,"") + "";
                                        }
                                        //if(product.promotionLogosArray.length > 0){
                                        //    elem[j].promotionLogo = product.promotionLogosArray[0];
                                        //}

                                        var merchant =  MerchantService.getMerchant(product.merchantId);
                                        if(merchant.mainColumnId == "c_cross_border_merchant"){
                                            if(kuajingLogoUrl){
                                                var pLogo = {realPath:kuajingLogoUrl};
                                                elem[j].promotionLogo = pLogo;
                                            }
                                        }


                                        var newProductPrices = product.priceValues;

                                        if (newProductPrices) {
                                            var realPrice = newProductPrices[1] && newProductPrices[1].formatUnitPrice;
                                            if (realPrice) {
                                                var price = parseFloat(realPrice).toFixed(2);
                                                elem[j]["memberPriceString"] = "<i>&yen;</i>" + price;
                                                elem[j]["memberPrice"] = price;
//                                                elem[j]["sellableCount"] = newProductPrices[1].sellableCount;
                                                elem[j]["beginDateTime"] = newProductPrices[1].beginDateTime;
                                                elem[j]["endDateTime"] = newProductPrices[1].endDateTime;
                                                elem[j]["priceName"] = newProductPrices[1].priceName;
                                                elem[j]["salesAmount"] = newProductPrices[1].salesAmount;
                                            } else {
                                                elem[j]["memberPriceString"] = "";
                                                elem[j]["memberPrice"] = 0;
                                            }
                                            ;
                                            var marketPrice = newProductPrices[0] && newProductPrices[0].formatUnitPrice;
                                            if (marketPrice) {
                                                var price = parseFloat(marketPrice).toFixed(2);
                                                elem[j]["marketPriceString"] = "￥" + price;
                                                elem[j]["marketPrice"] = price;
                                            }else{
                                                elem[j]["marketPriceString"] = "";
                                                elem[j]["marketPrice"] = 0;
                                            }
                                        }

                                        if (getInventoryProductIds.indexOf(productId) > -1) {
                                            if (productStocks[productId]) {
                                                elem[j]["sellableCount"] = productStocks[productId];
                                            }else{
                                                var jProduct = $.toJavaJSONObject({"objId":product.objId,"merchantId":product.merchantId});
                                                var jProductStock = selfApi.ProductInventoryHelper.getOneProductInventory(jProduct,jProduct["merchantId"]);
                                                productStocks[productId] = jProductStock.optInt(jProduct.optString("objId"));
                                                elem[j]["sellableCount"] = productStocks[productId];
                                            }
                                            //var sellableCount = parseInt(productStocks[productId]);
                                            //var stockWidth = sellableCount > 100 ? 100 : sellableCount;
                                            //elem[j]["stockWidth"] = stockWidth;

                                        }

                                        var pics = ProductService.getPics(product);
                                        if(pics.length > 0){
                                            elem[j]["imgUrl"] = FileService.getRelatedUrl(pics[0].fileId,elem[j]["spec"]);
                                        }


                                        var supplyAndDeliveryDescAttrId = GlobalVariableManagementService.getValueByName("supplyAndDeliveryDescAttrId");//供货发货简述
                                        var countryNameAttrId = GlobalVariableManagementService.getValueByName("countryNameAttrId");//取国旗
                                        var supplyAndDeliveryDesc = "",countryPicUrl = "";
                                        if(product.DynaAttrs){
                                            if(supplyAndDeliveryDescAttrId && product.DynaAttrs[supplyAndDeliveryDescAttrId]){
                                                supplyAndDeliveryDesc = product.DynaAttrs[supplyAndDeliveryDescAttrId].value;
                                            }

                                            if(countryNameAttrId && product.DynaAttrs[countryNameAttrId]){
                                                var value = (product.DynaAttrs[countryNameAttrId].value).trim();
                                                countryPicUrl = GlobalVariableManagementService.getValueByName(value + "_20X20");
                                                if(!countryPicUrl){
                                                    countryPicUrl = GlobalVariableManagementService.getValueByName(value);
                                                }
                                            }

                                        }

                                        elem[j].supplyAndDeliveryDesc = supplyAndDeliveryDesc;
                                        elem[j].countryPicUrl = countryPicUrl;


                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            $.log(e);
        }
    });



})(dataProcessor);