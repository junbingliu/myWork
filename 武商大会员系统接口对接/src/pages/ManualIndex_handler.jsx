//#import Util.js
//#import login.js
//#import $wsBigMemberInterface:services/WSMemberService.jsx
//#import $wsBigMemberInterface:services/AppArgumentService.jsx

(function () {

    try {
        var loginUserId = LoginService.getBackEndLoginUserId();
        if (!loginUserId || loginUserId !== "u_0") {
            out.print("no privilege");
            return;
        }

        var iType = $.params["iType"];
        var s = $.params["postData"];
        if (!s || s == "") {
            out.print("请求参数为空");
            return;
        }
        var postData = JSON.parse(s);

        var jArgs = AppArgumentService.getArgs("head_merchant");

        var result = "";
        if (iType == "memberQuery") {
            //根据大购物车计算促销规则，并返回计算结果
            result = WSMemberService.memberQuery(jArgs, postData);

        } else if (iType == "appRegister") {
            //2开卡注册接口
            result = WSMemberService.appRegister(jArgs, postData);
        } else if (iType == "appBind") {
            //4绑卡
            result = WSMemberService.appBind(jArgs, postData);
        } else if (iType == "getMemInfo") {
            //5会员信息查询
            result = WSMemberService.getMemInfo(jArgs, postData);
        } else if (iType == "getBranchPointList") {
            //6获取各实体积分信息列表
            result = WSMemberService.getBranchPointList(jArgs, postData);
        }  else if (iType == "getAllValueList") {
            //7获取积分明细信息列表
            result = WSMemberService.getAllValueList(jArgs, postData);
        } else if (iType == "updateBranchPoint") {
            //8当前机构积分调整
            result = WSMemberService.updateBranchPoint(jArgs, postData);
        }  else if (iType == "memAddPassword") {
            //9新增修改密码
            result = WSMemberService.memAddPassword(jArgs, postData);
        } else if (iType == "addSaleList") {
            //10会员消费  （线上消费明细信息提供给大会员系统）
            result = WSMemberService.addSaleList(jArgs, postData);
        } else if (iType == "getAllSaleList") {
            //11获取消费明细信息
            result = WSMemberService.getAllSaleList(jArgs, postData);
        } else {
            out.print("未知的接口类型，iType=" + iType);
            return;
        }

        out.print(result);
    } catch (e) {
        out.print("提交出现异常，异常信息为：" + e);
    }

})();
