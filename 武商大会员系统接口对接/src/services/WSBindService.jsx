//#import Util.js
//#import pigeon.js

var WSBindService = (function (pigeon) {
    var prefix_obj = "wsBigMemberInterfaceObj";
    var prefix_list = "wsBigMemberInterfaceList";

    var f = {
        saveMemberId2UserId: function (memberId, userId) {
            var id = f.getMemberId2UserIdKey(memberId);
            var jRel = {};
            jRel.userId = userId;
            jRel.memberId = memberId;
            jRel.createTime = new Date().getTime();
            pigeon.saveObject(id, jRel);
        },
        getUserIdByMemberId: function (memberId) {
            var id = f.getMemberId2UserIdKey(memberId);
            var jRel =  pigeon.getObject(id);
            if(jRel && jRel.userId){
                return jRel.userId;
            }
            return null;
        },
        getMemberId2UserIdKey: function (memberId) {
            return prefix_obj + "_memberId2userId_" + memberId;
        }
    };
    return f;
})($S);