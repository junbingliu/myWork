//#import Info.js

(function () {
    try{
        var mid = "head_merchant";
        var protocol = InfoService.getSimpleInfo("ctmpl_000_011",mid);
        out.print(JSON.stringify(protocol));
    }catch(e){
        $.log(e);
    }

})();