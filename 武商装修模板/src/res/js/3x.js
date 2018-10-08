$(document).ready(function () {

    $(".oth_limit .time span,.jsjjproductliTtime .time span,.jaqproductliTtime .time span,.Ttime .time span").each(function(){
        var self = $(this);
        var maxtime = self.attr("data-end");
		//maxtime = Date.parse(maxtime.replace(/-/g,'/'));
        var timestamp = Date.parse(new Date()) / 1000;
        maxtime = maxtime / 1000 - timestamp;
        var timer = setInterval(function () {
            if (maxtime >= 0) {
                d = Math.floor(maxtime / 86400),
                    h = Math.floor((maxtime % 86400) / 3600),
                    m = Math.floor(((maxtime % 86400) % 3600) / 60),
                    s = Math.floor(((maxtime % 86400) % 3600) % 60);
                msg = d + "天" + h + "小时" + m + "分钟" + s + "秒" ;
                self.html(msg);
                --maxtime;
            }
            else {
                clearInterval(timer);
                self.html("已结束!");
            }
        }, 1000);
    });
	
	$(".nextIssue .time span").each(function(){
        var self = $(this);
        var maxtime = self.attr("data-end");
		//maxtime = Date.parse(maxtime.replace(/-/g,'/'));
		var url = "http://www.wushang.com/phone_page/sales/getCurrDate.jsp";
        $.post(url,function(result){
            var nowDateSec = parseInt(result);
            var timestamp = nowDateSec / 1000;
			maxtime = Date.parse(maxtime) / 1000 - timestamp;
			var timer = setInterval(function () {
				if (maxtime >= 0) {
					var h = Math.floor(maxtime / 3600),
						m = Math.floor(((maxtime % 86400) % 3600) / 60),
						s = Math.floor(((maxtime % 86400) % 3600) % 60);
	                if(h<10){
						h = "0"+ h;
					}
					if(m<10){
						m = "0"+ m;
					}
					if(s<10){
						s = "0" + s;
					}
					var msg = h + ":" + m + ":" + s;
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

    $(".nextIssuee .time span").each(function(){
        var self = $(this);
        var maxtime = self.attr("data-end");
		//maxtime = Date.parse(maxtime.replace(/-/g,'/'));
		var url = "http://www.wushang.com/wushangTemplate/serverHandlers/getDateForCross.jsx";
        $.ajax({ 
        	url:url,
        	type:"get",
        	dataType: "jsonp",
            jsonp:"jsonpcallback",
            success:function(result){ 
				var nowDateSec = parseInt(result);
	            var timestamp = nowDateSec / 1000;
				maxtime = Date.parse(maxtime) / 1000 - timestamp;
				var timer = setInterval(function () {
					if (maxtime >= 0) {
						var h = Math.floor(maxtime / 3600),
							m = Math.floor(((maxtime % 86400) % 3600) / 60),
							s = Math.floor(((maxtime % 86400) % 3600) % 60);
		
						if(h<10){
							h = "0"+ h;
						}
						if(m<10){
							m = "0"+ m;
						}
						if(s<10){
							s = "0" + s;
						}
						var msg = h + ":" + m + ":" + s;
						self.html(msg);
						--maxtime;
					}
					else {
						clearInterval(timer);
						self.html("已结束!");
					}
				}, 1000);
            },
            error:function(){ 
            	console.log("ajax error");
            }
        });
        
    });
	
	
});

$(document).ready(function () {
    /*团购-特惠团点击滑动*/
    var mC = $('.wslfwbox .mc');
    var prev = $('.mc-prev');
    var next = $('.mc-next');
    var sBox = $('.scrollbox');
    var sBoxUl = sBox.find('ul');
    var liW = sBoxUl.find('li').outerWidth();
    var liLen = sBoxUl.find('li').length;
    var ulW = liW*(liLen+4);
    var int = Math.ceil(liLen/4);
    var index = 0;

    sBoxUl.css({width:ulW});

    mC.hover(function(){
        prev.fadeIn(200);
        next.fadeIn(200);
    },function(){
        prev.fadeOut(200);
        next.fadeOut(200);
    });

    next.unbind('click').click(function(){
        index++;
        if(index >= int){
            index = (int-1);
            return;
        }else{
            sBoxUl.stop(true,false).animate({left:-(liW*4)*index},500);
        }

    });

    prev.unbind('click').click(function(){
        index--;
        if(index < 0){
            index=0;
            return;
        }else{
            sBoxUl.stop(true,false).animate({left:-(liW*4)*index},500);
        }
    });

});