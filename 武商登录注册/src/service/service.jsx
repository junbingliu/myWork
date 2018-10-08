//#import pigeon.js
var ScanService = (function (pigeon) {
    var objPrefix = "scanObj";
    var f = {
        getScanCodeData:function(scanCode){
            var id = f.getNewId(scanCode);
            return pigeon.getObject(id);
        },
        saveScanCodeData:function(scanCode, data){
            var id = f.getNewId(scanCode);
            pigeon.saveObject(id, data);
        },
        getNewId: function(scanCode) {
            return objPrefix + "_" + scanCode;
        },
        getPigeon: function() {
            return pigeon;
        }
    };
    return f;
})($S);