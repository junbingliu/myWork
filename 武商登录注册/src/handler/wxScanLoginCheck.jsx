//#import Util.js
//#import $shell20:service/service.jsx
//#import login.js
//#import merchant.js

(function(){
  var scanCode = $.params.scanCode;
  var data = Shell20Service.getScanCodeData(scanCode);
  if(data && data.userId)
  {
    Shell20Service.saveScanCodeData(scanCode,null);
    LoginService.loginBackendByUserId(data.userId);
    var ret={
      state:'ok'
    }
    out.print(JSON.stringify(ret));
  }
  else{
    var ret={
      state:'waiting'
    }
    out.print(JSON.stringify(ret));
  }


})();