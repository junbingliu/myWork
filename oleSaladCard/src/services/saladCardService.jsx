//#import pigeon.js
//#import jobs.js

var saladCardService = (function (pigeon) {
    var objPrefix = "oleSaladCardObj";
    var listPrefix = "oleSaladCardList";

    var f = {
        getPigeon:function(){
            return pigeon;
        },
        /**
         * 添加
         * @param jActivity
         * @param createUserId
         */
        addActivity: function (jActivity, createUserId) {
            var id = f.getNewId();
            var curTime = new Date().getTime();
            jActivity.id = id;
            jActivity.createTime = curTime;
            jActivity.state = "0";
            jActivity.createUserId = createUserId;
            pigeon.saveObject(id, jActivity);

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
        delActivity: function (id) {
            var jActivity = f.getActivity(id);
            if (!jActivity) {
                return;
            }
            var key = f.getKeyByRevertCreateTime(jActivity.createTime);
            var listId = f.getListName();
            pigeon.deleteFromList(listId, key, id);
            pigeon.saveObject(id, null);
            f.buildIndex(id);
        },
        /**
         * 修改
         * @param jActivity
         */
        updateActivity: function (jActivity) {
            var id = jActivity.id;
            var curTime = new Date().getTime();
            jActivity.updateTime = curTime;
            pigeon.saveObject(id, jActivity);
            f.buildIndex(id);
        },
        /**
         * 获得一个Activity对象
         * @param id
         * @returns {*|Object}
         */
        getActivity: function (id) {
            return pigeon.getObject(id);
        },
        /**
         * 获取指定数量的Activity对象
         * @param start
         * @param limit
         * @returns {*}
         */
        getAllActivityList: function (start, limit) {
            var listId = f.getListName();
            return pigeon.getListObjects(listId, start, limit);
        },
        /**
         * 获取总数
         * @returns {*}
         */
        getAllActivityListSize: function () {
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
            return pigeon.getRevertComparableString(dateTime, 11);
        },
        /**
         * 获得一个唯一的内部id
         * @returns {string}
         */
        getNewId: function () {
            var idNum = pigeon.getId("oleSaladCard_Activity");
            return objPrefix + "_" + idNum;
        },
        /**
         * 对象列表名称
         * @returns {string}
         */
        getListName: function () {
            return listPrefix + "_Activity_all";
        },
        /**
         * 活动关联的商品列表，预计不多的商品，所以用一个对象保存
         * @param activityId
         * @returns {string}
         */
        getActivityProductRelId: function (activityId) {
            return objPrefix + "_ProductList_" + activityId;
        },
        saveActivityProductList: function (activityId, jProductList) {
            if(!jProductList.id){
                jProductList.id = f.getActivityProductRelId(activityId);
            }
            pigeon.saveObject(jProductList.id, jProductList);
        },
        delActivityProductList:function(activityId){
            var id = f.getActivityProductRelId(activityId);
            pigeon.saveObject(id,null)
        },
        getActivityProductList: function (activityId) {
            var id = f.getActivityProductRelId(activityId);
            return pigeon.getObject(id);
        },
        /**
         * 重建索引
         * @param id
         */
        buildIndex: function (id) {
            var jobPageId = "services/saladCardBuildIndex.jsx";
            JobsService.runNow("oleSaladCard", jobPageId, {ids: id});
        }
    };
    return f;
})($S);