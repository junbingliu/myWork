//#import Util.js
//#import column.js
//#import Info.js
//#import json2.js
//#import sysArgument.js

(function(processor){
    processor.on("all",function(pageData,dataIds,elems){
        try{
            var helpColumnId = "ctmpl_000_003",mid = "head_merchant";
            var articleId = $.params.id;
            var curArticle = null,curColumn = null;
            var infoSplitColumn = {};
            var columnChildren = ColumnService.getChildren(helpColumnId);
            if(columnChildren && columnChildren.length > 0){
//                var infoMap = InfoService.getInfoListFirstPage("-1",helpColumnId,mid,200);

                var lists = InfoApi.IsoneModulesEngine.infoService.getNormalList(helpColumnId, mid);
                if(lists){
                    lists = JSON.parse(lists.toString())
                }
                if(lists && lists.length > 0){
                    for(var j = 0,infoLength = lists.length;j<infoLength;j++){
                        var columnId = lists[j].columnId;
                        if(!infoSplitColumn[columnId]){
                            infoSplitColumn[columnId] = [];
                        }
                        infoSplitColumn[columnId].push(lists[j]);
                        if(articleId && lists[j].objId == articleId){
                            curArticle = lists[j];
                            curColumn = ColumnService.getColumn(columnId);
                        }
                    }
                }
                if(!curArticle){
                    for(var i = 0,length = columnChildren.length;i < length;i++){
                        var articles = infoSplitColumn[columnChildren[i].id];
                        if(articles && articles.length > 0){
                            curArticle = articles[0];
                            curColumn = columnChildren[i];
                            break;
                        }
                    }
                }
            }

            var webName = SysArgumentService.getSysArgumentStringValue(mid,"col_sysargument","webName_cn")
            setPageDataProperty(pageData,"webName",webName);
            setPageDataProperty(pageData,"columnChildren",columnChildren);
            setPageDataProperty(pageData,"infoSplitColumn",infoSplitColumn);
            setPageDataProperty(pageData,"curArticle",curArticle);
            setPageDataProperty(pageData,"curColumn",curColumn);
            setPageDataProperty(pageData,"mid",mid + "");
            setPageDataProperty(pageData,"articleId",articleId + "");
            setPageDataProperty(pageData,"requestURI",request.getRequestURI() + "");


        }catch(e){
            $.log(e);
        }



    });
})(dataProcessor);