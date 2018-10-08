//#import Util.js
//#import login.js
//#import product.js
//#import $SpecCode:services/specCodeService.jsx
(function(processor){
    function every(elem){
        var m = request.getAttribute("_origMerchantId");
        if(elem && (!elem.url || !elem.url.length || elem.url.length==0)){
            if(elem.columnId){
                if(m!="head_merchant"){
                    elem.url = "/product_list.jsp?cid=" + elem.columnId+"&m=" + m;
                }else{
                    elem.url = "/product_list.jsp?cid=" + elem.columnId;
                }
            };
        };
        if(elem && elem.children){
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
        pageData.userId=user.id;
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

})(dataProcessor);
