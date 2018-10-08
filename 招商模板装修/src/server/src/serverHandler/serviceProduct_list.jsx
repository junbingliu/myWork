//#import user.js
//#import login.js
//#import product.js
//#import file.js
//#import $hdLouPanDirectBuy:services/GiftProductService.jsx
(function(){

    var ret={};
    var userId = "";
    var user = LoginService.getFrontendUser();
    if (user){
        userId = user.id;
    } else {
        ret.errorCode="notLogin"

        return;
    }

    var start=0;
    var pageLimit=10;

    var totalRecords = GiftProductService.getAllGiftProductListSize(userId);

    var listData = GiftProductService.getAllGiftProductList(userId, start, totalRecords);

    for(var x=0;x< listData.length;x++){
        var value=listData[x];
        var jProduct = ProductService.getProduct(value.productId);
        if(jProduct){
            //获取图片列表
            var pics = ProductService.getPics(jProduct);
            if(pics){
                var realPices = [];
                for (var i = 0; i < pics.length; i++) {
                    var relatedUrl = FileService.getRelatedUrl(pics[i].fileId, "185X185");
                    realPices.push(relatedUrl);
                }
                listData[x].pics = realPices;
            }

            listData[x].name = jProduct.htmlname;
            listData[x].title = jProduct.title;
        }


    }
    ret={
        state:"ok",
        list:listData,
        total:totalRecords
    }
    out.print(JSON.stringify(ret));
    return ;

})()
