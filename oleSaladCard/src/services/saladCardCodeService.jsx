//#import pigeon.js
//#import jobs.js

var saladCardCodeService = (function (pigeon) {
    var objPrefix = "oleSaladCardObj";
    var listPrefix = "oleSaladCardList";

    var f = {
        getPigeon:function(){
            return pigeon;
        },
        /**
         * 获取指定数量的Activity对象
         * @param activityId
         * @param start
         * @param limit
         * @returns {*}
         */
        getAllSaladCardCodeList: function (activityId, start, limit) {
            var listId = f.getListName(activityId);
            return pigeon.getListObjects(listId, start, limit);
        },
        /**
         * 获取总数
         * @returns {*}
         */
        getAllSaladCardCodeListSize: function (activityId) {
            var listId = f.getListName(activityId);
            return pigeon.getListSize(listId);
        },
        /**
         * 辅助方法：按时间倒序排序的key
         * @param dateTime
         * @returns {*}
         */
        getKeyByRevertCreateTime: function (dateTime) {
            dateTime = parseInt(dateTime / 1000);
            return pigeon.getRevertComparableString(dateTime, 11);
        },
        /**
         * 删除
         * @param id
         */
        delSaladCardCode: function (activityId,id) {
            var codeObj = f.getSaladCardCode(id);
            if(!codeObj){
                return;
            }
            var key = codeObj.code;
            var listId = f.getListName(activityId);
            pigeon.deleteFromList(listId, key, id);
            pigeon.saveObject(id, null);
            f.buildIndex(id);
        },
        /**
         * 对象列表名称
         * @returns {string}
         */
        getListName: function (activityId) {
            return listPrefix + "_SLDKCode_" + activityId;
        },
        getSaladCardCodeId: function (activityId, code) {
            return objPrefix + "_SLDKCode_" + activityId + "_" + code;
        },
        addSaladCardCode: function (activityId, jSaladCardCode) {
            var id = f.getSaladCardCodeId(activityId, jSaladCardCode.code);
            var curTime = new Date().getTime();
            jSaladCardCode.id = id;
            jSaladCardCode.createTime = curTime;
            jSaladCardCode.activityId = activityId;
            pigeon.saveObject(id, jSaladCardCode);

            var listId = f.getListName(activityId);
            var key = jSaladCardCode.code;
            pigeon.addToList(listId, key, id);
            f.buildIndex(id);
        },
        saveSaladCardCode: function (activityId, jSaladCardCode) {
            var id = jSaladCardCode.id;
            if(!id){
                id = f.getSaladCardCodeId(activityId, jSaladCardCode.code);
            }
            pigeon.saveObject(id, jSaladCardCode);
            f.buildIndex(id);
        },
        saveSaladCardCodeById: function (id, jSaladCardCode) {
            pigeon.saveObject(id, jSaladCardCode);
            f.buildIndex(id);
        },
        getSaladCardCodeByCode: function (activityId, code) {
            var id = f.getSaladCardCodeId(activityId, code);
            return f.getSaladCardCode(id);
        },
        getSaladCardCode: function (id) {
            return pigeon.getObject(id);
        },
        addUserCode:function(userId,activityId,userCodeObj){
            var id=f.getUserCodeId(userId,activityId);
            if(!userCodeObj.id){
                userCodeObj.id=id;
            }
            pigeon.saveObject(id,userCodeObj);
        },
        getUserCode:function(userId,activityId){
            var id=f.getUserCodeId(userId,activityId);
            return pigeon.getObject(id);
        },
        getUserCodeId:function(userId,activityId){
            return objPrefix + "_userCode_" + activityId + "_" + userId;
        },
        /**
         * 重建索引
         * @param id
         */
        buildIndex: function (id) {
            var jobPageId = "services/saladCardCodeBuildIndex.jsx";
            JobsService.runNow("oleSaladCard", jobPageId, {ids: id});
        }
    };
    return f;
})($S);