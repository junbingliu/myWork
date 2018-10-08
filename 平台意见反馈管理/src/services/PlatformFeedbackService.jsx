//#import pigeon.js
//#import jobs.js

var PlatformFeedbackService = (function (pigeon) {
    var objPrefix = "platformFeedbackServerObj";
    var listPrefix = "platformFeedbackServerList";

    var f = {
        /**
         * 添加
         * @param jFeedback
         * @param createUserId
         * @returns {*|platformFeedbackServerObj_50000}
         */
        addFeedback: function (jFeedback, createUserId) {
            var id = f.getNewId();
            var curTime = new Date().getTime();
            jFeedback.id = id;
            jFeedback.createTime = curTime;
            jFeedback.state = "0";
            jFeedback.createUserId = createUserId;
            pigeon.saveObject(id, jFeedback);

            var listId = f.getListName();
            var key = f.getKeyByRevertCreateTime(curTime);
            pigeon.addToList(listId, key, id);
            f.buildIndex(id);
            return id;
        },
        /**
         * 删除
         * @param id
         */
        delFeedback: function (id) {
            var jFeedback = f.getFeedback(id);
            if (!jFeedback) {
                return;
            }
            var key = f.getKeyByRevertCreateTime(jFeedback.createTime);
            var listId = f.getListName();
            pigeon.deleteFromList(listId, key, id);
            pigeon.saveObject(id, null);
            f.buildIndex(id);
        },
        /**
         * 修改
         * @param jFeedback
         */
        updateFeedback: function (jFeedback) {
            var id = jFeedback.id;
            pigeon.saveObject(id, jFeedback);
            f.buildIndex(id);
        },
        /**
         * 获得一个Feedback对象
         * @param id
         * @returns {*|Object}
         */
        getFeedback: function (id) {
            return pigeon.getObject(id);
        },
        /**
         * 获取指定数量的Feedback对象
         * @param start
         * @param limit
         * @returns {*}
         */
        getAllFeedbackList: function (start, limit) {
            var listId = f.getListName();
            return pigeon.getListObjects(listId, start, limit);
        },
        /**
         * 获取总数
         * @returns {*}
         */
        getAllFeedbackListSize: function () {
            var listId = f.getListName();
            return pigeon.getListSize(listId);
        },
        /**
         * 辅助方法：按时间倒序排序的key
         * @param dateTime
         * @returns {*}
         */
        getKeyByRevertCreateTime: function (dateTime) {
            dateTime = parseInt(dateTime / 1000);
            return pigeon.getRevertComparableString(dateTime, 11);//倒序 11111=00000099999
            //return pigeon.getComparableString(dateTime, 11);//升序 11111=00000011111
        },
        /**
         * 获得一个唯一的内部id
         * @returns {string}
         */
        getNewId: function () {
            var idNum = pigeon.getId("FeedbackApplyServer");//50000,50001,50002
            return objPrefix + "_" + idNum;//platformFeedbackServerObj_50000
        },
        /**
         * 对象列表名称
         * @returns {string}
         */
        getListName: function () {
            return listPrefix + "_feedback_all";
        },
        /**
         * 重建索引
         * @param id
         */
        buildIndex: function (id) {
            var jobPageId = "services/PlatformFeedbackBuildIndex.jsx";
            JobsService.runNow("platformFeedbackServer", jobPageId, {ids: id});
        }
    };
    return f;
})($S);