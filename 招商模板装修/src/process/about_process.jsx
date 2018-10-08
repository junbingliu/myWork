//#import Util.js
//#import Info.js
//#import json2.js
//#import sysArgument.js

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){
        try{

            var helpColumnId = "ctmpl_000_002",mid = "head_merchant";
            var list = $.java2Javascript(InfoApi.InfoFunction.getInfoListByPage('-1',helpColumnId, mid,1,1));
            var message;
            if(list.lists && list.lists.length > 0){
                message = list.lists[0];
                $.log(message.toSource())
            }

            var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn")
            setPageDataProperty(pageData,"webName",webName);

            setPageDataProperty(pageData,"message",message.objectMap);
            setPageDataProperty(pageData,"mid",mid + "");

        }catch(e){
            $.log(e);
        }



    });
})(dataProcessor);