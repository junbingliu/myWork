$(function (){
    var registerForm = $("#registerForm");

    jQuery.validator.addMethod("accountCheck", function(value, element) {
        var regex = /^[a-zA-Z]([a-zA-Z0-9(_)(\-)]+)$/;
        return this.optional(element) || (regex.test(value));
    }, "用户名只能输入数字、字母、减号和下划线，以字母开头");

    jQuery.validator.addMethod("mobile", function (value, element) {
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        return  this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");

    jQuery.validator.addMethod("passwordConfirm", function(value, element) {
        var pwd = $("#password").val();
        return this.optional(element) || (pwd == value);
    }, "您输入的密码不一致");

    var formValidate = registerForm.validate({
        errorElement: 'div',
        errorClass: 'fl wrong',
        focusInvalid: false,
        ignore: "",
        //   debug: true,
        rules: {
            loginId: {required:true, accountCheck:true, remote:"/" + appId + "/handler/judgeMemberField.jsx"},
            mobilePhone: {required:true, mobile:true, digits:true, remote:"/" + appId + "/handler/judgeMemberField.jsx"},
            mobileValidateCode: {required:true},
            parentId: {required:"#parentId:filled"},
            password: {required:true, rangelength:[6,20]},
            password_confirm: {required:true, passwordConfirm:true},
            protocol_check: {required:true}
        },
        messages: {
            loginId: {required:"请设置您的登录帐号", remote:"对不起，此帐号已注册，请换一个"},
            mobilePhone: {required:"请填写您的手机号码", digits:"手机号码应为数字", rangelength:"手机号码为11位数字", mobile:"请正确填写您的手机号码", remote:"对不起，此手机已注册，请换一个"},
            mobileValidateCode: {required:"请填写短信验证码"},
            password: {required:"请设置您的密码", rangelength:"密码设置支持6-20位字母、符号或数字，密码区分大小写"},
            password_confirm: {required:"请再次输入您的密码"},
            protocol_check: {required:"抱歉，必须同意协议才能完成注册！"}
        },
        invalidHandler: function (event, validator) { //display error alert on form submit

        },
        highlight: function (element) { // hightlight error inputs
            $(element).closest('.form-group').addClass('wrong'); // set error class to the control group
        },
        unhighlight: function (element) { // revert the change done by hightlight
            var formGroup = $(element).closest('.form-group');
            formGroup.removeClass('wrong');
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest("li").after());
        },
        success: function (label) {
            label.closest('.form-group').removeClass('wrong'); // set success class to the control group
        },
        submitHandler: function (form) {
            function cleanPwd(){
                $("input:password",form).val("");
                $("input[name='captcha']",form).val("");
            }
            $(form).ajaxSubmit({
                type:"post",
                url:"/"+appId + "/handler/register_handler.jsx",
                dataType:"json",
                //beforeSubmit: showRequest,
                success: function(response){
                    if(response.state){
                        if(response["rurl"]){
                            document.location.href = response["rurl"];
                        }else{
                            document.location.href = window.normalWebSite + "/index.jsp";
                        }
                    }else{
                        if(response.errorCode == "empty_loginId"){
                            var helpBlock = $(".form-group",form);
                            helpBlock.html("请输入您的用户名");
                            $("#loginId").addClass("wrong");
                            $("#loginId").focus();
                        } else if(response.errorCode == "loginId_length_error"){
                            var helpBlock = $(".wrong[for='loginId']",form);
                            helpBlock.html("请确认您输入的用户名在6-20字符");
                            $("#loginId").addClass("wrong");
                            $("#loginId").focus();
                        } else if(response.errorCode == "loginId_exist"){
                            var helpBlock = $(".wrong[for='loginId']",form);
                            helpBlock.html("对不起，此用户名已注册，请换一个");
                            $("#loginId").addClass("wrong");
                            $("#loginId").focus();
                        } else if(response.errorCode == "mobilePhone_exist"){
                            var helpBlock = $(".wrong[for='mobilePhone']",form);
                            helpBlock.html("您输入的手机号码已被注册，请换一个。");
                            $("#mobilePhone").addClass("wrong");
                            $("#mobilePhone").focus();
                        }  else if(response.errorCode == "parentUser_notExist"){
                            var helpBlock = $(".wrong[for='parentId']",form);
                            helpBlock.html("您填写的推荐人不存在，请确认后重新填写。");
                            $("#parentId").addClass("wrong");
                        } else if(response.errorCode == "mobile_error"){
                            var helpBlock = $(".help-block[for='mobilePhone']",form);
                            helpBlock.html("您输入的手机号码有误,请重新输入。");
                            $("#mobilePhone").addClass("wrong");
                            $("#mobilePhone").focus();
                        } else if(response.errorCode == "empty_captcha"){
                            var helpBlock = $(".wrong[for='captcha']",form);
                            helpBlock.html("请填写验证码");
                            $("#captcha").addClass("wrong");
                            $("#captcha").focus();
                        } else if(response.errorCode == "captcha_error"){
                            var helpBlock = $(".wrong[for='captcha']",form);
                            helpBlock.html("验证码不正确");
                            $("#captcha").addClass("wrong");
                            $("#captcha").focus();
                        } else if(response.errorCode == "phone_validate_code_empty"){
                            var helpBlock = $(".wrong[for='mobileValidateCode']",form);
                            helpBlock.html("短信验证码已失效，请重新发送。");
                            $("#mobileValidateCode").addClass("wrong");
                            $("#mobileValidateCode").focus();
                        } else if(response.errorCode == "phone_validate_code_overdue"){
                            var helpBlock = $(".wrong[for='mobileValidateCode']",form);
                            helpBlock.html("短信验证码已过期，请重新发送。");
                            $("#mobileValidateCode").addClass("wrong");
                            $("#mobileValidateCode").focus();
                        } else if(response.errorCode == "phone_validate_code_error"){
                            var helpBlock = $(".wrong[for='mobileValidateCode']",form);
                            helpBlock.html("短信验证码错误");
                            $("#mobileValidateCode").addClass("wrong");
                            $("#mobileValidateCode").focus();
                        } else if(response.errorCode == "mobilePhone_error"){
                            var helpBlock = $(".wrong[for='mobilePhone']",form);
                            helpBlock.html("手机号码不是短信验证手机");
                            $("#mobilePhone").addClass("wrong");
                            $("#mobilePhone").focus();
                        } else if(response.errorCode == "mobile_exist"){
                            var helpBlock = $(".wrong[for='mobilePhone']",form);
                            helpBlock.html("对不起，该手机已注册，请换一个");
                            $("#mobilePhone").addClass("wrong");
                            $("#mobilePhone").focus();
                        }else{
                            alert(response.errorCode);
                        }
                    }
                }
            });
        }
    });

    $(".protocolPanel .btnLg").on("click",function(){
        $(".protocolPanel").fadeOut();
        var checkboxObj = $("span.checkbox",registerForm);
        checkboxObj.attr("data-checked","true").addClass("active");
        $("input:hidden",checkboxObj).val("true");
    });

    var beWait = false;

    var check = $(".check_code");
    var mobile = $("#mobileBlock");
    var mobileBlock = $("#mobileCodebindBtn");

    var jigsawValidateUtil = JigsawValidateUtil({
        getImgUrl:"/JigsawValidateUtilPlugin/handler/gi.jsx",
        postUrl:"/" + appId + "/handler/getMobileCaptcha.jsx",
        httpStyle:'get',
        success:setSuccess
    });

    function setSuccess(resp) {
        if(resp.state){
            alert("短信验证码已成功发出，请注意查收短信。");
            beWait = true;
            var timeOut = Number(window.msgInterval);//秒
            self.html((--timeOut)+"秒");
            var timer = setInterval(function(){
                timeOut--;
                self.html(timeOut+"秒");
                if(timeOut <=0){
                    clearInterval(timer);
                    self.html("获取验证码");
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
            }else if(resp.errorCode == "illegal_parameter"){
                msg = "参数非法。";
            }else if(resp.errorCode == "refresh"){
                msg = "操作出现异常，请刷新页面后重试。";
            }
            alert(msg);
        }
    }

    mobileBlock.on("click",".bindBtn",function(){
        var mobileObj = $(".userphone",mobile);
        var mobilePhone=mobileObj.val();
        mobilePhone= $.trim(mobilePhone);
        mobilePhone = acV + "#" + mobilePhone + "#" + acV;
        var mobileResult = formValidate.element(mobileObj);
        if(!mobileResult){
            return false;
        }
        var self = $(this);
        if(beWait){
            return
        }
        jigsawValidateUtil.show({p:encrypt($.trim(mobilePhone), kkV, iI)})
        // $.get("/" + appId + "/handler/getMobileCaptcha.jsx",{mobilePhone:mobileObj.val(), mid:window.mid, v:v},function(resp){
        //     if(resp.state){
        //         alert("短信验证码已成功发出，请注意查收短信。");
        //         beWait = true;
        //         var timeOut = Number(window.msgInterval);//秒
        //         self.html((--timeOut)+"秒");
        //         var timer = setInterval(function(){
        //             timeOut--;
        //             self.html(timeOut+"秒");
        //             if(timeOut <=0){
        //                 clearInterval(timer);
        //                 self.html("获取验证码");
        //                 beWait = false;
        //             }
        //         },1000);
        //     }else{
        //         var msg = "";
        //         if(resp.errorCode == "mobile_phone_empty"){
        //             msg = "请填写您的手机号码";
        //         }else if(resp.errorCode == "mobile_phone_exist"){
        //             msg = "对不起，此手机已注册，请换一个";
        //         }else if(resp.errorCode == "send_error"){
        //             msg = "系统繁忙，请稍后再试。";
        //         }else if(resp.errorCode == "wait"){
        //             msg = "发送太频繁，请稍后再试。";
        //         }else if(resp.errorCode == "active"){
        //             msg = "短信验证码还在有效期。";
        //         }else if(resp.errorCode == "refresh"){
        //             msg = "操作出现异常，请刷新页面后重试。";
        //         }
        //         alert(msg);
        //     }
        // },"json");

        return false;
    });
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

