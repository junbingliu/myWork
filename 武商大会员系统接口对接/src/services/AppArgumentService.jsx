//#import Util.js
//#import pigeon.js

var AppArgumentService = (function (pigeon) {
    var prefix_obj = "wsBigMemberInterfaceObj";
    var prefix_list = "wsBigMemberInterfaceList";

    var f = {
        saveArgs: function (merchantId, jArgs) {
            var id = f.getArgsId(merchantId);

            pigeon.saveObject(id, jArgs);
        },
        getArgs: function (merchantId) {
            var id = f.getArgsId(merchantId);
            return pigeon.getObject(id);
        },
        getArgsId: function (merchantId) {
            return prefix_obj + "_Args_" + merchantId;
        },
        saveOTORelation: function (jOTORelation) {
            var id = f.getOTORelationId();

            pigeon.saveObject(id, jOTORelation);
        },
        getOTORelation: function () {
            var id = f.getOTORelationId();
            return pigeon.getObject(id);
        },
        getOTORelationId: function () {
            return prefix_obj + "_OTORelation";
        }
    };
    return f;
})($S);