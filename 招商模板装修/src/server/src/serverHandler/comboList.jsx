//#import Util.js
//#import product.js
//#import login.js
//#import sysArgument.js
//#import search.js
//#import file.js
//#import $combiproduct:services/CombiProductService.jsx
//#import $FangXingBase:services/FangXingService.jsx

//#import Util.js
//#import credit.js
//#import product.js
//#import productCredit.js
//#import file.js
//#import column.js
//#import appraise.js
//#import message.js
//#import commend.js
//#import price.js
//#import inventory.js
//#import ViewHistory.js
//#import login.js
//#import pageManager.js
//#import bom.js
//#import buyAlsoBuy.js
//#import viewAlsoView.js
//#import sysArgument.js
//#import user.js
//#import merchant.js

(function () {
    var qs = $.params.q;
    var query = JSON.parse(qs);
    var start = ("" + query.start)||1;
    var limit = ("" + query.limit)||100;
    var direction = "" + query.direction;
    var orderBy =""+query.sort;

    var keyword = "*";
    var userId = LoginService.getFrontendUserId();

    var sortFields = "";
    //默认选择。销量。价格
    if (orderBy == 'sellCount') {
        if(direction=="asc"){
        sortFields = sortFields + "salesCount asc";
        }else {
            sortFields = sortFields + "salesCount desc";
        }
    }

    if (orderBy == 'price_tl') {
        if(direction=="asc"){
            sortFields = sortFields + "price_f asc,";
        }else{
            sortFields = sortFields + "price_f desc,";
        }

    }

    if (orderBy == 'createTimeHigh') {
        sortFields = sortFields + "createTime_time desc,";
    }
    if (orderBy == 'createTime') {
        sortFields = sortFields + "createTime_time asc,";
    }

    if (orderBy == '' || (!keyword && !orderBy)) {
        sortFields = sortFields + "createTime_time desc,";
    }


    var searchArgs = {
        fq: "type:combiProduct AND deleted:F AND certified:T AND published:T",
        q: "title_text:" + keyword,
        fl: "id",
        start: start,
        sort: sortFields,
        wt: "json",
        rows: limit
    };


    var res = SearchService.directSearch("combiProduct", searchArgs);
    if (res) {
        var ids = res.response.docs.map(function (doc) {
            return doc.id
        });
        var cxt="{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
        var combiProducts = CombiProductService.getCombiProducts(ids);
        for (var x = 0; x < combiProducts.length; x++) {
            var combiProduct = combiProducts[x];
            var packagePrice = (combiProduct.priceRecs[0].price * 1).toFixed(2);
            var id = combiProducts[x].id;
            var bigRelatedUrl = [];
            for (var y = 0; y < combiProduct.fileIds.length; y++) {
                if (combiProduct.fileIds[y]) {
                    bigRelatedUrl[y] = FileService.getRelatedUrl(combiProduct.fileIds[y], "600X400");
                }
            }
            var price = 0;
            for(var z=0;z< combiProduct.productItems.length;z++){
                var productId = combiProduct.productItems[z].productId;
                var product = ProductService.getProduct(productId);
                var newProductPrices=ProductService.getPriceValueList(productId,userId,product&&product.merchantId,1,cxt,"normalPricePolicy");
                var marketPrice = Number(newProductPrices[0]&&newProductPrices[0].formatUnitPrice);
                price  = price+marketPrice;
            }

            combiProducts[x].price = price.toFixed(2);
            combiProducts[x].imgRealyUrl = bigRelatedUrl;
            combiProducts[x].packagePrice = packagePrice;
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
})();


function addAreaAndMon(arr) {
    var start;
    var end = "";
    var newArr;
    if (arr.indexOf("小于") != -1) {
        start = "*";
        end = arr.substr(2);
    }
    if (arr.indexOf("-") != -1) {
        var data = arr.split("-");
        start = data[0];
        end = data[1];
    }
    if (arr.indexOf("大于") != -1) {
        start = arr.substr(2);
        end = "*";

    }
    newArr = "[" + start + " TO " + end + "]";
    return newArr;
}


