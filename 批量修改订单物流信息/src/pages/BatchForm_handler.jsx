//#import Util.js
//#import login.js
//#import file.js
//#import column.js
//#import jobs.js

;
(function () {
    try {


        var userId = LoginService.getBackEndLoginUserId();
        if (!userId) {
            out.print("<script>parent.doImportCallback('请先登录')</script>");
            return;
        }

        var jFileInfos = $.uploadFiles("xls,xlsx", 1024 * 1024 * 1);

        if (!jFileInfos) {
            out.print("<script>parent.doImportCallback('文件上传失败')</script>");
            return;
        }
        var jFileInfo = jFileInfos[0];

        if (!jFileInfo) {
            out.print("<script>parent.doImportCallback('获取文件失败')</script>");
            return;
        }

        var jParameters = jFileInfo["parameters"];
        var merchantId = jParameters.merchantId;
        var modify_type = jParameters.modify_type;
        $.log("modify_type="+modify_type);
        if(!modify_type){
            out.print("<script>parent.doImportCallback('修改类型为空')</script>");
            return;
        }

        var fileId = jFileInfo.fileId;
        $.log("fileId="+fileId)
        var filePath = FileService.getInternalPath(fileId);
        var fullPath = FileService.getFullPath(fileId);
        if(!filePath || filePath == ""){
            out.print("<script>parent.doImportCallback('Excel文件上传失败或者获取失败')</script>");
            return;
        }

        var postData = {};
        postData.merchantId = merchantId;
        postData.userId = userId;
        postData.filePath = filePath;
        postData.fullPath = fullPath;
        postData.modify_type = modify_type;

        var jobPageId = "tasks/BatchUpdateTask.jsx";
        var when = (new Date()).getTime() + 1000 * 3;
        JobsService.submitTask(appId, jobPageId, postData, when);

        out.print("<script>parent.doImportCallback('ok')</script>");
    }
    catch (e) {
        var msg = "操作出现异常：" + e;
        out.print("<script>parent.doImportCallback('"+msg+"')</script>");
    }
})();