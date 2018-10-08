/*图片滚动小插件*/
(function($) {
    $.fn.myScroll = function(options) { //options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime: 3000,
            Autoplay: true,
            Hover: false,
            Prev: "",
            Next: ""
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function() {
            var selObject = $(this); //获取当前对象
            var picBox = selObject.find('.slide_wrap');
            var checkBox = selObject.find('.num');
            var sWidth = picBox.find("ul li").width();
            var len = picBox.find("ul li").length;
            var index = 0;
            var picTimer;

            var prevBtn = selObject.find(opts.Prev);
            var nextBtn = selObject.find(opts.Next);

            if (opts.Prev != "" && opts.Next != "") {
                picBox.find("ul").append(picBox.find("ul li:first").clone());
                picBox.find("ul").prepend(picBox.find("ul li").eq(len - 1).clone());
                picBox.find("ul").css({
                    width: sWidth * (len + 2),
                    left: -sWidth
                });

                if (len < 2) {
                    prevBtn.hide();
                    nextBtn.hide();
                }

                showHoverBtn();

                index = 1;

                selObject.hover(function() {
                        $(prevBtn).addClass("hover");
                    },
                    function() {
                        $(prevBtn).removeClass("hover");
                    });

                selObject.hover(function() {
                        $(nextBtn).addClass("hover");
                    },
                    function() {
                        $(nextBtn).removeClass("hover");
                    });

                prevBtn.click(function() {
                    index--;
                    if (index < 1) {
                        var nowLeft = 0 * sWidth;
                        picBox.find("ul").stop(true, false).animate({
                                "left": nowLeft
                            },
                            opts.ScrollTime,
                            function() {
                                picBox.find("ul").css({
                                    left: -len * sWidth
                                });
                            });
                        index = len;
                    } else {
                        showPics(index);
                    }
                });

                nextBtn.click(function() {
                    index++;
                    if (index > len) {
                        var nowLeft = -index * sWidth;
                        picBox.find("ul").stop(true, false).animate({
                                "left": nowLeft
                            },
                            opts.ScrollTime,
                            function() {
                                picBox.find("ul").css({
                                    left: -sWidth
                                });
                            });
                        index = 1;
                    } else {
                        showPics(index);
                    }
                });

            } else {
                picBox.find("ul").css({
                    width: sWidth * (len + 1)
                });
            }

            if (len < 2) {
                opts.Autoplay = false;
            }
            if (opts.Autoplay) {
                selObject.hover(function() {
                        clearInterval(picTimer);
                        checkBox.find("li").mouseover(function() {
                            index = checkBox.find("li").index(this);
                            showPics(index);
                        });
                    },
                    function() {
                        picTimer = setInterval(function() {
                                index++;
                                if (index == len) {
                                    showFirPic();
                                    index = 0;
                                } else {
                                    showPics(index);
                                }
                            },
                            opts.DelayTime);
                    }).trigger("mouseleave");
            }

            function showPics(index) {
                var nowLeft = -index * sWidth;
                picBox.find("ul").stop(true, false).animate({
                        "left": nowLeft
                    },
                    opts.ScrollTime);
                checkBox.find("li").eq(index).addClass('cur').siblings().removeClass('cur');
            }

            function showFirPic() {
                picBox.find("ul").append(picBox.find("ul li:first").clone());
                var nowLeft = -len * sWidth;
                picBox.find("ul").stop(true, false).animate({
                        "left": nowLeft
                    },
                    opts.ScrollTime,
                    function() {
                        picBox.find("ul").css("left", "0");
                        picBox.find("ul li:last").remove();
                    });
                checkBox.find("li").eq(0).addClass('cur').siblings().removeClass('cur');
            }

            function showHoverBtn() {
                if (opts.Hover) {
                    selObject.hover(function() {
                            prevBtn.show();
                            nextBtn.show();
                        },
                        function() {
                            prevBtn.hide();
                            nextBtn.hide();
                        });
                }

            }

        });
    }
})(jQuery);
(function($) {
    $.fn.myFade = function(options) { //options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime: 3000,
            Autoplay: true,
            Hover: true,
            Prev: "",
            Next: ""
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function() {
            var selObject = $(this); //获取当前对象
            var picBox = selObject.find('.slide_wrap');
            var checkBox = selObject.find('.num');
            var len = picBox.find("ul li").length;
            var index = 0;
            var picTimer;
            var prevBtn = selObject.find(opts.Prev);
            var nextBtn = selObject.find(opts.Next);

            if (opts.Prev != "" && opts.Next != "") {
                if (len < 2) {
                    prevBtn.hide();
                    nextBtn.hide();
                }
                showHoverBtn();
                index = checkBox.find("li.cur").index();

                prevBtn.click(function() {
                    index--;
                    if (index < 0) {
                        index = len - 1;
                        showPics(index);
                    } else {
                        showPics(index);
                    }
                });

                nextBtn.click(function() {
                    index++;
                    if (index >= len) {
                        index = 0;
                        showPics(index);
                    } else {
                        showPics(index);
                    }
                });

            }

            if (opts.Autoplay) {
                selObject.hover(function() {
                        clearInterval(picTimer);
                        checkBox.find("li").mouseover(function() {
                            index = checkBox.find("li").index(this);
                            showPics(index);
                        });
                    },
                    function() {
                        picTimer = setInterval(function() {
                                index++;
                                if (index == len) {
                                    index = 0;
                                    showPics(index);
                                } else {
                                    showPics(index);
                                }
                            },
                            opts.DelayTime);
                    }).trigger("mouseleave");
            }

            function showPics(index) {
                picBox.find("li").eq(index).fadeIn(opts.ScrollTime).siblings().fadeOut(opts.ScrollTime);
                checkBox.find("li").eq(index).addClass('cur').siblings().removeClass('cur');
            }

            function showHoverBtn() {
                if (opts.Hover) {
                    selObject.hover(function() {
                            prevBtn.show();
                            nextBtn.show();
                        },
                        function() {
                            prevBtn.hide();
                            nextBtn.hide();
                        });
                }

            }

        });
    }
})(jQuery);

(function($){
    $.fn.floorElevator = function(){
        return this.each(function(){
            var floors = $(this).find(".floor");
            var ele = $("#elevator");
            var eles = $("#elevator ul li");
            var list = new Array();
            var nowtop = $(document).scrollTop();
            var winh = $(window).height();
            var eleh = ele.height();
            var elet;

            floors.each(function() {
                var _this=$(this);
                list.push( _this.offset().top);
            });

            eles.each(function() {
                    $(this).on("click",function(){
                       var ind = $(this).index();
                        $('html, body').animate({scrollTop:list[ind]});
                    })
            });

            function elecur(){
                for (var n = 0, len = eles.length-1; n < len; n++) {
                    if (n < len && nowtop >= list[n] - 0.5 * winh && nowtop < list[n + 1] - 0.5 * winh) {
                        eles.eq(n).addClass("cur").siblings().removeClass("cur");
                    } else if (nowtop >= list[len] - 0.5 * winh) {
                        eles.eq(len).addClass("cur").siblings().removeClass("cur");
                    } else {
                        eles.eq(n).removeClass("cur");
                        continue;
                    }
                }
            }

            function showele(){
                if (winh >= eleh) {
                    elet = (winh - eleh) / 2 + "px";
                    ele.css("top", elet);
                    if (nowtop > winh) {
                        ele.show();
                        elecur();
                    } else {
                        ele.hide();
                    }
                } else {
                    ele.hide();
                }
            }

            showele();

            $(window).scroll(function() {
                nowtop = $(document).scrollTop();
                showele();
            });

            $(window).resize(function() {
                winh = $(window).height();
                showele();
            });

        });
    }
})(jQuery);

$(document).ready(function() {
    $("#elevator").hide();
    $('.pad-bt20').floorElevator();
    $('.slide_banner').myFade({DelayTime: 5000, ScrollTime: 1000, Prev: ".banner_prev", Next: ".banner_next"});
    $("#ranking li").each(function() {
        $(this).mouseover(function() {
            $("#ranking li").removeClass("cur");
            $(this).addClass("cur");
        });
    });
    $('.F-sort').myScroll();


    /*10点更新*/
    initTime();
    function initTime() {
        var url = "/phone_page/sales/getCurrDate.jsp";
        $.post(url, function (result) {
            var endDate = new Date(parseInt(result));
            endDate.setHours(10,3,0);
            if(endDate.getTime() > result)
                reFreshPage(result,endDate);
        });
    }

    function reFreshPage(nowDate,endDate) {
        if("undefined" == typeof endDate) return;
        var allSecond = ( endDate.getTime() - nowDate ) / 1000;
        if (allSecond > 0) {
            var timer = setInterval(function () {
                if (allSecond > 1) {
                    allSecond -= 1;
                } else {
                    $.post('/appEditor/handlers/getPageData.jsx',{ m:"head_merchant",rappId:"wushangTemplate",pageId:"2016xbsy"},function(result){
                        var wsh = result.pageData.wsh;
                        var list=$(".wsh_plist li");
                        $.each(wsh ,function(index,value){
                           list.eq(index).find(".price em").html(value.memberPrice);
                        });
                    },'json');
                    clearInterval(timer);
                }
            }, 1000);
        }
    }

});
