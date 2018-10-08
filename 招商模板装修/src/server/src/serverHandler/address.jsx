//#import Util.js
//#import login.js
//#import user.js
//#import sysArgument.js
//#import address.js
//#import column.js


(function () {
        var requestURI = request.getRequestURI() + "";


        var userId = "";
        var user = LoginService.getFrontendUser();
        if(user){
            userId = user.id;
        }else{
            var result = {
                state: "notLogin"
            }
            out.print(result);
            return;
        }

        var addressList = AddressService.getAllAddresses(userId);
        for(var i=0;i<addressList.length;i++){
            if(addressList[i].regionName){
                continue;
            }
            addressList[i].regionName = ColumnService.getColumnNamePath(addressList[i].regionId,'c_region_1602',"");
        }

        var result = {
            state: "ok",
            addressList: addressList
        }
        out.print(JSON.stringify(result));
})();