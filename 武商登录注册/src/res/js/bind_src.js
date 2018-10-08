$(function (){
    $("#navTab").find("li").bind("click", function(){
        var tabId = $(this).attr("id");
        $(".verify-box").hide();
        $("#" + tabId.replace("tab", "form")).show();
        $(this).addClass("cur").siblings("li").removeClass("cur");
    });

    var beWait = false;
    $("#sendCode").bind("click", function(){
        var mobileObj = $("#mobilePhone");
        var mobileResult = mobileObj.val();
        var length = mobileResult.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(mobileResult && length == 11 && mobile.test(mobileResult)){
            if(beWait){
                return;
            }
            var v = calcValue(window.wsRValue, window.wsRATValue);
            $.get("/" + appId + "/handler/getMobileCaptcha.jsx",{mobilePhone:mobileResult, mid:window.mid, v:v},function(resp){
                if(resp.state){
                    alert("短信验证码已成功发出，请注意查收短信。");
                    beWait = true;
                    var timeOut = Number(window.msgInterval);//秒
                    $("#sendCode").html((--timeOut)+"秒");
                    var timer = setInterval(function(){
                        timeOut--;
                        $("#sendCode").html(timeOut+"秒");
                        if(timeOut <=0){
                            clearInterval(timer);
                            $("#sendCode").html("获取验证码");
                            beWait = false;
                        }
                    },1000);
                }else{
                    var msg = "";
                    if(resp.errorCode == "mobile_phone_empty"){
                        msg = "请填写您的手机号码";
                    }else if(resp.errorCode == "mobile_phone_exist"){
                        msg = "对不起，此手机已注册，请换一个";
                    }else if(resp.errorCode == "send_error"){
                        msg = "系统繁忙，请稍后再试。";
                    }else if(resp.errorCode == "wait"){
                        msg = "发送太频繁，请稍后再试。";
                    }else if(resp.errorCode == "active"){
                        msg = "短信验证码还在有效期。";
                    }
                    alert(msg);
                }
            },"json");
        } else{
            alert("请正确填写您的手机号码");
        }
    });

    var phoneForm = $("#phoneForm");
    $(phoneForm).ajaxForm({
        type:"post",
        url:"/"+appId+"/handler/bindPhone_handler.jsx",
        dataType:"json",
        beforeSubmit: checkPhone,
        success: function(response){
            if(response.state){
                var redirect = "";
                if (response["returnUrl"] && response["returnUrl"] != "") {
                    redirect = response["returnUrl"];
                } else {
                    redirect = "/";
                }
                document.location.href = redirect;
            } else{
                alert(response.errorCode);
            }
        }
    });
    function checkPhone(){
        var phone = $("#mobilePhone").val();
        var code = $("#mobileValidateCode").val();
        if(phone==""){
            alert("请输入手机号码");
            return false;
        } else if(code==""){
            //alert("请输入短信验证码");
            //return false;
        } else{
            return true;
        }
    }

    var bindForm = $("#bindForm");
    $(bindForm).ajaxForm({
        type:"post",
        url:"/"+appId+"/handler/bindAccount_handler.jsx",
        dataType:"json",
        beforeSubmit: checkBind,
        success: function(response){
            if(response.state){
                var redirect = "";
                if (response["returnUrl"] && response["returnUrl"] != "") {
                    redirect = response["returnUrl"];
                } else {
                    redirect = "/";
                }
                window.location.href = redirect;
            } else{
                alert(response.errorCode);
            }
        }
    });
    function checkBind(){
        var loginId = $("#loginId").val();
        var password = $("#password").val();
        if(loginId==""){
            alert("请输入登录账号");
            return false;
        } else if(password==""){
            alert("请输入登录密码");
            return false;
        } else{
            return true;
        }
    }
});

function calcValue(pvc, pvcAt) {
    var rb = "";
    var re = "";
    var valueAt = pvcAt.split(",");
    for (var i = 0; i < valueAt.length; i++) {
        var iAt = parseInt(valueAt[i]);
        if (i % 2 == 0) {
            rb += (pvc.charAt(iAt));
        } else {
            re += (pvc.charAt(iAt));
        }
    }
    return "0." + rb + re;
}