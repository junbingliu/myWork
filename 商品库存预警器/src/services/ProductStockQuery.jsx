//#import Util.js

var ProductStockQuery = (function () {
    var f = {
        getQuery: function getQuery(searches) {
            if (typeof searches == "undefined") {
                return [];
            }
            var searchQuery = [];
            //索引对象类型
            searchQuery.push({n: 'ot', v: "productStockEarlyWarning", type: 'term'});

            //所属商家
            if (searches.merchantId) {
                searchQuery.push({n: 'merchantId', v: searches.merchantId, type: 'term', op: "and"});
            }

            //商品ID
            if (searches.productId) {
                searchQuery.push({n: 'id', v: searches.productId, type: 'term', op: "and"});
            }

            //库存为0标记
            if (searches.emptyStockFlag) {
                searchQuery.push({n: 'emptyStockFlag', v: searches.emptyStockFlag, type: 'term', op: "and"});
            }

            //库存小于安全可卖数标记
            if (searches.warningStockFlag) {
                searchQuery.push({n: 'warningStockFlag', v: searches.warningStockFlag, type: 'term', op: "and"});
            }

            return searchQuery;
        },
        getQueryArgs: function (searchParams) {
            var qValues = f.getQuery(searchParams);
            var queryArgs = {
                mode: 'adv',
                q: qValues
            };

            return JSON.stringify(queryArgs);
        }


    };
    return f;

})();