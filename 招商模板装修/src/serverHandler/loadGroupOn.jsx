//#import Util.js
//#import login.js
//#import sysArgument.js
//#import product.js

;(function(){
    //try{
        var user = LoginService.getFrontendUser();
        var userId = "-1";
        if(user!=null){
            userId = user.id;
        }

        var ret = {
            state:false
        }

        var priceMap = {};
        var idStr = $.params.id;
        var midStr = $.params.mid || "head_merchant";
        if(idStr){
            var cxt = "{attrs:{},isGetInventory:'true',factories:[{factory:RPF}]}";
            var jContext = new ProductApi.JSONObject(cxt);
            var priceContext = jContext.getObjectMap();
            var listOfJSON = ProductApi.PricePolicyHelper.getPriceValueList(idStr, userId, midStr,1, priceContext, "normalPricePolicy");  //一次性获取商品价格

            if(listOfJSON.size() > 0){
                var jRealPrice = listOfJSON.get(0);
                if(jRealPrice != null){
                    var realPrice = JSON.parse(jRealPrice.toString());
                    priceMap.price = realPrice.formatUnitPrice;

                    priceMap["sellableCount"] = realPrice.sellableCount;
                    priceMap["beginDateTime"] = realPrice.beginDateTime;
                    priceMap["endDateTime"] = realPrice.endDateTime;
                    priceMap["priceName"] = realPrice.priceName;
                    priceMap["salesAmount"] = realPrice.salesAmount;
                }
            }

            ret.priceMap = priceMap;
            ret.state = true;
        }




        out.print(JSON.stringify(ret));
    //}catch(e){
    //    var ret = {
    //        state:false
    //    }
    //    out.print(JSON.stringify(ret));
    //}
})();