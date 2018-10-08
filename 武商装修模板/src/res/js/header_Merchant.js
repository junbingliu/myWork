$(document).ready(function () {

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
//    backToTop();

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

});
