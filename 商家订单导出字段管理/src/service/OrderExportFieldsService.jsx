//#import Util.js
//#import pigeon.js
var OrderExportFieldsService = (function (pigeon) {
    var prefix_obj = "merchantOrderExportFieldsMgtObj";
    var prefix_list = "merchantOrderExportFieldsMgtList";

    var f = {
        /**
         * 添加
         * @param jExport
         * @param createUserId
         * @returns {*}
         */
        addExport: function (jExport, createUserId) {
            var id = f.getNewId();
            var curTime = new Date().getTime();
            jExport.id = id;
            jExport.createTime = curTime;
            jExport.createUserId = createUserId;
            pigeon.saveObject(id, jExport);
            var listId = f.getListName();
            var key = f.getKeyByRevertCreateTime(curTime);
            pigeon.addToList(listId, key, id);
            return id;
        },
        /**
         * 删除
         * @param id
         */
        delExport: function (id) {
            var jExport = f.getExport(id);
            if (!jExport) {
                return;
            }
            var key = f.getKeyByRevertCreateTime(jExport.createTime);
            var listId = f.getListName();
            pigeon.deleteFromList(listId, key, id);
            pigeon.saveObject(id, null);
        },
        /**
         * 修改
         * @param jExport
         */
        updateExport: function (jExport) {
            var id = jExport.id;
            pigeon.saveObject(id, jExport);
        },
        /**
         * 获得一个Export对象
         * @param id
         * @returns {*|Object}
         */
        getExport: function (id) {
            return pigeon.getObject(id);
        },
        /**
         * 获取指定数量的Export对象
         * @param start
         * @param limit
         * @returns {*}
         */
        getAllExportList: function (start, limit) {
            var listId = f.getListName();
            return pigeon.getListObjects(listId, start, limit);
        },
        /**
         * 获取总数
         * @returns {*}
         */
        getAllExportListSize: function () {
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
            var idNum = pigeon.getId("OrderExportFieldsObject");
            return prefix_obj + "_" + idNum;
        },
        /**
         * 对象列表名称
         * @returns {string}
         */
        getListName: function () {
            return prefix_list + "_all";
        },
        /**
         *
         * @param type (order_baseInfo:订单基本信息导出字段,order_item:订单item信息导出字段, order_all:订单信息导出字段)
         * @param columnId
         * @param gradeId
         */
        getExportConfig: function (type, columnId, gradeId) {
            var id = prefix_obj + "_" + type + "_" + columnId + "_" + gradeId;
            return pigeon.getObject(id);
        },
        saveExportConfig: function (type, columnId, gradeId, jExport) {
            if(!jExport.id){
                jExport.id = prefix_obj + "_" + type + "_" + columnId + "_" + gradeId;
            }
            pigeon.saveObject(jExport.id, jExport);
        },
        getDefaultConfig: function (type) {
            var id = type + "_exportFields";
            return pigeon.getObject(id);
        }
    };
    return f;
})($S);