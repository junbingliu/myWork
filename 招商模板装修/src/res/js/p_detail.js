/**
 * Created by Administrator on 2016/3/18.
 */
$(function(){
    //商品分类
    $('.listCon .subMenu li').hover(function(){
        $(this).stop().animate({"padding-left":"32px"},300);
    },function(){
        $(this).stop().animate({"padding-left":"18px"},300);
    })

    //flash
    $('.vf4').unslider({
        speed: 500,
        delay: 3000,
        dots: true,
        fluid: false,
    });

    var greyImg = $("#greyImg").attr("src");
    $("img[original]").lazyload({
        placeholder:greyImg,
        failurelimit: 10,
        effect: "fadeIn",
        threshold : 200
    });
})