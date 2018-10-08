//#import Util.js
//#import login.js
//#import sysArgument.js
//#import appraise.js
//#import file.js
//#import productCredit.js

;(function(){
    var id = $.params.id;
    var page = $.params.page || 1;
    var commentResult = {};

    //商品信用对象
    var jCredit=ProductCreditService.getCredit(id);
    var credit={};
    //平均得分
    credit.averageDescStore=ProductCreditService.getAverageTotalDescStore(jCredit);
    //评价数量
    credit.descAmount=ProductCreditService.getDescAmount(jCredit);
    //好评率
    credit.positiveCommentRate=ProductCreditService.getPositiveCommentRate(jCredit);
    //中评率
    credit.moderateCommentRate=ProductCreditService.getModerateCommentRate(jCredit);
    //差评率
    credit.negativeCommentRate=ProductCreditService.getNegativeCommentRate(jCredit);

    //获取评价内容

    var appraisSearchArgs={"productId":id,"effect":"true","searchIndex":true,"doStat":true,"page":page,"limit":15,"logoSize":"50X50"};
    var appraisSearchResult=AppraiseService.getProductAppraiseList(appraisSearchArgs);
    //if(appraisSearchResult && appraisSearchResult.totalCount > 0){
    //    for(var i= 0,length=appraisSearchResult.totalCount;i< length;i++){
    //        var record = appraisSearchResult.recordList[i];
    //        if(record && record.images && record.images.length > 0){
    //            var imageUrls = [],bigImageUrls = [];
    //            for(var ixx=0;ixx<record.images.length;ixx++){
    //                var fileId = record.images[ixx];
    //                var relatedUrl = FileService.getRelatedUrl(fileId,"85X85");
    //                var relatedUrlBig = FileService.getRelatedUrl(fileId,"400X222");
    //                imageUrls.push(relatedUrl);
    //                bigImageUrls.push(relatedUrlBig);
    //            }
    //            record.imageUrls = imageUrls;
    //            record.bigImageUrls = bigImageUrls;
    //        }
    //    }
    //}
    appraisSearchResult.page = page;
    appraisSearchResult.productId = id;

    commentResult["appraisResult"] = appraisSearchResult;
    commentResult["appraisCount"] = appraisSearchResult.length;
    commentResult["credit"] = credit;
    out.print(JSON.stringify(commentResult));

})();