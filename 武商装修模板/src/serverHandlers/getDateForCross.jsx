//#import Util.js
//#import doT.min.js
//#import DateUtil.js
(function () {
    var date = DateUtil.getNowTime();
    var jsonpcallback = $.params.jsonpcallback;
    var ret = {
        nowdate:date
    };
    out.print(jsonpcallback + "(" + JSON.stringify(ret) + ")");
})();

