//#import Util.js
//#import Info.js

(function () {
    try{
        var mid = "head_merchant";
        var type = $.params.type;
        var columnId = "ctmpl_000_008";
        if(!type||type=="0"){
            columnId = "ctmpl_000_007";
        }
        var protocol = InfoService.getSimpleInfo(columnId,mid);
        out.print(JSON.stringify(protocol));
    }catch(e){
        $.log(e);
    }

})();