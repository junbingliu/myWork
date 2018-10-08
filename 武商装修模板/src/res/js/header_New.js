$(document).ready(function () {

    /* mallCategory begin*/
//    var shouldShow=$(".mallCategory").attr("categoryShow");
//    if(shouldShow && shouldShow=='T'){
//        return;
//    }
//    else{
//        $(".mallSort > .sort").hide();
//        $(".mallCategory").mouseenter(function(){
//            $(".sort",this).fadeIn(300);
//        }).mouseleave(function(){
//                $(".sort",this).hide();
//            });
//    }

    var winHeight=$(window).height(),ulH=$(".right_bar ul").height();

	$(".right_bar ul").css({"margin-top":(winHeight-ulH)/2});

	window.onresize=function(){
		winHeight=$(window).height();
		$(".right_bar ul").css({"margin-top":(winHeight-ulH)/2});
	}

	$(".right_gotop").bind({
		click:function(){$("html, body").animate({ scrollTop: 0 }, 1000);},
		mouseenter:function(){$(this).children("div").show().stop(true,false).animate({"right":"35px"});},
		mouseleave:function(){$(this).children("div").animate({"right":"60px"}).hide(1);}
	});

	$(".right_bar ul li").each(function(){
		$(this).hover(function(){
				$(this).children("span").show().stop(true,false).animate({"right":"35px"});
			},
				function(){
				$(this).children("span").animate({"right":"60px"}).hide(1);
			})
		});

	$(".right_ma").hover(function(){
			$(this).children("img").show();
		},
			function(){
			$(this).children("img").hide();
	});

	$(".right_service").click(function(){
			window.open("http://kefu.qycn.com/vclient/chat/?websiteid=86671&clienturl=http%3A%2F%2Fwww.wushang.com","_blank","height=650,width=750,top=100,left=200,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no")});
	/*右侧导航结束*/

    var pathname=location.pathname;
    $.each($(".nav1 li a"), function(i, n){

       var href=$(n).attr("href");
        if(pathname.indexOf(href)>-1){
            $(".nav1 li a").removeClass("cur");
            $(n).addClass("cur");
        }
    });

    if(pathname.indexOf("index.jsp")>-1){
        function hidekf(){
            $(".kf_qycn_com_cckf_icon").hide();
        }
        setTimeout(hidekf,2000);


    }


//    function backToTop(){
//        var backToTopTxt = "返回顶部", backToTopEle = $('<a class="backToTop"></a>').appendTo($("body"))
//            .attr("title", backToTopTxt).click(function() {
//                $("html, body").animate({ scrollTop: 0 }, 1000);
//            });
//        backToTopFun = function() {
//            var st = $(document).scrollTop(), winh = $(window).height();
//            (st > 0)? backToTopEle.show(): backToTopEle.hide();
//            //IE6下的定位
//            if (!window.XMLHttpRequest) {
//                backToTopEle.css("top", st + winh - 166);
//            }
//        };
//        $(window).bind("scroll", backToTopFun);
//    }
//
//   backToTop();

    $("button.search_btn").click(function () {
        var keyword = $("#keyword").val();
        if (keyword == "请输入要查找的内容") {
            keyword = "";
            $("#keyword").val("");
        }
        var form = $("#search_form");
        form.submit();
    });

    $("#keyword").focus(function(){
        var keyword = $("#keyword").val();
        if (keyword == "请输入要查找的内容") {
            keyword = "";
            $("#keyword").val("");
        };
    });

    $("#keyword").blur(function(){
        var keyword = $("#keyword").val();
        if (keyword == "") {
            $("#keyword").val("请输入要查找的内容");
        };
    });

    $("ul li.sn_menu").mouseenter(function(){
        $(this).addClass("hover");
        $(this).children("div").attr("style","display:block");
    }).mouseleave(function(){
        $(this).removeClass("hover");
        $(this).children("div").attr("style","display:none");
    });


    /*导航的商品分类*/
    var shouldShow=$(".mallCategory").attr("categoryShow");
    var sortItem = $('.sort .item');
    var sortLayer = $('.mallSort .sort-two .sortLayer');
    var sortM = $('.mallSort .sort-m');
    $('.sort .item:odd').addClass('bg');
    if(!shouldShow || shouldShow!='T'){
        $(".mallSort .sort").hide();
        $('.mallSort').unbind('hover').hover(function(){
            return;
        },function(){
            sortM.hide();
        });

        $('.mallSort a').unbind('hover').hover(function(){
            sortM.show();
            $(".mallSort .sort").show();
        });

        sortM.unbind('hover').hover(function(){
            $(this).find('.sort-two').show();
            $(this).css({width:'730px'});
            return;
        },function(){
            $(this).find('.sort-two').hide();
            $(this).css({width:'220px'});
            sortItem.removeClass('itemCur').find('span').stop(true,false).animate({marginLeft:0},300);
            sortLayer.hide().stop(true,false).animate({left:-10,opacity:0.8},300);
            $(this).hide();
        });

        productClass(sortItem,sortLayer);

    }else{
        sortM.show();
        sortM.hover(function(){
            $(this).find('.sort-two').show();
            $(this).css({width:'710px'});
            return;
        },function(){
            $(this).find('.sort-two').hide();
            $(this).css({width:'200px'});
            sortItem.removeClass('itemCur');
            sortLayer.hide().stop(true,false).animate({left:-10,opacity:0.8},300);
            sortItem.find('span').stop(true,false).animate({marginLeft:0},300);
        });

        productClass(sortItem,sortLayer);
    }


    /*自动轮播*/
    var eletot=$("[data-id='bigAdvTab'] b");
    if(eletot.length == 1){
        return false;
    }
    else{
        var autoScroll=setInterval(setCur,6000);
        $(".slide_adv, #slide_adv,.pic, #pic").mouseenter(function(){
            clearInterval(autoScroll);
        }).mouseleave(function(){
            autoScroll=setInterval(setCur,6000);
        });
    }


    function setCur(){
        var ele=$("[data-id='bigAdvTab'] li[class='cur']").next();
        var ele2=$("[data-id='bigAdvTab'] b[class='cur']").next();

        if(ele.length==0){
            ele=$("[data-id='bigAdvTab'] li").eq(0);
        }
        if(ele2.length==0){
            ele2=$("[data-id='bigAdvTab'] b").eq(0);
        }
        ele.trigger("mouseenter");
        ele2.trigger("mouseenter");
    }



    /*Nav当前选中状态*/
    var url = window.location.href;
    $('.nav1 a').each(function(){
        var href = $(this).attr('href');
        if(url.indexOf(href)>=0){
            $('.nav1 a').removeClass('cur');
            $(this).addClass('cur');
        }else{
            $('.nav1 a').removeClass('cur');
        }
    });

});



/*导航的商品分类*/
function productClass(sortItem,sortLayer){
    sortItem.each(function(i){
        $(this).hover(function(){
            $(this).addClass('itemCur').siblings().removeClass('itemCur');
            sortItem.find('span').stop(true,false).animate({marginLeft:0},300);
            $(this).find('span').stop(true,false).animate({marginLeft:10},300);
            sortLayer.hide().stop(true,false).animate({left:-10,opacity:0.8},300);
            sortLayer.eq(i).show().stop(true,false).animate({left:0,opacity:1},300);

            var len = sortLayer.eq(i).length;
            if(len == 0 || len == null || len == 'undefined'){
                sortLayer.hide();
            }
        },function(){
            var len = sortLayer.eq(i).length;
            if(len == 0 || len == null || len == 'undefined'){
                $(this).removeClass('itemCur');
                sortLayer.hide();
                $(this).find('span').stop(true,false).animate({marginLeft:0},300);
            }
        });
    });
}