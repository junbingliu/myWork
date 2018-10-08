$(function () {


    var greyImg = $("#greyImg").attr("src");
    $("img[original]").lazyload({
        placeholder:greyImg,
        failurelimit: 10,
        effect: "fadeIn",
        threshold : 200
    });


    if(true){
        $("[data-type='tabsPlus']").each(function (index,domEle) {
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
                $("#" + target).show();
            });
            /*只显示cur Tab对应的内容*/
            $("[tab-target]",$(domEle)).each(function(i,ele){
                var t = $(ele).attr("tab-target");
                var isCur = $(ele).hasClass("cur");
                if(!isCur){
                    $("#" + t).hide();
                } else{
                    $("#" + t).show();
                }

            });
        });
    }


    $(".floorMain .timer").each(function(index,obj){
        handlePriceTimer($(obj));
    });
});
var handlePriceTimer = function(timerBlock){
    if(timerBlock && timerBlock.length > 0 ){
        if(timerBlock.attr("begin") !="" && timerBlock.attr("end") !=""){
            if(timerBlock.attr("interval")){
                clearInterval(Number(timerBlock.attr("interval")));
            }
            var opt = $("p",timerBlock),nMS,textMsg,curTime,beginTime = parseInt(timerBlock.attr("begin")),endTime = parseInt(timerBlock.attr("end"));
            var setIntv = setInterval(function (){
                curTime = new Date().getTime();
                if(curTime < beginTime){
                    //未开始
                    nMS = beginTime - curTime;
                    textMsg = "离开始";
                }else if(curTime < endTime){
                    //未结束
                    nMS = endTime - curTime;
                    textMsg = "剩余";
                }else{
                    //已结束
                    textMsg = "已结束";
                    clearInterval(setIntv);
                    timerBlock.hide();
                }

                var nD = (Math.floor(nMS / (1000 * 60 * 60 * 24))) ;
                var nH = (Math.floor(nMS / (1000 * 60 * 60)) % 24) % 60;
                //定义获得小时
                var nM = (Math.floor(nMS / (1000 * 60)) % 60) % 60;
                //定义获得分钟
                var nS = (Math.floor(nMS / 1000) % 60) % 60;
                //定义获得秒

                var text = "";
                if(nD > 0){
                    text = textMsg + nD + "天" + nH + "时" + nM + "分" + nS + "秒";
                }else{
                    text = textMsg + nH + "时" + nM + "分" + nS + "秒";
                }

                opt.html("<i></i>" +text);
                if(!opt.is(":visible")){
                    opt.show();
                }


                nMS -= 1000;

                if (nH == 0 && nM == 0 && nS == 0) {
                    clearInterval(setIntv);
                    //opt.callback(that);
                }
            }, 1000);
            timerBlock.attr("interval",setIntv)
        }
    }



}