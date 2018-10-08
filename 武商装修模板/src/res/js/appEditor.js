$(document).ready(function(){
    /*tabs begin*/
    $("[data-type='tabs']").each(function (index,domEle) {
        $("[tab-target]",$(domEle)).mouseenter(function(){
            $("[tab-target]",$(domEle)).removeClass("cur");
            $(this).addClass("cur");
            /*将tab-target对应的内容隐藏*/
            var target = $(this).attr("tab-target");
            $("[tab-target]",$(domEle)).each(function(i,ele){
                var t = $(ele).attr("tab-target");
                $("#" + t).hide();
            });
            /*然后再显示出来*/
            $("#" + target).fadeIn(100);
        });
        /*只显示cur Tab对应的内容*/
        $("[tab-target]",$(domEle)).each(function(i,ele){
            var t = $(ele).attr("tab-target");
            var isCur = $(ele).hasClass("cur");
            if(!isCur){
                $("#" + t).hide();
            }
            else{
                $("#" + t).show();
            }

        });
    });
    /*tabs end*/

    /*fancy category begin*/
    $(".item > .sortLayer").hide();
    $(".item").mouseenter(function(){
        $(".sortLayer",this).fadeIn(300);
    }).mouseleave(function(){
        $(".sortLayer",this).hide();
    });




    /*mallCategory end */
});