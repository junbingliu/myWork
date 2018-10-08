//#import Util.js
//#import pigeon.js
//#import jobs.js
var ProductStockService = (function (pigeon) {
    var prefix_obj = "ProductStockEarlyWarningObj";
    var prefix_list = "ProductStockEarlyWarningList";

    var f = {
        /**
         * 添加
         * @param jObj
         * @param createUserId
         * @returns {*}
         */
        addObj: function (id,jObj) {
            if(jObj.value.length==1){
                var curTime = new Date().getTime();
                jObj.createTime=curTime;
                var listId = f.getListName();
                var key = f.getKeyByRevertCreateTime(curTime);
                pigeon.addToList(listId, key, id);
            }
            pigeon.saveObject(id, jObj);
            return id;
        },
        /**
         * 删除
         * @param id
         */
        delObj: function (id) {
            var jObj = f.getObj(id);
            if (!jObj) {
                return;
            }
            var key = f.getKeyByRevertCreateTime(jObj.createTime);
            var listId = f.getListName();
            pigeon.deleteFromList(listId, key, id);
            pigeon.saveObject(id, null);
        },
        /**
         * 获得一个Obj对象
         * @param id
         * @returns {*|Object}
         */
        getObj: function (id) {
            return pigeon.getObject(id);
        },
        /**
         * 获取指定数量的Obj对象
         * @param start
         * @param limit
         * @returns {*}
         */
        getAllObjList: function (start, limit) {
            var listId = f.getListName();
            return pigeon.getListObjects(listId, start, limit);
        },
        /**
         * 获取总数
         * @returns {*}
         */
        getAllObjListSize: function () {
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
         * 对象列表名称
         * @returns {string}
         */
        getListName: function () {
            return prefix_list + "_soldOut";
        }
    };
    return f;
})($S);