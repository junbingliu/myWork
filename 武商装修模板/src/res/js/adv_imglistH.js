
$(function(){
    var id = function(el) {return document.getElementById(el)};
    var logoimglist = id('photo-list');
    var speed = 50;
    if(logoimglist) {
        var ul = id('scroll');
        var lis = ul.getElementsByTagName('li');
        var itemCount = lis.length;
        var width = lis[0].offsetWidth;
        marquee = function () {
            logoimglist.scrollLeft += 2;
            if (logoimglist.scrollLeft % width <= 1) {
                ul.appendChild(ul.getElementsByTagName('li')[0]);
                logoimglist.scrollLeft = 0;
            };
        };
    };


    ul.style.width = width*itemCount + 'px';

    var timer = setInterval(marquee, speed);
    logoimglist.onmouseover = function() {clearInterval(timer)};
    logoimglist.onmouseout = function() { timer = setInterval(marquee, speed)};
});
