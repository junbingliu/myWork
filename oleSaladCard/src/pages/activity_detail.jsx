//#import doT.min.js
//#import Util.js
//#import file.js
//#import $oleSaladCard:services/saladCardService.jsx

(function () {
    try{
        var result={};
        var id = $.params["id"];
        if(!id || id == ""){
            out.print("参数错误");
            return;
        }

        var jRecord = saladCardService.getActivity(id);
        if(!jRecord){
            result.code = "1";
            result.msg = "数据返回为空";
            out.print(JSON.stringify(result));
            return;
        }
        var imgUrl='';
        if(jRecord.shareImg!=''){
            imgUrl = FileService.getRelatedUrl(jRecord.shareImg, "200X200");
        }
        jRecord.imgUrl = imgUrl;
        result.code = "0";
        result.msg = "获取数据成功";
        result.data=jRecord
        out.print(JSON.stringify(result));
    }catch (e) {
        result.code = "100";
        result.msg = "系统异常";
        out.print(JSON.stringify(result));
    }


})();