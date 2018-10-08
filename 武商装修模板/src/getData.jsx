//#import Util.js
//#import doT.min.js
(function(){
    var m = $.params['m'];
    var t = $.params['t'];
    var d = $.params.d;
    var template = $.getProgram(appMd5,t);
    var data = $.getProgram(appMd5,d);
    out.print(JSON.stringify({t:template,d:data}));
})();