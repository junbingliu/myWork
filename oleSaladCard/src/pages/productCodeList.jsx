//#import doT.min.js
//#import Util.js
//#import $oleSaladCard:services/saladCardService.jsx

(function () {
    var merchantId=$.params["m"];
    var activityId=$.params["id"];
    var productListObj=saladCardService.getActivityProductList(activityId);
    var pageData={
        merchantId:merchantId,
        activityId:activityId,
        productList:[]
    };
    if(productListObj){
        pageData.productList=productListObj.productList;
    }
    var template = $.getProgram(appMd5, "pages/productCodeList.html");
    var pageFn = doT.template(template);
    out.print(pageFn(pageData));
})()