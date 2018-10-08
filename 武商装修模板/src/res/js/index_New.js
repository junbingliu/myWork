/*图片滚动小插件*/
(function ($) {
    $.fn.myScroll = function (options) {//options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime:3000,
            Autoplay:true,
            Hover:false,
            Prev:"",
            Next:""
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function () {
            var selObject = $(this);//获取当前对象
            var picBox = selObject.find('.slide_wrap');
            var checkBox = selObject.find('.num');
            var sWidth = picBox.find("ul li").width();
            var len = picBox.find("ul li").length;
            var index = 0;
            var picTimer;

            var prevBtn = selObject.find(opts.Prev);
            var nextBtn = selObject.find(opts.Next);



            if(opts.Prev != "" && opts.Next != ""){
                picBox.find("ul").append(picBox.find("ul li:first").clone());
                picBox.find("ul").prepend(picBox.find("ul li").eq(len-1).clone());
                picBox.find("ul").css({width:sWidth * (len + 2),left:-sWidth});

                if(len < 2){
                    prevBtn.hide();
                    nextBtn.hide();

                }

                showHoverBtn();

                index = 1;

               selObject.hover(function(){
                    $(prevBtn).addClass("hover");
                },function(){
                    $(prevBtn).removeClass("hover");
                });

                selObject.hover(function(){
                    $(nextBtn).addClass("hover");
                },function(){
                    $(nextBtn).removeClass("hover");
                });

                prevBtn.click(function(){
                    index--;
                    if(index<1){
                        var nowLeft = 0*sWidth;
                        picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                            picBox.find("ul").css({left:-len*sWidth});
                        });
                        index = len;
                    }else{
                        showPics(index);
                    }
                });

                nextBtn.click(function(){
                    index++;
                    if(index>len){
                        var nowLeft = -index*sWidth;
                        picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                            picBox.find("ul").css({left:-sWidth});
                        });
                        index = 1;
                    }else{
                        showPics(index);
                    }
                });

            }else{
                picBox.find("ul").css({width:sWidth * (len + 1)});
            }


            if(opts.Autoplay){
                if(len>1){
                selObject.hover(function() {
                    clearInterval(picTimer);
                    checkBox.find("li").mouseover(function() {
                        index = checkBox.find("li").index(this);
                        showPics(index);
                    });
                },function() {
                    picTimer = setInterval(function() {
                        index++;
                        if(index == len) {
                            showFirPic();
                            index = 0;
                        } else {
                            showPics(index);
                        }
                    },opts.DelayTime);
                }).trigger("mouseleave");
            }}


            function showPics(index) {
                var nowLeft = -index*sWidth;
                picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime);
                checkBox.find("li").eq(index).addClass('cur').siblings().removeClass('cur');
            }

            function showFirPic() {
                picBox.find("ul").append(picBox.find("ul li:first").clone());
                var nowLeft = -len*sWidth;
                picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                    picBox.find("ul").css("left","0");
                    picBox.find("ul li:last").remove();
                });
                checkBox.find("li").eq(0).addClass('cur').siblings().removeClass('cur');
            }

            function showHoverBtn() {
                if(opts.Hover){
                    selObject.hover(function(){
                        prevBtn.show();
                        nextBtn.show();
                    },function(){
                        prevBtn.hide();
                        nextBtn.hide();
                    });
                }

            }

        });
    }
})(jQuery);

/*图片滚动小插件*/
(function ($) {
    $.fn.myScroll3 = function (options) {//options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime:3000,
            Autoplay:true,
            Prev:"",
            Next:""
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function () {
            var selObject = $(this);//获取当前对象
            var picBox = selObject.find('.slide_wrap');
            var checkBox = selObject.find('.num');
            var sWidth = picBox.find("ul li").width();
            var len = picBox.find("ul li").length;
            var index = 0;
            var picTimer;

            var prevBtn = selObject.find(opts.Prev);
            var nextBtn = selObject.find(opts.Next);

            if(len >= 21){
                prevBtn.show();
                nextBtn.show();
            }

            if(opts.Prev != "" && opts.Next != ""){
                picBox.find("ul").css({width:sWidth * Math.ceil(len/4),left:0});
                index = 0;

                selObject.hover(function(){
                    $(prevBtn).addClass("hover");
                },function(){
                    $(prevBtn).removeClass("hover");
                });

                selObject.hover(function(){
                    $(nextBtn).addClass("hover");
                },function(){
                    $(nextBtn).removeClass("hover");
                });

                prevBtn.click(function(){
                    index--;
                    if(index<1){
                        var nowLeft = 0;
                        picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                            picBox.find("ul").css({left:0});
                        });
                        index = 0;
                    }else{
                        showPics(index);
                    }
                });

                nextBtn.click(function(){
                    index++;
                    if(index > (Math.ceil(len/20)-1) ){
                        var nowLeft = 0;
                        picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                            picBox.find("ul").css({left:0});
                        });
                        index = 0;
                    }else{
                        showPics(index);
                    }
                });

            }else{
                picBox.find("ul").css({width:sWidth * Math.ceil(len/4)});
            }


            if(opts.Autoplay){
                selObject.hover(function() {
                    clearInterval(picTimer);
                    checkBox.find("li").mouseover(function() {
                        index = checkBox.find("li").index(this);
                        showPics(index);
                    });
                },function() {
                    picTimer = setInterval(function() {
                        index++;
                        if(index == len) {
                            showFirPic();
                            index = 0;
                        } else {
                            showPics(index);
                        }
                    },opts.DelayTime);
                }).trigger("mouseleave");
            }


            function showPics(index) {
                var nowLeft = - 5*sWidth*index ;
                picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime);
                checkBox.find("li").eq(index).addClass('cur').siblings().removeClass('cur');
            }

            function showFirPic() {
                var nowLeft = -Math.ceil(len/4)*sWidth;
                picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                    picBox.find("ul").css("left","0");
                });
                checkBox.find("li").eq(0).addClass('cur').siblings().removeClass('cur');
            }

        });
    }
})(jQuery);

/*图片滚动小插件*/
(function ($) {
    $.fn.myScroll4 = function (options) {//options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime:3000,
            Autoplay:true,
            Prev:"",
            Next:""
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function () {
            var selObject = $(this);//获取当前对象
            var picBox = selObject.find('.slide_wrap');
            var checkBox = selObject.find('.num');
            var sWidth = picBox.find("ul li").width();
            var len = picBox.find("ul li").length;
            var index = 0;
            var picTimer;

            var prevBtn = selObject.find(opts.Prev);
            var nextBtn = selObject.find(opts.Next);

            if(len >= 4){
                prevBtn.show();
                nextBtn.show();
            }

            if(opts.Prev != "" && opts.Next != ""){
                picBox.find("ul").css({width:sWidth * Math.ceil(len/3),left:0});
                index = 0;

                selObject.hover(function(){
                    $(prevBtn).addClass("hover");
                },function(){
                    $(prevBtn).removeClass("hover");
                });

                selObject.hover(function(){
                    $(nextBtn).addClass("hover");
                },function(){
                    $(nextBtn).removeClass("hover");
                });

                prevBtn.click(function(){
                    index--;
                    if(index<1){
                        var nowLeft = 0;
                        picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                            picBox.find("ul").css({left:0});
                        });
                        index = 0;
                    }else{
                        showPics(index);
                    }
                });

                nextBtn.click(function(){
                    index++;
                    if(index > (Math.ceil(len/3)-1) ){
                        var nowLeft = 0;
                        var lastm=Math.ceil(len/3)-1;
                        picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                            picBox.find("ul").css({left:0});
                        });
                        index = 0;
                    }else{
                        showPics(index);
                    }
                });

            }else{
                picBox.find("ul").css({width:sWidth * Math.ceil(len/3)});
            }


            if(opts.Autoplay){
                selObject.hover(function() {
                    clearInterval(picTimer);
                    checkBox.find("li").mouseover(function() {
                        index = checkBox.find("li").index(this);
                        showPics(index);
                    });
                },function() {
                    picTimer = setInterval(function() {
                        index++;
                        if(index == len) {
                            showFirPic();
                            index = 0;
                        } else {
                            showPics(index);
                        }
                    },opts.DelayTime);
                }).trigger("mouseleave");
            }


            function showPics(index) {
                var nowLeft = - index*sWidth;
                picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime);
                checkBox.find("li").eq(index).addClass('cur').siblings().removeClass('cur');
            }

            function showFirPic() {
                var nowLeft = -Math.ceil(len/3)*sWidth;
                picBox.find("ul").stop(true,false).animate({"left":nowLeft},opts.ScrollTime,function() {
                    picBox.find("ul").css("left","0");
                });
                checkBox.find("li").eq(0).addClass('cur').siblings().removeClass('cur');
            }

        });
    }
})(jQuery);

/*图片渐隐渐显小插件*/
(function ($) {
    $.fn.myFade = function (options,call) {//options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime:3000,
            Autoplay:true,
            Prev:"",
            Next:""
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function () {
            var selObject = $(this);//获取当前对象
            var picBox = selObject.find('.slide_wrap');
            var checkBox = selObject.find('.num');
            var len = picBox.find("ul li").length;
            var index = 0;
            var picTimer;
            if(typeof call !== 'function'){
                return;
            }
            if(opts.Autoplay){
                selObject.hover(function() {
                    clearInterval(picTimer);
                    checkBox.find("li").mouseover(function() {
                        index = checkBox.find("li").index(this);
                        showPics(index);
                        call(index);
                    });
                },function() {
                    picTimer = setInterval(function() {
                        index++;
                        if(index == len) {
                            index = 0;
                            showPics(index);
                            call(index);
                        } else {
                            showPics(index);
                            call(index);
                        }
                    },opts.DelayTime);
                }).trigger("mouseleave");
            }


            function showPics(index) {
                picBox.find("li").eq(index).fadeIn(opts.ScrollTime).siblings().fadeOut(opts.ScrollTime);
                checkBox.find("li").eq(index).addClass('cur').siblings().removeClass('cur');
            }

        });
    }
})(jQuery);

/*首页右侧栏
function rgSidebar(){
    var winH = $(window).height();
    var rMain = $('.rg-sidebar .main');
    var rMainH = rMain.height();
    var rMainLi = rMain.find('li');

    if(winH>rMainH){
        rMain.css({top:(winH-rMainH)/2});
    }else{
        rMain.css({top:'0px'});
    }

    $(window).resize(function(){
        winH = $(window).height();
        if(winH>rMainH){
            rMain.css({top:(winH-rMainH)/2});
        }else{
            rMain.css({top:'0px'});
        }
    });

    rMainLi.each(function(){
        $(this).unbind('hover').hover(function(){
            rMainLi.find('.abb-tt').removeClass('cur');
            $(this).find('.abb-tt').addClass('cur');
            $(this).find('.con').show();

            var top = $(this).offset().top;

            if($(this).find('.con').css('display') == 'block'){
                var conH = $(this).find('.con').height();
                if((winH-top)<conH){
                    $(this).find('.con').addClass('bot');
                    $(this).find('.con').css({top:'-83px'}).stop(true,false).animate({left:'-209px',opacity:1});
                }else{
                    $(this).find('.con').removeClass('bot');
                    $(this).find('.con').css({top:'0px'}).stop(true,false).animate({left:'-209px',opacity:1});
                }
            }
        },function(){
            rMainLi.find('.con').hide().stop(true,false).animate({left:'-229px',opacity:0.8});
            $(this).find('.abb-tt').removeClass('cur');
        });
    });
}
*/

/*弹出窗活动广告
function popAd(){
    var popBox = $('.pop-box');

    if(popBox.length>0){
        popBox.onload=imgAuto();
    }

    function imgAuto(){
        popBox.slideDown(500);
        var winH = $(window).height();
        var picH = $('.pop-box').find('.con').height();

        if(winH>picH){
            popBox.find('.con').css({marginTop:(winH-picH)/2});
        }

        if(popBox.css('display') == 'block'){
            setTimeout(function(){
                popBox.slideUp(500);
            },10000);
        }
    }

    popBox.find('.close').click(function(){
        popBox.slideUp(500);
    });
}
*/
$(document).ready(function () {
	
    $("#ranking li").each(function () {
        $(this).mouseover(
            function () {
                $("#ranking li").removeClass("cur");
                $(this).addClass("cur");
            });
    });

//    /*首页右侧栏*/
//    var winHeight=$(window).height(),ulH=$(".right_bar ul").height();
//
//	$(".right_bar ul").css({"margin-top":(winHeight-ulH)/2});
//
//	window.onresize=function(){
//		winHeight=$(window).height();
//		$(".right_bar").css({"height":winHeight});
//		$(".right_bar ul").css({"margin-top":(winHeight-ulH)/2});
//	}
//
//	$(".right_gotop").bind({
//		click:function(){$("html, body").animate({ scrollTop: 0 }, 1000);},
//		mouseenter:function(){$(this).children("div").show().stop(true,false).animate({"right":"35px"});},
//		mouseleave:function(){$(this).children("div").animate({"right":"60px"}).hide(1);}
//	});
//
//	$(".right_bar ul li").each(function(){
//		$(this).hover(function(){
//				$(this).children("div").show().stop(true,false).animate({"right":"35px"});
//			},
//				function(){
//				$(this).children("div").animate({"right":"60px"}).hide(1);
//			})
//		});
//
//	$(".right_ma").hover(function(){
//			$(this).children("img").show();
//		},
//			function(){
//			$(this).children("img").hide();
//	});
//
//	$(".right_service").click(function(){
//			window.open("http://kefu.qycn.com/vclient/chat/?websiteid=86671&clienturl=http%3A%2F%2Fwww.wushang.com","_blank","height=650,width=750,top=100,left=200,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no")});
//	/*右侧导航结束*/
//	/*实体图片伸缩*/
//	/*   $("#slideAdv_rightContent li").each(function () {
//	        $(this).mouseover(
//	            function () {
//	                $("#slideAdv_rightContent li").removeClass("cur");
//	                $(this).addClass("cur");
//	            });
//	    });
//	*/
   
    /*banner轮播*/
    $('.slide_banner .slide_adv li').eq(0).find('img').addClass('scale');
    $('.slide_banner').myFade(
        {DelayTime:6000,ScrollTime: 2000},
        function(index){
            $('.slide_banner .slide_adv li').find('img').removeClass('scale');
            $('.slide_banner .slide_adv li').eq(index).find('img').addClass('scale');
        }
    );
	
	/*楼层logo*/
	$('.floor_logo').myScroll4({ScrollTime: 500,Autoplay:false,Hover:true,Prev:".prev",Next:".next"});
    
    /*logo墙*/
    $('.hotbrand').myScroll3({ScrollTime: 500,Autoplay:false,Prev:".prev",Next:".next"});
    $('.floor_logo').myScroll({ScrollTime: 500,Autoplay:true});
    /*弹出窗活动广告*/
    //popAd();
    /*优惠券*/
    $(".juan").each(function () {
        var mainUrl = "http://www.wushang.com/";
        $(this).click(function () {
            var aid = $(this).attr("name");
            if (!aid || aid == "undefined") {
                return;
            }
            var params = {"aids": aid};
            $.post(mainUrl + "MobilePromotion/serverHandlers/getCard/freeGetTeamCardHandler.jsx", params,
                function (data) {
                    var code = data["code"];
                    if (code == "101") {
                        window.location.href = "/login/sign_in.jsp";
                    } else if (code == "0") {
                        alert("领券成功");
                    } else {
                        alert(data["msg"]);
                    }
                }, "json");
        });
    });
});


