
/*弹出窗活动广告*/
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



$(document).ready(function () {
    $("#slideAdv_rightContent li").each(function () {
        $(this).mouseover(
            function () {
                $("#slideAdv_rightContent li").removeClass("cur");
                $(this).addClass("cur");
            });
    });

    $("#ranking li").each(function () {
        $(this).mouseover(
            function () {
                $("#ranking li").removeClass("cur");
                $(this).addClass("cur");
            });
    });
	
	 /*弹出窗活动广告*/
    popAd();
});