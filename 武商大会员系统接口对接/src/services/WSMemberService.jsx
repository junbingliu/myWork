//#import pigeon.js
//#import WebServiceUtil.js

;
var WSMemberService = (function () {
    var f = {
        /**
         * 开卡注册
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        appRegister: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "appRegister";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 会员信息查询
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        getMemInfo: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "getMemInfo";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 绑定前会员信息查询
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        memberQuery: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "memberQuery";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 发送校验码
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        workflowCrmIdnoVerify: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "workflowCrmIdnoVerify";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 绑卡(绑卡时验证手机号和身份证是否匹配)
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        appBind: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "appBind";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 获取各实体积分信息列表
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        getBranchPointList: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "getBranchPointList";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 获取积分明细信息列表
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        getAllValueList: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "getAllValueList";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 当前机构积分调整
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        updateBranchPoint: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "updateBranchPoint";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 新增修改密码
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        memAddPassword: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "memAddPassword";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 会员消费  （线上消费明细信息提供给大会员系统）
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        addSaleList: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "addSaleList";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        },
        /**
         * 获取消费明细信息
         * @param jArgs
         * @param postData
         * @returns {*}
         */
        getAllSaleList: function (jArgs, postData) {
            var address = jArgs.address;
            var namespaceURI = jArgs.namespaceURI;
            var localPart = "getAllSaleList";
            return WebServiceUtils.invokeBlocking(address, namespaceURI, localPart, postData);
        }
    };
    return f;
})();