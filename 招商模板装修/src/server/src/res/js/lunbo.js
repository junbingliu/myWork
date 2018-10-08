/**
 * Created by 207 on 2015/10/8.
 */
$(document).ready(function () {
    var time = 0;
    var i = 0;

    var $slide_adv = $('.focus');
    var $focus_dot = $slide_adv.find('.focus_num li');
    var $focus_pic = $slide_adv.find('.focus_pic a');
    var count = $focus_dot.size();

//自动轮播
    function auto() {
        time = setInterval(function () {
            i++;
            if (i >= count) {
                i = 0;
            }
            $focus_dot.eq(i).addClass('cur').siblings().removeClass('cur');
            $focus_pic.eq(i).fadeIn(800).siblings().fadeOut(800);
        }, 3000)

    }

    auto();

//手动播放
    $focus_dot.hover(function () {
        clearInterval(time)

        $(this).addClass('cur').siblings().removeClass('cur');
        var index = $focus_dot.index(this);
        $focus_pic.eq(index).fadeIn(800).siblings().fadeOut(800);

        i = index
    }, function () {
        auto();
    })

    $(".clearfix li").mouseenter(function(){
        $(this).addClass("cur");
    }).mouseleave(function(){
        $(this).removeClass("cur");
    });

});