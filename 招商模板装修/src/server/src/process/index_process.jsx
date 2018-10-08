//#import Util.js
//#import login.js
//#import product.js
//#import file.js
//#import DateUtil.js
//#import $limitActivity:services/limitActivity.jsx


(function(processor){
    function every(elem){
        if(elem&&(!elem.url || !elem.url.length || elem.url.length==0)){
            if(elem.columnId){
                elem.url = "/product_list.jsp?cid=" + elem.columnId;
            };
        };
        if(elem&&elem.children){
            elem.children.forEach(function(child){every(child);})
        };
    };
    processor.on(":fancyCategories",function(pageData,dataIds,elems){
        if(elems && elems.length>0){
            elems.forEach(function(elem){
                every(elem);
            });
        };
    });

    processor.on("all", function (pageData, dataIds, elems) {
        var userId = "";
        var userName = "";
        var user = LoginService.getFrontendUser();
        if(user){
            userId = user.id;
            userName = user.loginId;
        }

        setPageDataProperty(pageData,"userId",userId);
        setPageDataProperty(pageData,"userName",userName);
    });

    var updateOther=false;
    processor.on(":productGroup",function(pageData,dataIds,elems){
        try{
            var updateTime=pageData&&pageData.config&&pageData.config.updateTime&&pageData.config.updateTime.value||10;
            var nowDate =new  Date().getTime();
            var updateDate = pageData['_updateDate'];
            if(!updateDate||Number(nowDate-updateDate)>Number(updateTime*60*1000)){
                updateOther=true;
                updateDate=nowDate;
                pageData['_updateDate']=updateDate;
                for(var i=0;i<elems.length;i++){
                    var elem=elems[i];
                    var dataId = dataIds[i];
                    if(elem){
                        for(var j=0;j<elem.length;j++){
                            var productId=elem[j].id;
                            var newProduct=ProductService.getProduct(productId);
                            var methods = [];
                            for(var k in LimitActivityService){
                                methods.push(k);
                            }
                            var limitActivity = LimitActivityService.getCurrentActivity(productId);
                            var limitActivityBeginTime = "",limitActivityEndTime = "";
                            if(limitActivity){
                                limitActivityBeginTime = limitActivity.beginTime;
                                limitActivityEndTime = limitActivity.endTime;
                            }
                            elem[j]["limitActivityBeginTime"] = limitActivityBeginTime;//活动开始时间
                            elem[j]["limitActivityEndTime"] = limitActivityEndTime;//活动结束时间
                            elem[j]["name"] = newProduct&&newProduct.name;
                            var cxt="{attrs:{},factories:[{factory:MF},{factory:RPF}]}";
                            var newProductPrices=ProductService.getPriceValueList(productId,"",pageData["_m_"],1,cxt,"normalPricePolicy");
                            if(newProductPrices){
                                /*重新获取价格参数*/
                                var memberPrice = newProductPrices[1]&&newProductPrices[1].formatUnitPrice;
                                var marketPrice = newProductPrices[0]&&newProductPrices[0].formatUnitPrice;
                                var discount ="暂无折扣";
                                var savePrice = 0 ;
                                if(marketPrice){
                                    discount = ((parseFloat(memberPrice)/parseFloat(marketPrice))*10).toFixed(1);//折扣
                                    savePrice = parseFloat(marketPrice)-parseFloat(memberPrice);//节省金额
                                    elem[j]["marketPrice"] = "¥"+parseFloat(marketPrice).toFixed(2);
                                }else{
                                    marketPrice="暂无价格";
                                    elem[j]["marketPrice"] =marketPrice;
                                }
                                elem[j]["discount"] = discount;
                                elem[j]["savePrice"] = savePrice;
                                if(memberPrice){
                                    elem[j]["memberPriceString"] = "￥" + parseFloat(memberPrice).toFixed(2);
                                    elem[j]["memberPrice"] = parseFloat(memberPrice).toFixed(2);
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
            $.log(e);
        }
    });
    processor.on(":imgLinkList",function(pageData,dataIds,elems){
        for(var i=0;i<elems.length;i++){
            var now=new Date().getTime();
            var elem=elems[i];
            var dataId = dataIds[i];
            var newElem=[];
            for(var j=0;j<elem.length;j++){
                var startDate=elem[j].startDate;
                var endDate=elem[j].endDate;
                if(startDate&&endDate){
                    var startDatelong=new Date(startDate.replace(/-/g,"/")).getTime();
                    var endDatelong=new Date(endDate.replace(/-/g,"/")).getTime();
                    if(startDatelong<now&&endDatelong>now){
                        newElem.unshift(elem[j]);
                    }else{
                        newElem.push(elem[j]);
                    }
                }else{
                    newElem.push(elem[j]);
                }
                setPageDataProperty(pageData,dataId,newElem);
            }
        }
    });


})(dataProcessor);
