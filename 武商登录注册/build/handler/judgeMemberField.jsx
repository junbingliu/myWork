//#import Util.js
//#import login.js

;(function() {
    var state = "true";
    var field = $.params.loginId||$.params.email||$.params.mobilePhone;
    if(field){
        var checkResult = LoginService.judgeMemberField(field);
        if (checkResult && checkResult != "null") {
            state = "false";
        }
    }
    out.print(state);
})();