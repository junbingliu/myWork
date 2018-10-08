$(document).ready(function(){
    $('#hook').hook({
        reloadPage: false,
        textRequired:true,
        loaderText:"数据加载中...",
        reloadEl: function(){
            homePage.load("/mobile/index.jsp","homePage");
        }
    });
    $(function()
    {

        bidAdvImgs = $("#touchSwipeBigAdv ul li");
        var IMG_WIDTH = 320,
            currentImg=0,
            maxImages=bidAdvImgs.length;
        speed=500,
        bidAdvImgs.swipe( {
            triggerOnTouchEnd : true,
            swipeStatus : swipeStatus,
            allowPageScroll:"vertical",
            click:function(){
                var href=$(this).attr("data-src");
                if(href){
                    location.href=href;
                }else{
                    return;
                }
            }
        });
        var self=this;

        function swipeStatus(event, phase, direction, distance, fingers)
        {
            if( phase=="move" && (direction=="left" || direction=="right") )
            {
                var duration=0;
                if (direction == "left")
                    scrollImages((IMG_WIDTH * currentImg) + distance, duration);

                else if (direction == "right")
                    scrollImages((IMG_WIDTH * currentImg) - distance, duration);
//                clearInterval(self.as);
            }

            else if ( phase == "cancel")
            {

                scrollImages(IMG_WIDTH * currentImg, speed);
            }

            else if ( phase =="end" )
            {
                if (direction == "right")
                    previousImage()
                else if (direction == "left")
                    nextImage()


//                    setInterval(self.autoScroll,5000);


            }

        }

        function previousImage()
        {
            currentImg = Math.max(currentImg-1, 0);
            scrollImages( IMG_WIDTH * currentImg, speed);
        }

        function nextImage()
        {
            currentImg = Math.min(currentImg+1, maxImages-1);
            scrollImages( IMG_WIDTH * currentImg, speed);
        }


        function scrollImages(distance, duration)
        {
            bidAdvImgs.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");

            var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();

            bidAdvImgs.css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
        }
        self.autoScroll=function(){
            if(currentImg==maxImages-1){
                currentImg=-1;
            }
            nextImage();
        }
//        if(!self.as){
//            console.log("执行了好多次");
//            self.as=setInterval(self.autoScroll,5000);
//        }

    });
})
