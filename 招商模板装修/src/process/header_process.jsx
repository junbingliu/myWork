//#import Util.js
//#import login.js
//#import sysArgument.js

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){

        String.prototype.startWith=function(str){
            if(str==null||str==""||this.length==0||str.length>this.length)
                return false;
            if(this.substr(0,str.length)==str)
                return true;
            else
                return false;
            return true;
        }


        if(request.getQueryString()&&request.getQueryString()!=null){
            var isIndex = false,returnUrl = request.getRequestURI()  + "?" + request.getQueryString()+ "";
        }else{
            var isIndex = false,returnUrl = request.getRequestURI() + "";
        }

        if(returnUrl == "/" || returnUrl == "/index.jsp" ){
            isIndex = true;
        }
        setPageDataProperty(pageData,"isIndex",isIndex);
        var user = LoginService.getFrontendUser();
        var alreadyLogin = false,loggedUserName = "";
        if(user!=null){
            alreadyLogin = true;
            if(user.realName){
                loggedUserName = user.realName;
            }else if(user.loginId){
                loggedUserName = user.loginId;
            }else{
                loggedUserName = user.id;
            }
        }
        setPageDataProperty(pageData,"alreadyLogin",alreadyLogin);
        setPageDataProperty(pageData,"loggedUserName",loggedUserName + "");

        //var appId = pageData["_appId_"];//"zszmTemplate";
        var includeCommonCss = false,requestURI = request.getRequestURI() + "";
        if($.params['rappId'] == "zszm_ucenter" || requestURI.startWith("/ucenter") || requestURI.startWith("/templates/public/shopping/")){
            includeCommonCss = true;
        }
        if(requestURI.indexOf("viewPage") > -1){
            includeCommonCss = false;
        }

        //$.log("========"+pageData["_appId_"]);
        

        var isWrap = false;
        if(requestURI == "/appEditor/handlers/getPageData.jsx"){
            isWrap = true;
        }
        if(requestURI == "/appEditor/handlers/getTemplate.jsx"){
            pageData.productionMode = false;
        }


        //$.log("=============" + requestURI)

        var searchKeyword = $.params.keyword;
        if(!searchKeyword){
            searchKeyword = "";
        }

        var normalWebSite = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl");
        var sslWebSite = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrlHttps");
        var webName = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webName_cn");

        var isHttps = false;
        if(requestURI.indexOf("/lost_password.jsp") > -1){
            isHttps = true;
        }
        
        
        var onlyShowTopNav = false;
        if($.params.onlyShowTopNav == 'true'){
            onlyShowTopNav = true;
        }
        
        

        setPageDataProperty(pageData,"includeCommonCss",includeCommonCss);
        setPageDataProperty(pageData,"isWrap",isWrap);
        setPageDataProperty(pageData,"searchKeyword",searchKeyword);
        setPageDataProperty(pageData,"normalWebSite",normalWebSite);
        setPageDataProperty(pageData,"sslWebSite",sslWebSite);
        setPageDataProperty(pageData,"isHttps",isHttps);
        setPageDataProperty(pageData,"requestURI",requestURI);
        setPageDataProperty(pageData,"webName",webName);
        setPageDataProperty(pageData,"onlyShowTopNav",onlyShowTopNav);


        if(requestURI == "/Germany.html" || requestURI == "/Belarus.html" || requestURI == "/ANZ.html"){
            setPageDataProperty(pageData,"showNationalFlag",true);
            setPageDataProperty(pageData,"headerCountryName",$.params['headerCountryName']);
        }



    });
})(dataProcessor);