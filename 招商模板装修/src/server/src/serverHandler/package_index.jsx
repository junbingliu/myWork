//#import Util.js
//#import product.js
//#import login.js
//#import sysArgument.js
//#import search.js
//#import file.js
//#import session.js
//#import $combiproduct:services/CombiProductService.jsx
//#import $FangXingBase:services/FangXingService.jsx
//#import $BuildingGuide:tools/buildingUtil.jsx
//#import $FangXingBase:tools/roomUtil.jsx
//#import $globalUserCacheStore:services/GlobalUserCacheStoreService.jsx

(function () {
    try{
        var qs = $.params.q;
        var query = JSON.parse(qs);
        var start = ("" + query.start)||1;
        //var limit = ("" + query.limit)||100;
        var limit=""+100;
        var direction = "" + query.direction;
        var orderBy =""+query.sort;
        var columnId=""+query.q.columnId;//分类
        var fanxinId=""+query.q.fanxinId;//户型
        var keyword = "*";
        var userId = LoginService.getFrontendUserId();

        var fangxing =  GlobalUserCacheStoreService.getValueByKey(userId, "selectFangXingId");
        var roomtype =  GlobalUserCacheStoreService.getValueByKey(userId, "selectFangXingtype");


        if (fanxinId && fanxinId != "") {
            keyword = keyword + " AND fanxinId_multiValued:" + fanxinId;
            if(fangxing!=fanxinId){
                SessionService.addSessionValue("selectFangXingId",fanxinId,request,response);
            }
        }else{
            if (fangxing && fangxing != "") {
                keyword = keyword + " AND fanxinId_multiValued:" + fangxing;
            }
        }
        if(columnId){
            keyword= keyword + " AND columnIds_multiValued:"+columnId;
        }
        var sortFields = "";
        //默认选择。销量。价格
        if (orderBy == 'sellCount') {
            if(direction=="asc"){
                sortFields = sortFields + "sales_i asc";
            }else {
                sortFields = sortFields + "sales_i desc";
            }
        }

        if (orderBy == 'price_tl') {
            if(direction=="asc"){
                sortFields = sortFields + "price_f asc,";
            }else{
                sortFields = sortFields + "price_f desc,";
            }

        }

        //if (orderBy == 'createTimeHigh') {
        //    sortFields = sortFields + "createTime_time desc,";
        //}
        //if (orderBy == 'createTime') {
        //    sortFields = sortFields + "createTime_time asc,";
        //}

        if (orderBy == '' || (!keyword && !orderBy)) {
            sortFields = sortFields + "publishedTime_tdt desc,";
        }



        var searchArgs = {
            fq: "type:combiProduct AND deleted:F AND  published:T",
            q:keyword,
            fl:"id",
            start:start+"",
            sort:sortFields,
            wt:"json",
            rows : limit+""
        };
        $.log("searchArgs=="+JSON.stringify(searchArgs));
        var resString = SearchService.searchSolr("isoneEmall",searchArgs);
        $.log("keywresStringord==  ====================================="+resString)
            var res = JSON.parse(resString);
        if (res) {
            var ids = res.response.docs.map(function (doc) {
                return doc.id
            });
            var combiProducts = CombiProductService.getCombiProducts(ids);
            for (var x = 0; x < combiProducts.length; x++) {
                var combiProduct = combiProducts[x];
                var fixedPrice = combiProduct.fixedPrice;
                var packagePrice = "0";
                if (fixedPrice == "Y") {
                    if(!isNaN(combiProduct.priceRecs[0].price)) {
                        packagePrice = (combiProduct.priceRecs[0].price * 1).toFixed(2);
                    }
                } else {
                    packagePrice = combiProduct.price;
                }
                var id = combiProducts[x].id;
                var bigRelatedUrl = [];
                for (var y = 0; y < combiProduct.fileIds.length; y++) {
                    if (combiProduct.fileIds[y]) {
                        bigRelatedUrl[y] = FileService.getRelatedUrl(combiProduct.fileIds[y], "603X402");
                    }

                }

                var marketPriceTotal = 0;    //子商品市场价
                var packagePriceTwo = 0;      //子商品会员价和
                var isNeed = false; //是否有默认商品
                for (var z = 0; z < combiProduct.parts.length; z++) {
                    var value = combiProduct.parts[z];
                    var options = value.options;
                    for (var s = 0; s < options.length; s++) {
                        var prices = options[s].marketPrice;
                        if (options[s].priceType == "percent") {
                            options[s].price = (options[s].price * options[s].percentage / 100).toFixed(2);
                        }
                        if (options[s].isDefault) {
                            if(!isNaN(prices)) {
                                marketPriceTotal += prices * 1 * Number(options[s].num);
                            }
                            if(!isNaN(options[s].price)){
                                packagePriceTwo += options[s].price * 1 * Number(options[s].num);
                            }

                            isNeed = true;
                        }
                        if (s == (options.length - 1) && !isNeed) {
                            if(!isNaN(options[0].marketPrice)) {
                                marketPriceTotal += options[0].marketPrice * 1 * Number(options[0].num);
                            }
                            if(!isNaN(options[0].price)) {
                                packagePriceTwo += options[0].price * 1 * Number(options[0].num);
                            }
                        }
                    }
                }
                if (combiProduct.fixedPrice!="Y"&&!combiProduct.isDefault) {
                    packagePrice = packagePriceTwo.toFixed(2);
                }
                //$.log("combiProducts===="+JSON.stringify(combiProducts[x]))
                combiProducts[x].price = (combiProducts[x].price * 1).toFixed(2);
                combiProducts[x].imgRealyUrl = bigRelatedUrl;
                combiProducts[x].roomtype = roomtype||"";
                combiProducts[x].packagePrice = packagePrice;
                combiProducts[x].marketPriceTotal = marketPriceTotal.toFixed(2);
                combiProducts[x].id = id;

            }

            var ret = {
                state: "ok",
                result: {
                    numFound: res.response.numFound,
                    start: res.response.start,
                    docs: combiProducts
                }
            }
            out.print(JSON.stringify(ret));
        }
    }catch(e){
        out.print(JSON.stringify(e))
     }

    })();



function addAreaAndMon(arr){
    var start;
    var end="";
    var newArr;
    if(arr.indexOf("小于")!=-1){
        start="*";
        end=arr.substr(2);
    }
    if(arr.indexOf("-")!=-1){
        var data=arr.split("-");
        start=data[0];
        end=data[1];
    }
    if(arr.indexOf("大于")!=-1){
        start=arr.substr(2);
        end="*";

    }
    newArr="["+start+" TO "+end+"]";
    return newArr;
}


