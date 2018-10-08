//#import Util.js
//#import login.js
//#import DateUtil.js
//#import sysArgument.js
//#import user.js
//#import appraise.js
//#import product.js
//#import file.js

(function () {
    var userId = "";
    var user = LoginService.getFrontendUser();
    if (user) {
        userId = user.id;
    } else {
        var result = {
            state: "notLogin"
        }
        out.print(result);
        return;
    }

    var id = $.params.id;
    var page = $.params.page||1;
    var limit = $.params.pageNumber||100;

    var appraisSearchArgs={"createUserId":userId,"productId":id,"effect":"true","searchIndex":true,"doStat":true,"page":page,"limit":limit,"logoSize":"60X60"};
    var appraisSearchResult=AppraiseService.getProductAppraiseList(appraisSearchArgs);
    if(appraisSearchResult){
        if(appraisSearchResult.recordList){
            for(var i=0;i<appraisSearchResult.recordList.length;i++){
                var comment = appraisSearchResult.recordList[i];
                var appraisUserId = comment.createUserId;
                var userobj = UserService.getUser(appraisUserId);
                var level = ""+UserService.getMemberGroupName(userobj,"c_102");
                comment.level = level;
                var productId = comment.productId;
                var product = ProductService.getProduct(productId);
                if(product){
                    var pics = ProductService.getPics(product);
                    if(pics){
                        var realPics = [];
                        for (var k = 0; k < pics.length; k++) {
                            var relatedUrl = FileService.getRelatedUrl(pics[k].fileId, "60X60");
                            realPics.push(relatedUrl);
                        }
                        comment.pics = realPics;
                    }

                }

                //var userLever = UserService.getUserTopGroupByUserId(user.id);
                //var userLeverString = UserService.getUserLevel(userLever.groupId);
                //var userLeverName=userLeverString.name;
            }
        }
    }
    var result = {
        state: "OK",
        commentList:appraisSearchResult
    }
    out.print(JSON.stringify(result));

})();