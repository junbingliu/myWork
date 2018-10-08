/*图片滚动小插件*/
(function ($) {
    $.fn.myScroll = function (options) {//options 经常用这个表示有许多个参数。
        var defaultVal = {
            ScrollTime: 500,
            DelayTime:3000,
            Autoplay:true
        };
        var opts = $.extend(defaultVal, options);
        return this.each(function () {
            var selObject = $(this);//获取当前对象
            var picBox = selObject.find('.pic');
            var checkBox = selObject.find('.num');
            var sWidth = picBox.find("ul li").width();
            var len = picBox.find("ul li").length;
            var index = 0;
            var Auto = opts.Autoplay;
            var picTimer;

            picBox.find("ul").css("width",sWidth * (len + 1));

            if(picBox.find('li').length <= 1){
                Auto = false;
            }

            if(Auto){
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

        });
    }
})(jQuery);

/*页面加载*/
$(document).ready(function () {
    /*团购-特惠团点击滑动*/
    var mC = $('.mc');
    var prev = $('.mc-prev');
    var next = $('.mc-next');
    var sBox = $('.scrollbox');
    var sBoxUl = sBox.find('ul');
    var liW = sBoxUl.find('li').outerWidth()+8;
    var liLen = sBoxUl.find('li').length;
    var ulW = liW*(liLen+4);
    var int = Math.ceil(liLen/4);
    var index = 0;

    sBoxUl.css({width:ulW});

    mC.hover(function(){
        prev.fadeIn(200);
        next.fadeIn(200);
    },function(){
        prev.fadeOut(200);
        next.fadeOut(200);
    });

    next.unbind('click').click(function(){
        index++;
        if(index >= int){
            index = (int-1);
            return;
        }else{
            sBoxUl.stop(true,false).animate({left:-(liW*4)*index},500);
        }

    });

    prev.unbind('click').click(function(){
        index--;
        if(index < 0){
            index=0;
            return;
        }else{
            sBoxUl.stop(true,false).animate({left:-(liW*4)*index},500);
        }
    });

    /*团购-banner轮播*/
    $('.tuan-banner').myScroll({DelayTime:5000});

    $('.slide_banner').myScroll({DelayTime:5000});

});











