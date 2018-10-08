//#import Util.js
//#import login.js
//#import product.js
//#import $SpecCode:services/specCodeService.jsx
(function(processor){
    function every(elem){
        var m = request.getAttribute("_origMerchantId");
        if(!elem.url || !elem.url.length || elem.url.length==0){
            if(elem.columnId){
                if(m!="head_merchant"){
                    elem.url = "/product_list.jsp?cid=" + elem.columnId+"&m=" + m;
                }else{
                    elem.url = "/product_list.jsp?cid=" + elem.columnId;
                }
            };
        };
        if(elem.children){
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
        for(var i=0;i<elems.length;i++){
            var elem = elems[i];
            var dataId = dataIds[i];
            elem = elem.replace("{userName}",userName);
            setPageDataProperty(pageData,dataId,elem);
        }

    });
    processor.on("#all",function(pageData,dataIds,elems){
        try{
		     /*设置seo数据*/
            var config=$.params.config;
            if(config){
                var jConfig=JSON.parse(config);
                pageData.config=jConfig;
            }

            var m = request.getAttribute("_productMerchantId");

            var obj=  SpecCodeService.getData(m);
            var data="";
            if(obj!=null){
                data="" + SpecCodeService.getData(m);
            }
            pageData.specCode=data;
            setPageDataProperty(pageData,"specCode",data);
        }
        catch (e){
        }


    });
    processor.on(":productGroup",function(pageData,dataIds,elems){
        try{
            var updateTime=pageData.config&&pageData.config.updateTime&&pageData.config.updateTime.value||5;
            var nowDate =new  Date().getTime();
            var updateDate = pageData['_updateDate'];
            if(!updateDate||nowDate-updateDate>updateTime*60*1000){
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
                                /*获取特价商品的活动时间*/
                                var beginDateTime = newProduct[1]&&newProduct[1].beginDateTime;
                                var endDateTime = newProduct[1]&&newProduct[1].endDateTime;
                                elem[j]["beginDateTime"]=beginDateTime;
                                elem[j]["endDateTime"]=endDateTime;

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
