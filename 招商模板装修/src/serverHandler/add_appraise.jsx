//#import Util.js

;(function() {
    var selfApi = new JavaImporter(
        Packages.net.xinshi.isone.modules,
        Packages.net.xinshi.isone.session,
        Packages.net.xinshi.isone.modules.user,
        Packages.net.xinshi.isone.commons,
        Packages.net.xinshi.isone.base,
        Packages.net.xinshi.isone.modules.credit,
        Packages.org.json,
        Packages.org.apache.commons.lang,
        Packages.java.lang,
        Packages.java.io,
        Packages.java.util,
        Packages.java.net
    );

    var jResult = new selfApi.JSONObject();
    try {

        var userId = selfApi.LoginSessionUtils.getFrontendLoginUserId(request);
        if (selfApi.StringUtils.isBlank(userId)) {
            jResult.put("state", "noLogin");
            jResult.put("msg", "请先登录");
            out.print(jResult.toString());
            return;
        }

        var productId = request.getParameter("productId");
        var starValue = request.getParameter("star");
        var isAnonymityValue = request.getParameter("isAnonymity");
        var commentValue = request.getParameter("comment");
        var validateCode = request.getParameter("ValidateCode");
        var fileIds = request.getParameterValues("fileIds");
		
		if(selfApi.StringUtils.isBlank(isAnonymityValue)){
			isAnonymityValue = "false"
		}

        if (selfApi.StringUtils.isBlank(validateCode)) {
            jResult.put("state", "nullValicode");
            jResult.put("msg", "请输入4位数字验证码");
            out.print(jResult.toString());
            return;
        }

        var sessionValidateCode = selfApi.IsoneBaseEngine.sessionService.getSessionValue(selfApi.ISessionService.VALIDATE_CODE, request);
        if (selfApi.StringUtils.isBlank(sessionValidateCode) || !sessionValidateCode.equalsIgnoreCase(validateCode)) {
            jResult.put("state", "errorValicode");
            jResult.put("msg", "验证码错误");
            out.print(jResult.toString());
            return;
        }

        var jProduct = selfApi.IsoneModulesEngine.productService.getProduct(productId);
        if (jProduct == null) {
            jResult.put("state", "noProduct");
            jResult.put("msg", "商品不存在");
            out.print(jResult.toString());
            return;
        }

        //是否允许用户不下单即可评价商品
        //var isEnableFreeCommentForProduct = selfApi.CreditAppraiseArgumentsUtil.isEnableFreeCommentForProduct();
        //if(!isEnableFreeCommentForProduct){
        //    jResult.put("state", "noAppraise");
        //    jResult.put("msg", "当前系统为不允许用户不下单即可评价商品状态，如需评价，请先购买");
        //    out.print(jResult.toString());
        //    return;
        //}

        var canComment = Packages.net.xinshi.isone.functions.product.ProductFunction.isBoughtProduct(userId,productId,'112');
        if(!canComment){
            jResult.put("state", "noTwice");
            jResult.put("msg", "当前系统为不允许用户不下单即可评价商品状态，如需评价，请先购买");
            out.print(jResult.toString());
            return
        }

        var jAppraise = selfApi.IsoneCreditEngine.productAppraiseService.getAppraise(productId, userId);
        if (jAppraise != null) {
            jResult.put("state", "noTwice");
            jResult.put("msg", "一个用户只能对一个商品评价一次");
            out.print(jResult.toString());
            return;
        }

        var jComment = new selfApi.JSONObject();
        jComment.put("productId",productId);
        jComment.put("star",starValue);
        jComment.put("isAnonymity",isAnonymityValue);
        jComment.put("comment",commentValue);

        if(fileIds != null && fileIds.length > 0){
            var imagesArray = new selfApi.JSONArray();
            for(var i=0;i< fileIds.length;i++){
                imagesArray.put(fileIds[i]);
            }
            jComment.put("images",imagesArray);
        }

        var doResult = selfApi.IsoneCreditEngine.productAppraiseService.addAppraise(userId, productId, jComment);
//        System.out.println("...doAppraise=" + doResult.optString("state"));

        if (doResult.optString("state").equals("0")) {
            jResult.put("state", "ok");
        } else {
            jResult.put("state", "error");
            jResult.put("msg", doResult.optString("msg"));
        }
        out.print(jResult.toString());
    } catch (ex) {
        $.log(ex);
        jResult.put("state", "error");
        jResult.put("msg", "操作出现异常：" + ex);
        out.print(jResult.toString());
    }
})();