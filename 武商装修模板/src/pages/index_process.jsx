//#import Util.js
//#import login.js
//#import product.js
//#import $SpecCode:services/specCodeService.jsx
(function(processor){
    processor.on("#header.topNav1_login",function(pageData,dataIds,elems){
        var user = LoginService.getFrontendUser();
        if(user==null){
            pageData.alreadyLogin = false;
            return;
        }
        else{
            pageData.alreadyLogin = true;
        }
        var userName = "";
        if(user.realName){
            userName = user.realName;
        }
        else if(user.loginId){
            userName = user.loginId;
        }
        else{
            userName = user.id;
        }
        pageData.userId=user.id;
        for(var i=0;i<elems.length;i++){
            var elem = elems[i];
            var dataId = dataIds[i];
            elem = elem.replace("{userName}",userName);
            setPageDataProperty(pageData,dataId,elem);
        }

    });
    processor.on(":productGroup",function(pageData,dataIds,elems){
        try{
            var updateTime=pageData.config&&pageData.config.updateTime&&pageData.config.updateTime.value||5;
            var nowDate =new  Date().getTime();
            var updateDate = pageData['_updateDate'];
            if(!updateDate||nowDate-updateDate>updateTime*60*1000*6){
                updateOther=true;
                updateDate=nowDate;
                pageData['_updateDate']=updateDate;
                for(var i=0;i<elems.length;i++){
                    var elem=elems[i];
                    if(elem){
                        for(var j=0;j<elem.length;j++){
                            var productId=elem[j].id;
                            var cxt="{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                            var newProduct=ProductService.getPriceValueList(productId,"",pageData["_m_"],1,cxt,"normalPricePolicy");
                            var salesAmount=ProductService.getSalesAmount(productId);
                            if(salesAmount){
                                elem[j]["salesAmount"]=salesAmount;
                            }
                                                     if(newProduct){

                                /*重新获取价格参数*/
                                var memberPrice = newProduct[1]&&newProduct[1].formatUnitPrice;
                                var marketPrice = newProduct[0]&&newProduct[0].formatUnitPrice;
                                /*获取特价商品的活动时间*/
                                var beginDateTime = newProduct[1]&&newProduct[1].beginDateTime;
                                var endDateTime = newProduct[1]&&newProduct[1].endDateTime;
                                elem[j]["beginDateTime"]=beginDateTime;
                                elem[j]["endDateTime"]=endDateTime;
                                if(marketPrice){
                                    elem[j]["marketPriceString"] = "￥" + parseFloat(marketPrice).toFixed(2);
                                    elem[j]["marketPrice"] = parseFloat(marketPrice).toFixed(2);
                                }else{
                                    elem[j]["marketPriceString"] = "暂无价格";
                                }
                                if(memberPrice){
                                    elem[j]["memberPriceString"] = "￥" + parseFloat(memberPrice).toFixed(2);
                                    elem[j]["memberPrice"] = parseFloat(memberPrice).toFixed(2);
                                     /*获取特价商品的折扣*/
                                    if(elem[j].marketPrice){
                                        var discount=elem[j]["memberPrice"]/elem[j].marketPrice;
                                        discount=(discount*10).toFixed(1);
                                        elem[j]["discount"]=discount+"折";
										/*优惠金额*/
                                        var saleCount=elem[j]["marketPrice"]-elem[j]["memberPrice"];
                                        elem[j]["saleCount"]=saleCount;
                                    }
                                }
                                else{
                                    elem[j]["memberPriceString"] = "暂无价格";
                                };
                            };

                        };
                    };
                };
                /*存进数据库*/
                saveMerchantPageData(pageData["_m_"],pageData["_appId_"],pageData["_pageId_"],pageData);
            };
        }
        catch (e){
        }

    });

})(dataProcessor);
