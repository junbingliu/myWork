//#import pigeon.js
//#import jobs.js

var PopupsService = (function (pigeon) {
    var prefix_obj = "popupsManageObj";
    var prefix_list = "popupsManageList";

    var f = {
        addPopups: function (operatorUserId, jPopups) {
            var id = f.getNewId();
            var curTime = (new Date()).getTime();
            jPopups.id = id;
            jPopups.createTime = curTime;
            jPopups.createUserId = operatorUserId;
            pigeon.saveObject(id, jPopups);
            var listId = f.getListName(jPopups.merchantId);
            var key = f.getKeyByRevertCreateTime(curTime);
            pigeon.addToList(listId, key, id);
            f.buildIndex(id);
            $.log("数据保存成功了,merchantId============="+jPopups.merchantId)
        },

        updatePopups: function (jPopups) {
            pigeon.saveObject(jPopups.id, jPopups);
            f.buildIndex(jPopups.id);
        },

        getPopups: function (id) {
            return f.getPopupsByState(id, true);
        },

        getPopupsByState: function (id, checkState) {
            var jPopups = pigeon.getObject(id);
            if(!jPopups){
                return null;
            }
            if (checkState && jPopups.isDeleted) {
                return null;
            }
            return jPopups;
        },

        deletePopups: function (id, userId) {
            if (id.indexOf(prefix_obj) == -1) {
                return;
            }
            var jPopups = f.getPopups(id);
            if (!jPopups) {
                return;
            }
            jPopups.isDeleted = true;
            jPopups.deleteUserId = userId;
            jPopups.deleteTime = new Date().getTime();
            pigeon.saveObject(id, jPopups);
            var listId = f.getListName(jPopups.merchantId);
            var key = f.getKeyByRevertCreateTime(jPopups.createTime);
            pigeon.deleteFromList(listId, key, id);
            var deleteList = f.getDeletedListName(jPopups.merchantId);
            pigeon.addToList(deleteList, key, id);
            f.buildIndex(id);
        },

        getPopupsList: function (merchantId, start, limit) {
            var listId = f.getListName(merchantId);
            return pigeon.getListObjects(listId, start, limit);
        },

        getDeletedPopupsList: function (merchantId, start, limit) {
            var listId = f.getDeletedListName(merchantId);
            return pigeon.getListObjects(listId, start, limit);
        },

        getPopupsListSize: function (merchantId) {
            var listId = f.getListName(merchantId);
            // var listId = f.getListName();
            return pigeon.getListSize(listId);
        },

        getDeletedPopupsListSize: function (merchantId) {
            var listId = f.getDeletedListName(merchantId);
            return pigeon.getListSize(listId);
        },

        getKeyByRevertCreateTime: function (dateTime) {
            dateTime = parseInt(dateTime / 1000);
            return pigeon.getRevertComparableString(dateTime, 11);
        },

        getNewId: function () {
            var idNum = pigeon.getId("popupsManage_popups");
            return prefix_obj + "_" + idNum;
        },

        getListName: function (merchantId) {
            return prefix_list + "_" + merchantId + "_AllPopups";
        },

        buildIndex: function (id) {
            var jobPageId = "services/PopupsBuildIndex.jsx";
            JobsService.runNow("popupsManage", jobPageId, {ids: id});
        },

        getDeletedListName: function (merchantId) {
            return prefix_list + "_" + merchantId + "_DeketedActivities";
        }

    };
    return f;
})($S);