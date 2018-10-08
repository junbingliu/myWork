//#import login.js
//#import Util.js
//#import $wsBigMemberInterface:services/WSMemberService.jsx
//#import $wsBigMemberInterface:services/AppArgumentService.jsx

(function () {
    var merchantId = $.params["m"];

    var loginUserId = LoginService.getBackEndLoginUserId();
    if (!loginUserId || loginUserId !== "u_0") {
        out.print(JSON.stringify({"code": "100", "msg": "no privilege"}));
        return;
    }

    var jArgs = AppArgumentService.getArgs("head_merchant");
    // jArgs.address = "http://61.183.185.244:8081/app.ms?wsdl";
    // jArgs.namespaceURI = "http://jawxs.ums.hbwhws/jaxws/memberserviceapp";

    //1绑定前会员信息查询
    var postData = {
        branchcode: "124",
        // systemcode: "app",
        mobileno: "13527618974",
        querytype: "5"
    };
    // var result = WSMemberService.memberQuery(jArgs, postData);
    // out.print(result);

    //2开卡注册接口
    // var postData = {
    //     branchcode: "124",
    //     systemcode: "app",
    //     mobileno: "13527618974"
    // };
    // var result = WSMemberService.appRegister(jArgs, postData);
    // out.print(result);

    //3发送校验码
    // var postData = {
    //     branchcode: "124",
    //     mobileno: "13527618974",
    //     idno: "",
    //     systemcode: "app"
    // };
    // var result = WSMemberService.workflowCrmIdnoVerify(jArgs, postData);
    // out.print(result);

    //5会员信息查询
    // var postData = {
    //     branchcode: "124",
    //     value: "18221570497",
    //     type: "mobileno",
    //     systemcode: "app"
    // };
    // var result = WSMemberService.getMemInfo(jArgs, postData);
    // out.print(result);

    //6获取各实体积分信息列表
    // var postData = {
    //     memberid: "38209"
    // };
    // var result = WSMemberService.getBranchPointList(jArgs, postData);
    // out.print(result);

    //7获取积分明细信息列表
    // var postData = {
    //     branchcode: "124",
    //     memberid: "109859",
    //     measurecode: 1,
    //     pageindex: 1,
    //     pagesize: 10
    // };
    // var result = WSMemberService.getAllValueList(jArgs, postData);
    // out.print(result);

    //1绑卡(绑卡时验证手机号和身份证是否匹配)
    // var postData = {
    //     branchcode: "124",
    //     typeno: "5",
    //     mobileno: "18221570497",
    //     idno: "420621196710291878"
    // };
    // var result = WSMemberService.appBind(jArgs, postData);
    // out.print(result);

    //8当前机构积分调整
    var postData = {
        branchcode: "124",
        memberid: "5",
        shopname: "18221570497",
        point: "100.00",
        paypassword: "123456",
        remark: "123456",
        type: 3
    };
    var result = WSMemberService.updateBranchPoint(jArgs, postData);
    out.print(result);

})();

