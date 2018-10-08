//#import Util.js
//#import login.js
//#import user.js
//#import $BuildingGuide:tools/buildingUtil.jsx
//#import $FangXingBase:tools/roomUtil.jsx

(function () {

    var result = {};
    try {
        var userId = LoginService.getFrontendUserId();
        if (!userId || userId == "") {
            result.state = "err";
            result.msg = "请先登录";
            out.print(JSON.stringify(result));
            return;
        }
        var user = UserService.getUser(userId);
        var userName ="";
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
        //
        var param = {userId: userId};
        var ret = BuildingUtil.getUserBuildings(param);
        if (ret.state == "ok") {
            var arrBuilds = ret.docs;
            var objRoomLists = {};
            for (var i = 0; i < arrBuilds.length; i++) {
                var build = arrBuilds[i];
                //id,regionId,code,name
                //获取楼盘下所以的户型
                var buildingCode = build.code;
                if (buildingCode) {
                    var param = {buildingCode: buildingCode};
                    var roomList = RoomUtil.getRoomsByBuildingCode(param);
                    if (roomList.state == "ok") {
                        var recordList = roomList.lists;
                        for (var k = 0; k < recordList.length; k++) {
                            var record = recordList[k];
                            if (record.size) {
                                try {
                                    record.size = Number(record.size).toFixed(2);
                                } catch (e) {
                                }
                            }
                        }
                        objRoomLists[build.id] = recordList;
                    }
                }
            }
            result.userName = userName;
            result.state = "ok";
            result.arrBuilds = arrBuilds;
            result.objRoomLists = objRoomLists;
            out.print(JSON.stringify(result));
        } else {
            result.state = "noData";
            out.print(JSON.stringify(result));
        }
    } catch (error) {
        result.state = "error";
        result.msg = error;
        out.print(JSON.stringify(result));
    }
})();