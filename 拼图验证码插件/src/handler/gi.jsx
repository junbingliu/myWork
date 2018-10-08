//#import Util.js
//#import session.js
//#import encryptUtil.js
//#import JigsawValidateUtil.js
//#import $globalSysArgsSetting:services/GlobalSysArgsService.jsx

(function () {

    var result = {};
    try {
        var bgImages = "";
        var access_token = "";
        var jArgs = GlobalSysArgsService.getArgs();
        if (jArgs) {
            if (jArgs.jigsawBgImages) bgImages = jArgs.jigsawBgImages;
            if (jArgs.jigsawAccess_token) access_token = jArgs.jigsawAccess_token;
        }

        var nowTime = new Date().getTime();
        var pAccess_token = $.params["ac"];
        $.log("576676"+pAccess_token)
        //加解密参数验证...................begin
        var md5LoginSessionIdValue = SessionService.getSessionValue("md5LoginSessionId", request);
        var md5Value = md5LoginSessionIdValue.split("|");
        var md5LoginSessionId = md5Value[0];
        var addTime = md5Value[1];
        $.log("--=-=-=-"+nowTime)
        $.log("8879878787"+addTime)
        if (nowTime - Number(addTime) > 1000 * 60 * 3) {
            result.code = "100";
            result.msg = "参数非法";
            out.print(JSON.stringify(result));
            return;
        }
        var key = md5LoginSessionId.substring(0, 16);
        var iv = md5LoginSessionId.substring(md5LoginSessionId.length - 16);
        var pAccess_token_value = EncryptUtil.decryptData(pAccess_token, key, iv);

        var img_access_token = md5LoginSessionIdValue + access_token + md5LoginSessionIdValue;
        if (img_access_token != pAccess_token_value) {
            result.code = "101";
            result.msg = "参数非法";
            out.print(JSON.stringify(result));
            return;
        }
        //加解密参数验证...................end

        var backgroundImageUrl = randomImageNumber(bgImages);
        if (!backgroundImageUrl) {
            result.code = "105";
            result.msg = "背景图参数未设置";
            out.print(JSON.stringify(result));
            return;
        }

        var jigsawSessionValue = SessionService.getSessionValue("jigsawSessionValue", request);
        var limitCount = 0;
        if (jigsawSessionValue) {
            var jsv = jigsawSessionValue.split("|");
            var lastLimitTime = Number(jsv[2]);
            limitCount = Number(jsv[3]);
            if (nowTime - Number(lastLimitTime) < 1000 * 60 * 3) {
                //三分钟内最多5次
                if (limitCount >= 5) {
                    result.code = "110";
                    result.msg = "太频繁了，请稍后再试";
                    out.print(JSON.stringify(result));
                    return;
                }
            } else {
                //超过3分钟重置为0
                limitCount = 0;
            }
            limitCount++;
        }

        var jResult = JigsawValidateUtil.drawImages(backgroundImageUrl);
        if (!jResult) {
            result.code = "106";
            result.msg = "异常了，请稍后再试";
            out.print(JSON.stringify(result));
            return;
        }
        var realX = jResult.realX;
        var imageWidth = jResult.imageWidth;

        jigsawSessionValue = realX + "|" + imageWidth + "|" + nowTime + "|" + limitCount;
        SessionService.addSessionValue("jigsawSessionValue", jigsawSessionValue, request, response);

        result.code = "0";
        result.msg = "操作成功";
        result.bgFilePath = jResult.bgFilePath;
        result.mattingFilePath = jResult.mattingFilePath;
        out.print(JSON.stringify(result));
    }
    catch (e) {
        $.log("\n............................e=" + e);
        result.code = "99";
        result.msg = "操作出现异常，请稍后再试";
        out.print(JSON.stringify(result));
    }

})();

function randomImageNumber(bgImages) {
    if (bgImages) {
        var images = bgImages.split("|");
        var max = images.length;
        if (max > 0) {
            var n = parseInt(Math.random() * max);
            return images[n];
        }
    }
    return "";
}

