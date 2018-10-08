//#import Util.js
//#import doT.min.js
(function(){
    var m = $.params['m'];
    var template = $.getProgram(appMd5,"pages/index_design.html");
    var pageData = $.getProgram(appMd5,"testdata.json");
    pageData = JSON.parse(pageData);
    var pageFn = doT.template(template);
    try{
        var html = pageFn(pageData);
        out.print(html);
    }
    catch(e){
        out.print(e);
    }
    out.print(html);
})();