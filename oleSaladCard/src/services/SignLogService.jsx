//#import pigeon.js
//#import jobs.js

var SignLogService = (function (pigeon) {
    var objPrefix = "oleSaladCardObj";
    var listPrefix = "oleSaladCardList";

    var f = {
        getPigeon:function(){
            return pigeon;
        },
        /**
         * 保存用户总的剩余打卡次数
         * @param userId
         * @param jUserAmountSign
         */
        saveUserAmountSign: function (userId, jUserAmountSign) {
            var id = f.getUserAmountSignId(userId);
            pigeon.saveObject(id, jUserAmountSign);
        },
        getUserAmountSign: function (userId) {
            var id = f.getUserAmountSignId(userId);
            return pigeon.getObject(id);
        },
        getUserAmountSignId: function (userId) {
            return objPrefix + "_UserAmountSign_" + userId;
        },
        updateSignAmount: function (userId, activityId, num) {

            var lockId = objPrefix + "_UserAmountSign_" + userId;
            pigeon.lock(lockId);
            try {
                var jUserSignAmount = f.getUserAmountSign(userId);
                if(!jUserSignAmount){
                    jUserSignAmount = {};
                    jUserSignAmount.id =  f.getUserAmountSignId(userId);
                }
                var totalSign = jUserSignAmount[activityId+'_total'];
                var sign = jUserSignAmount[activityId];
                if(!totalSign){
                    totalSign = 0;
                }
                if(!sign){
                    sign = 0;
                }
                if(num>0){
                    totalSign += num;
                }
                sign += num;
                jUserSignAmount[activityId+'_total'] = totalSign;
                jUserSignAmount[activityId]=sign;
                f.saveUserAmountSign(userId, jUserSignAmount);
            } finally {
                pigeon.unlock(lockId);
            }
        },
        /**
         * 添加
         * @param sheetId : 小票号
         * @param jSignLog
         * @param createUserId
         */
        addSignLog: function (sheetId,activityId,jSignLog) {
            var id = f.getSignLogId(sheetId);
            var curTime=new Date().getTime();
            jSignLog.id = id;
            jSignLog.signTime = curTime;
            pigeon.saveObject(id, jSignLog);

            var listId = f.getListName(activityId);
            var key = f.getKeyByRevertCreateTime(curTime);
            pigeon.addToList(listId, key, id);
            f.buildIndex(id);
            return id;
        },
        /**
         * 修改
         * @param jSignLog
         */
        updateSignLog: function (jSignLog) {
            var id = jSignLog.id;
            pigeon.saveObject(id, jSignLog);
            f.buildIndex(id);
        },
        /**
         * 获得一个SignLog对象
         * @param id
         * @returns {*|Object}
         */
        getSignLog: function (id) {
            return pigeon.getObject(id);
        },
        /**
         * 根据小票号找到打卡记录
         * @param sheetId
         * @returns {*}
         */
        getSignLogBySheetId: function (sheetId) {
            var id = f.getSignLogId(sheetId);
            return pigeon.getObject(id);
        },
        /**
         * 获取指定数量的SignLog对象
         * @param activityId
         * @param start
         * @param limit
         * @returns {*}
         */
        getAllSignLogList: function (activityId, start, limit) {
            var listId = f.getListName(activityId);
            return pigeon.getListObjects(listId, start, limit);
        },
        /**
         * 获取总数
         * @returns {*}
         */
        getAllSignLogListSize: function (activityId) {
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
         * 获得一个唯一的内部id
         * @returns {string}
         */
        getSignLogId: function (sheetId) {
            return objPrefix + "_SignLog_" + sheetId;
        },
        /**
         * 对象列表名称
         * @returns {string}
         */
        getListName: function (activityId) {
            return listPrefix + "_SignLog_" + activityId;
        },
        /**
         * 重建索引
         * @param id
         */
        buildIndex: function (id) {
            // var jobPageId = "services/saladCardBuildIndex.jsx";
            // JobsService.runNow("oleSaladCard", jobPageId, {ids: id});
        }
    };
    return f;
})($S);