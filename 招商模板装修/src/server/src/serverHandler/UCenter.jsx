//#import Util.js
//#import product.js
//#import login.js
//#import user.js
//#import UserUtil.js
//#import file.js
//#import DateUtil.js
//#import sysArgument.js
//#import order.js
//#import appraise.js
//#import address.js
//#import account.js
//#import $hdLouPanDirectBuy:services/GiftProductService.jsx
//#import $FavoriteProduct:services/FavoriteProductService.jsx
//#import $FavoriteCombiProduct:services/FavoriteCombiProductService.jsx

(function () {


    var selfApi = new JavaImporter(
        Packages.org.json,
        Packages.net.xinshi.isone.modules,
        Packages.java.util,
        Packages.java.util.regex,
        Packages.net.xinshi.isone.functions.member,
        Packages.net.xinshi.isone.functions.order,
        Packages.net.xinshi.isone.functions.card,
        Packages.net.xinshi.isone.modules.order.bean,
        Packages.net.xinshi.isone.modules.order,
        Packages.net.xinshi.isone.modules.order.OrderSearchUtil,
        Packages.net.xinshi.isone.functions.product,
        Packages.net.xinshi.isone.modules.user,
        Packages.net.xinshi.isone.modules.user.tools
    );

    var requestURI = request.getRequestURI() + "";

    var ret = {
        state:false,
        errorCode:""
    }
    var userId = "";
    var userName = "";
    var logo = "";
    var user = LoginService.getFrontendUser();
    if (user) {
        userId = user.id;
        logo = user.logo;
        if(logo=="/upload/user_none_100.gif"){
            logo ="empty";
        }
        if (user.realName) {
            userName = user.realName;
        }
        else if (user.nickName) {
            userName = user.nickName;
        }
        else if (user.loginId) {
            userName = user.loginId;
        }else if(user.mobilPhone){
            userName=user.mobilPhone;
        }
        else {
            userName = user.id;
        }
    } else {
        ret.errorCode="notLogin";
        out.print(JSON.stringify(ret));
        return;
    }



    var accountType = Packages.net.xinshi.isone.modules.account.IAccountService.ACCOUNT_TYPE_SHOPPINGINTEGRAL + "";

    var userAccount = UserService.getUserAccount(userId, accountType);
    var userAccountAmount = 0;
    if (userAccount) {
        userAccountAmount = UserService.getObjAmount(userAccount.id, userId) / 100;
    }

    var couponCount = selfApi.CardFunction.getUserAvailableCardCount(userId, 'cardType_coupons');


    //最近订单
    var orderColumn = Packages.net.xinshi.isone.modules.order.IOrderService.U_ORDER_LIST_COLUMN_ID_ALL + "";
    var orderType = Packages.net.xinshi.isone.modules.order.IOrderService.ORDER_LIST_TYPE_ALL + "";
    var orderMap = OrderService.getMyOrderList(userId, orderColumn, orderType, 1, 3);
    var total =0;
    if(orderMap){
        total =orderMap.count;
    }
    //安全中心登记
    var grade = user&&user.grade;
    if(grade){
        grade = parseInt(grade);
        if(user.checkedemailStatus == "1"){
            grade += 20;
        }
        if(user.checkedphoneStatus == "1"){
            grade += 20;
        }
    }else{
        grade = 20;
    }

    var userGrade = '低';
    if(grade>30&&grade<=70){
        userGrade = '中';
    }else if(grade>70){
        userGrade = '高';
    }
    //我的收藏数
    var favorCount = 0;
    favorCount = FavoriteProductService.getAllFavoriteListSize(userId)+FavoriteCombiProductService.getAllFavoriteListSize(userId);

    // 我的评论
    var appraisSearchArgs={"createUserId":userId,"effect":"true","searchIndex":true,"doStat":true,"page":1,"limit":5,"logoSize":"50X50"};
    var appraiseList=AppraiseService.getProductAppraiseList(appraisSearchArgs);
    var appraiseTotal = 0;
    if(appraiseList){
        appraiseTotal = appraiseList.totalCount
    }
    //地址
    var addressList = AddressService.getAllAddresses(userId);
    var addressCount = 0;
    if(addressList){
        addressCount = addressList.length;
    }
    var userGroup = UserService.getUserTopGroupByUserId(userId);

    var isCanViewReport = UserService.checkMemberGroup(userId, "c_113");//高层领导

    //预存劵
    var depositBalance = "" + AccountService.getUserBalance(userId, "head_merchant", "eWallet");

    //礼包
    var totalRecords = GiftProductService.getAllGiftProductListSize(userId);

    //我的好友
    var searchArgs ={};
    searchArgs.parentId = userId;
    searchArgs.limit = 1000;
    var s = JSON.stringify(searchArgs);
    var args = new UserUtilApi.JSONObject(s);
    var json = UserUtilApi.UserSearchUtil.searchUser(args);
    var results = JSON.parse(json.toString());
    var friendTotal = results.total;


    ret = {
        state:"ok",
        userAccountAmount: userAccountAmount,
        couponCount: couponCount,
        isCanViewReport: isCanViewReport,
        userGrade: userGrade,
        userName: userName,
        favorCount: favorCount,
        appraiseTotal: appraiseTotal,
        addressCount: addressCount,
        logo: logo,
        total: total,
        totalRecords:totalRecords,
        depositBalance:depositBalance,
        friendTotal:friendTotal
    }
    out.print(JSON.stringify(ret));
})();