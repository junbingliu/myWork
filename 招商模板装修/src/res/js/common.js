$(function () {
    //判断终端
    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone");
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v])!=-1) {
                window.location.href="http://wx.cmqhmall.com";
                break;
            }
        }
    }
    IsPC();

    // go top
    $(".go_top").click(function () {
        $("html,body").animate({ "scrollTop": 0 }, 200);
    });


    /* Table components
     * used: mywanjiaIndex.html
     * */
    function components_Table() {
        $('.table .tableThumb').each(function (){
            var thumbs = $(this).find('a');

            if (thumbs.length > 3) {
                $(this).find('.tableThumbSwitch').show();
            }

            // bind switch btn
            $(this).find('.tableThumbSwitch').click(function (){

                if (!$(this).prop('data-collapse')) {
                    $(this).siblings('.tableThumbBd').animate({ 'width': (50+8) * thumbs.length + 'px'});
                    $(this).prop('data-collapse', true);
                } else {
                    $(this).siblings('.tableThumbBd').animate({ 'width': 170 + 'px'});
                    $(this).prop('data-collapse', false);
                }
            });
        });
    }

    components_Table();

    /* floatEntry */
    //function floatEntry (){
    //    $(window).scroll(function (){
    //        if($(window).scrollTop() >= 490) {
    //            $('.floatEntry').fadeIn();
    //        } else {
    //            $('.floatEntry').fadeOut();
    //        }
    //    })
    //}
    //
    //floatEntry();

    /* panel */
    //function panel(){
    //    $('.messagePanel .closeBtn').click(function () {
    //        $(this).parents('.messagePanel').fadeOut();
    //    });
    //}
    //panel();

    $(".sortBox").on("mouseover",function(){
        if($(this).attr("focusShow") == "1"){
            return;
        }
        $(".menuLayer",this).show();
    }).on("mouseleave",function(){
        if($(this).attr("focusShow") == "1"){
            return;
        }
        $(".menuLayer",this).hide();
    });

    //菜单弹出
    $('.subMenu dl').hover(function(){
        var layer = $(this).find('.sortLayer');
        if (layer.length) {
            $(this).prev().find('.m-mark').stop().animate({'width': 200,'padding-left': 0}, 300);
            $(this).addClass('active').find('.m-mark').stop().animate({'width': 181,'padding-left': 20}, 300).siblings('.sortLayer').fadeIn();
        };

    },function(){
        var layer = $(this).find('.sortLayer');
        if (layer.length) {
            $(this).prev().find('.m-mark').stop().animate({'width': 181}, 300);
            $(this).removeClass('active').find('.m-mark').stop().animate({'width': 181,'padding-left': 0}, 300).siblings('.sortLayer').fadeOut().end();
        };
    })

    //产品经过显示按钮
    $('.floorBox .list').hover(function(){
        $(this).addClass('active').find('.scroll-box').stop().animate({marginTop : -46,opacity : .6},500);
    },function(){
        $(this).removeClass('active').find('.scroll-box').stop().animate({marginTop : 0,opacity : 1},500);
    })

    // 搜索向右展开
    $('.searchCty .searchBox').hover(function() {
        $(this).find('.searchVal').stop().animate({width : 308}, 500);
    }, function() {
        $(this).find('.searchVal').stop().animate({width : 0}, 500);
    });


    var topCart = $("#topCart");
    function getCart(){
        $.get("/appMarket/appEditor/getCart.jsp",{tt:Math.random()},function(data){
            var totalNumber = 0;
            var totalPrice = 0;
            var items = [];
            if(data.state=="ok"){
                $.each(data.oc,function(i,cartData){
                    if(cartData.cartType!="common"){
                        return;
                    };
                    $.each(cartData.buyItems,function(j,item){
                        totalNumber += Number(item.number);
                        totalPrice += Number(item.totalPayPrice);
                        var unitPrice = item.unitPrice;
                        item.unitPrice = unitPrice;
                        items.push(item);
                    });
                });
                var data = {
                    buyItems:items,
                    totalNumber:totalNumber,
                    totalPrice:totalPrice.toFixed(2)
                };
                if(data.totalNumber >0){
                    $(".cartLayer",topCart).html(template("cartLayerTemplate",data));
                    $("#cartItemNumber",topCart).html(totalNumber + "");
                    $("#sideCartItemNumber").html(Number(totalNumber) > 99 ? "99+" : totalNumber+"");
                    topCart.attr("canShowLayer","true");
                    topCart.removeClass("cartEmpty");
                }else{
                    $(".cartLayer",topCart).html('<div class="spacer"></div><p>您的购物车是空的,<br/>快挑选喜欢的商品加入购物车吧</p>').addClass("cartEmpty");
                }
            } else{
                $(".cartLayer",topCart).html('<div class="spacer"></div><p>您的购物车是空的,<br/>快挑选喜欢的商品加入购物车吧</p>').addClass("cartEmpty");
            }
        },"json");
    };
    getCart();

    topCart.on("mouseenter",function(){
        var selfObj = $(this);
        if(selfObj.attr("canShowLayer") == "true"){
            selfObj.addClass("active");
            $(".cartLayer",topCart).show();
        }
    }).on("mouseleave",function(){
        var selfObj = $(this);
        selfObj.removeClass("active");
        $(".cartLayer",topCart).hide();
    });



    //购物车商品项删除全局事件
    $(document).ajaxSuccess(function(evt, request, settings) {
        if(settings.url == "handle/v3/deleteCartItem.jsp" || settings.url == "handle/v3/changeAmount.jsp"){
            if(JSON.parse(request.responseText).state == "ok"){
                getCart();
            }
        }else if(settings.url == "/shopping/handle/v3/do_buy.jsp"){
            if(request.responseText.indexOf("ok---") != -1){
                getCart();
            }
        }
        return;
    });


    $.get("/"+hd_appId + "/serverHandler/checkLogin.jsx",{t:Math.random()},function(resp){
        var loginMsgBlock = "";
        if(resp.state){
            if(resp.alreadyLogin){
                loginMsgBlock = "Hi，" + resp.loggedUserName + "欢迎回来!";
                loginMsgBlock += '<a href="/ucenter/index.html" rel="nofollow">个人中心</a>&nbsp;|&nbsp;<a href="/logout.html" rel="nofollow">退出</a>';
            }else{
                var rurl = encodeURIComponent(window.location.href);
                loginMsgBlock = "Hi，欢迎来" + resp.webName +"&nbsp;";
                loginMsgBlock += '<a href="'+resp.sslWebSite+'/login.html?rurl=' + rurl + '" rel="nofollow">登录</a>&nbsp;|&nbsp;<a href="'+resp.sslWebSite+'/register.html" rel="nofollow">注册</a>';
            }
        }
        $("#loginMsgBlock").prepend(loginMsgBlock);
    },"json");


    $("#header_ucenter_menu").on("mouseenter",function(){
        $(this).addClass("active");
        $(".menu_bd",this).show();
    }).on("mouseleave",function(){
        $(this).removeClass("active");
        $(".menu_bd",this).hide();
    });




});
$(document).ready(function () {
    /*相关字段搜索*/
    var searchForm = $("#search_form");
    var inputKeyword = $("#input_keyword", searchForm);
    if (searchForm.attr("autoSuggest") == "true" || true) {
        $.searchTypeaheads("#input_keyword");
    }
    /*end相关字段搜索*/
})

