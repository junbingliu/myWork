//#import Util.js
//#import jobs.js

(function () {

    var productId = "" + ctx.get("productId");
    var skuId = "" + ctx.get("skuId");

    //$.log("\n\nBuildProductStockIndexEvent.jsx......begin");
    //$.log("...productId=" + productId);
    //$.log("...skuId=" + skuId);
    //$.log("...end\n\n");


    try {
        var jobPageId = "services/ProductStockBuildIndex.jsx";
        JobsService.runNow("productStockEarlyWarning", jobPageId, {ids: productId});
    } catch (e) {
    }

})();

