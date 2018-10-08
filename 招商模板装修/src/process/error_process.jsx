//#import Util.js
//#import Info.js
//#import json2.js
//#import sysArgument.js

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){
        try{

            var mid = "head_merchant";
            var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn");

            setPageDataProperty(pageData,"webName",webName);

        }catch(e){
            $.log(e);
        }



    });
})(dataProcessor);