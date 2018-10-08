//#import Util.js
//#import pigeon.js

var OnlineRechargeArgsService = (function (pigeon) {
    var prefix = "OnlineRechargeEWalletObj";

    var f = {
        saveArgs: function (jArgs) {
            var id = f.getArgsId();

            pigeon.saveObject(id, jArgs);
        },
        getArgs: function () {
            var id = f.getArgsId();
            return pigeon.getObject(id);
        },
        getArgsId: function () {
            return prefix + "_Args_100";
        }
    };
    return f;
})($S);