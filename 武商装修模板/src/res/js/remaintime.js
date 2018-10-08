$(document).ready(function () {

    $(".oth_limit .time span").each(function(){
        var self = $(this);
        var maxtime = self.attr("data-end");
        var timestamp = Date.parse(new Date()) / 1000;
        maxtime = maxtime / 1000 - timestamp;
        var timer = setInterval(function () {
            if (maxtime >= 0) {
                d = Math.floor(maxtime / 86400),
                    h = Math.floor((maxtime % 86400) / 3600),
                    m = Math.floor(((maxtime % 86400) % 3600) / 60),
                    s = Math.floor(((maxtime % 86400) % 3600) % 60);
                msg = d + "：" + h + "：" + m + "：" + s;
                self.html(msg);
                --maxtime;
            }
            else {
                clearInterval(timer);
                self.html("已结束!");
            }
        }, 1000);
    });
});