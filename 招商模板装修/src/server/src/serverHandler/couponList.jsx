//#import Util.js
//#import login.js
//#import DateUtil.js
//#import sysArgument.js
//#import user.js


(function () {
        var selfApi = new JavaImporter(
            Packages.org.json,
            Packages.net.xinshi.isone.modules,
            Packages.java.util,
            Packages.java.net,
            Packages.net.xinshi.isone.functions.card
        );

        var requestURI = request.getRequestURI() + "";


        var userId = "";
        var user = LoginService.getFrontendUser();
        if(user){
            userId = user.id;
        }else{
            var result = {
                state: "notLogin"
            }
            out.print(result);
            return;
        }

        var mid = "head_merchant";
        var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn");

        var tp = $.params.couponType || "unuse";//unuse：未使用 used：已使用 exipred：已过期
        var page = $.params.page || 1;

        var count = 100;
        var cardMap = {},jCardMap = null;
        if(tp == "unuse"){
            jCardMap = selfApi.CardFunction.getUserAbleUseCard(userId,'cardType_coupons',page + "" ,count + "");
        }else if(tp == "used"){
            jCardMap = selfApi.CardFunction.getUserHasUsedCard(userId,'cardType_coupons',page + "" ,count + "");
        }else if(tp == "exipred"){
            jCardMap = selfApi.CardFunction.getUserExpiredCard(userId,'cardType_coupons',page + "" ,count + "");
        }
        if(jCardMap != null){
            cardMap = JSON.parse((new selfApi.JSONObject(jCardMap)).toString());
            if(cardMap.rowCount > 0){
                for(var i=0;i<cardMap.lists.length;i++){
                    var card = cardMap.lists[i];
                    var beginTimeFormat = DateUtil.getShortDate(parseInt(card.effectedBegin));
                    var endTimeFormat = DateUtil.getShortDate(parseInt(card.effectedEnd));
                    card.exipredStr = beginTimeFormat + "至" + endTimeFormat;
                }
            }
        }
    var result = {
        state: "ok",
        cardMap: cardMap,
        tp: tp
    }
    out.print(JSON.stringify(result));
       /* setPageDataProperty(pageData, "requestURI", requestURI + "");
        setPageDataProperty(pageData, "webName", webName);
        setPageDataProperty(pageData, "user", user);
        setPageDataProperty(pageData, "cardMap", cardMap);
        setPageDataProperty(pageData, "tp", tp);*/


})();