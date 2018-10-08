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

  /*  $(".floor_img a.floorPro_img").mouseenter(function(){
        $(this).animate({"margin-left":"-30px", "text-decoration":"none"},"slow");
    }).mouseleave(function(){
            $(this).animate({"margin-left":"120px", "text-decoration":"none"},"slow");
        })*/
    var shouldShow=$(".mallCategory").attr("categoryShow");
    if(!shouldShow || shouldShow!='T'){
        $(".mallSort .sort").attr("style","display:none");
        $(".mallSort").mouseover(function(){
            $(".mallSort .sort").attr("style","display:block");
            $(".mallSort").children(".sort").children(".item").mouseover(
                function () {
                    $(this).children(".sortLayer").attr("style", "display:block");
                    $(this).addClass("itemCur");
                }).mouseout(function (e) {
                    $(this).children(".sortLayer").attr("style", "display:none");
                    $(this).removeClass("itemCur");
                });

        }).mouseout(function(e){
                $(".mallSort .sort").attr("style", "display:none");
            })
    }else{
        $(".mallSort").children(".sort").children(".item").mouseover(
            function () {
                $(this).children(".sortLayer").attr("style", "display:block");
                $(this).addClass("itemCur");
            }).mouseout(function (e) {
//                console.log(window.location.hash)
                $(this).children(".sortLayer").attr("style", "display:none");
                $(this).removeClass("itemCur");
            });
    }
    /*自动轮播*/
    var autoScroll=setInterval(setCur,6000);

    $(".slide_adv,#pic").mouseenter(function(){
        clearInterval(autoScroll);
    }).mouseleave(function(){
            autoScroll=setInterval(setCur,6000);
        })
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

});