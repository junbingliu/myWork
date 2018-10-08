//#import Util.js
//#import login.js
//#import user.js

;(function(){
    var selfApi = new JavaImporter(
        Packages.org.json,
        Packages.net.xinshi.isone.modules,
        Packages.net.xinshi.isone.modules.sysargument,
        Packages.net.xinshi.isone.base,
        Packages.net.xinshi.isone.commons,
        Packages.java.util,
        Packages.java.lang,
        Packages.org.apache.commons.lang,
        Packages.java.net,
        Packages.net.xinshi.pigeon.adapter
    );

    var ret = {
        state:false,
        errorCode:""
    }
    try{
        //var contextPath = request.getContextPath();

        var userId = "";
        var user = LoginService.getFrontendUser();
        //var loginKey = $.params.u;
        //var user = UserService.getUserByKey(loginKey);
        if(user != null){
            userId = user.id;
        }else{
            out.print(JSON.stringify({
                state:false,
                errorCode:"needLogin"
            }));
            return;
        }


        var allowedType = "gif,jpg,jpeg,bmp,png";
        //var fileUploadType = selfApi.SysArgumentUtil.getSysArgumentStringValue(selfApi.Global.HEAD_MERCHANT, selfApi.Global.COLUMNID_SYS_FILES, "FileUploadType");
        var fileUploadMaxSize = selfApi.SysArgumentUtil.getSysArgumentStringValue(selfApi.Global.HEAD_MERCHANT, selfApi.Global.COLUMNID_SYS_FILES, "fileUploadMaxSize");
        var allowed = allowedType.split(",");
        var maxSize = 1024 * 1024 * 10;
        if (selfApi.StringUtils.isNotBlank(fileUploadMaxSize)) {
            maxSize = selfApi.Integer.parseInt(fileUploadMaxSize);
        }
        var fileInfos = selfApi.Util.upload(request, maxSize, allowed, selfApi.StaticPigeonEngine.pigeon.getFileSystem());
        if (fileInfos == null || fileInfos.size() == 0) {
            //错误，最少有一个
            var ret = new selfApi.JSONObject();
            ret.put("state", false);
            ret.put("msg", "未知错误");
            out.print(ret.toString());
            return;
        }
        var fileColumn = selfApi.IsoneBaseEngine.fileColumnService.getDefaultFileColumn(userId);
        var columnId = fileColumn.optString("id");
        var merchantId = fileInfos.get(0).getParameters().get("merchantId");
        fileInfos.get(0).setParameters(null);
        var files = new selfApi.JSONArray();
        for (var i = 0; i < fileInfos.size(); i++) {
            var info = fileInfos.get(i);
            if (info.getFileId() != null) {
                //这是一个图片
                var jFileInfo = new selfApi.JSONObject(info);
                jFileInfo.put("columnId", columnId);
                jFileInfo.put("merchantId", merchantId);
                var fileInfoId = selfApi.IsoneBaseEngine.fileService.addFile(jFileInfo, columnId);
                //生成小图返回
                var preview = selfApi.StaticPigeonEngine.pigeon.getFileSystem().getRelatedUrl(info.getFileId(), "85X85");
                var url = selfApi.StaticPigeonEngine.pigeon.getFileSystem().getUrl(info.getFileId());
                jFileInfo.put("fullPath", url);
                jFileInfo.put("existWatermark", "none");
                jFileInfo.put("showImageUrl", preview);
                jFileInfo.put("fileId", info.getFileId());
                files.put(jFileInfo);
            }
        }
        var ret = new selfApi.JSONObject();
        ret.put("files", files);
        ret.put("state", true);
        out.print(ret.toString());
    }catch(e){
        ret.state = false;
        ret.errorCode = "system_error";
        out.print(JSON.stringify(ret));
        $.log(e)
    }
})();