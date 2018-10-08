//#import Util.js
//#import login.js
//#import sysArgument.js

;
(function () {
    try {
        var user = LoginService.getFrontendUser();
        var alreadyLogin = false, loggedUserName = "";
        if (user != null) {
            alreadyLogin = true;
            if (user.realName) {
                loggedUserName = user.realName;
            } else if (user.loginId) {
                loggedUserName = user.loginId;
            } else {
                loggedUserName = user.id;
            }
        }

        var webName = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webName_cn");

        var ret = {
            state: true,
            alreadyLogin: alreadyLogin,
            loggedUserName: loggedUserName + "",
            sslWebSite: '',
            webName: webName
        }


        var sslWebSite = SysArgumentService.getSysArgumentStringValue("head_merchant", "col_sysargument", "webUrlHttps");
        if(!sslWebSite){
            sslWebSite = SysArgumentService.getSysArgumentStringValue("head_merchant","col_sysargument","webUrl");
        }
        if(sslWebSite == "http://127.0.0.1"){
            sslWebSite = "";
        }
        ret.sslWebSite = sslWebSite;


        out.print(JSON.stringify(ret));
    } catch (e) {
        var ret = {
            state: false,
            alreadyLogin: false,
            sslWebSite: ''
        }
        out.print(JSON.stringify(ret));
    }
})();