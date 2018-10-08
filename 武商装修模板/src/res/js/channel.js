$(document).ready(function () {
    $(".shop_top li").each(function () {
        $(this).mouseover(
            function () {
                $(".shop_top li").removeClass("cur");
                $(this).addClass("cur");
            });
    });
    $("#channel_prolist li").each(function () {
        $(this).mouseover(
            function () {
                $("#channel_prolist li").removeClass("cur");
                $(this).addClass("cur");
            });
    });


        $(".catelist li").mouseover(
            function () {
                $(this).children(".layer_class").attr("style", "display:block");
                $(this).addClass("cur");
            }).mouseout(function (e) {
                $(this).children(".layer_class").attr("style", "display:none");
                $(this).removeClass("cur");
            });
})