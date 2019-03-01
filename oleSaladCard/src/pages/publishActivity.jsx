//#import Util.js
//#import login.js
//#import user.js
//#import $oleSaladCard:services/saladCardService.jsx
;
(function () {
    var result = {};
    try {
        var id = $.params["id"];

        if (!id || id== "") {
            result.code = "105";
            result.msg = "id不存在";
            out.print(JSON.stringify(result));
            return;
        }

        var jRecord = saladCardService.getActivity(id);
        if(!jRecord){
            result.code = "106";
            result.msg = "数据不存在106";
            out.print(JSON.stringify(result));
            return;
        }
        jRecord.state = '1';

        saladCardService.updateActivity(jRecord);

        result.code = "0";
        result.msg = "发布成功";
        out.print(JSON.stringify(result));
    }
    catch (e) {
        result.code = "100";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }
})();
