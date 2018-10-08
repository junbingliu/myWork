//#import Util.js
//#import appraise.js
//#import login.js

;(function(){
    var productId = $.params.productId;
    var page = $.params.page||0;
    var limit = $.params.limit||100;
    var ret={};
    if(!productId){
        ret.state="error";
        ret.msg="商品ID不能空";
        out.print(JSON.stringify(ret));
        return;
    }
        //获取评价内容
        var appraisSearchArgs={"productId":productId,"effect":"true","searchIndex":true,"doStat":true,"page":page,"limit":limit,"logoSize":"60X60"};
        var appraisSearchResult=AppraiseService.getProductAppraiseList(appraisSearchArgs);

        if(appraisSearchResult && appraisSearchResult.totalCount > 0){
            for(var i= 0,length=appraisSearchResult.totalCount;i< length;i++){
                if(appraisSearchResult.recordList[i]&&appraisSearchResult.recordList[i].certifyInfo.certifyState != 1)
                    appraisSearchResult.recordList.splice(i,1);
            }
            appraisSearchResult.totalCount = appraisSearchResult.recordList.length;
        }
    ret.result = appraisSearchResult;
    ret.state = "ok";
    out.print(JSON.stringify(ret));

})()