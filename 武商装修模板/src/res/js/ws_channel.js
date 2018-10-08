$(document).ready(function () {
    var totalRecord =parseInt($("#totalRecord").val());
    var pathname=location.href;
    String.prototype.getQueryString = function(name)
    {
        var reg = new RegExp("(^|&|\\?)"+ name +"=([^&]*)(&|$)"), r;
        if (r=this.match(reg)) return unescape(r[2]);
        return null;
    };
    var currentPage = location.search.getQueryString("page");

    jumpPage(totalRecord,15,currentPage);
    try {
        var rightarray = new Array();
        var l = 0;
        var len = jQuery("#scrollbox li").length;
        var t = 73 * len;
        var group = len / 4;
        var m = 0;
        var mod = len % 1;
        for (var i = 0; i < group; i++) {
            if (i == 0) {
                rightarray[i] = 0;
                var total = 860;
            } else {
                total = total + 860;
                if (total > t) {
                    if (len % 1 == 0) {
                        rightarray[i] = 860 * i;
                    }
                    else {
                        rightarray[i] = 860 * i;
                    }

                } else {
                    rightarray[i] = 860 * i;
                }
            }

        }
        jQuery(".icon_right").click(function () {
            m++;
            if (m >= group) {
                m = 0;
            }
            if (m == 0) {
                $("#scrollbox").stop();
                jQuery("#scrollbox").animate({left:0}, 500);
                jQuery("#scrollul").css("left", "0");
            } else {
                jQuery("#scrollbox").animate({left:-rightarray[m]}, 500, function () {
                });
            }
        });
        jQuery(".icon_left").click(function () {
            var position = jQuery("#scrollbox").position();
            if ((position.left) < 0) {
                m--;
                jQuery("#scrollbox").animate({left:-rightarray[m]}, 500);
            } else {
                m = 0;
                jQuery("#scrollbox").animate({left:0}, 500, function () {
                    jQuery("#scrollul").css("left", "0");
                });
            }
        });
    } catch (e) {
        alert(e.description)
    }

});

$(window).bind("scroll", function () {
    var sTop = $(document).scrollTop();
    var top=$(".subCate").parent().offset().top;
    if(sTop>top){
        $(".subCate").addClass("fixed-top");
    }else{
        $(".subCate").removeClass("fixed-top");
    }
});


function jumpPage(total,pageSize,currentPage){
    page(total,pageSize,currentPage);
    goPage(total,pageSize,currentPage);
    if(isNaN(currentPage)||currentPage==null){
        $("#inputPage").val(1)
    } else{
        $("#inputPage").val(currentPage)
    }
}

function goPage(totalRecord,pageSize,currentPage){
    var pageNum = parseInt((totalRecord + pageSize - 1) / pageSize);
    $(".goToPage").click(function(){
        var page= parseInt($("#inputPage").val());
        if(page==currentPage||page>pageNum||isNaN(page)){
            return;
        }
        location.href = "/panic/groupBuy.jsp?page=" + page;

    })
}
function page(totalRecord, pageSize,currentpage) {
    var pageNum = parseInt((totalRecord + pageSize - 1) / pageSize);
    if (currentpage == null || currentpage == "" || currentpage == 0||isNaN(currentpage)) {
        currentpage = 1;
    }
    currentpage = parseInt(currentpage);
    if(currentpage<=pageNum) {
        var html = {};
        var next = 0;
        var list = "";
        for (var i = 0; i < pageNum; i++) {
            next = i * pageSize;
            if(currentpage==(i+1)){
                html[i] = '<li><a id="href_' + i + '" class="p nowPage">' + (i + 1) + '</a></li>';
            }else{
                html[i] = '<li><a id="href_' + i + '" class="p everyPage" href="/panic/groupBuy.jsp?page=' + (i + 1) + '">' + (i + 1) + '</a></li>';
            }

        }

        var nextPage = '<li><a id="nextPage" title="下一页" class="downPage" href="/panic/groupBuy.jsp?page=' + (currentpage + 1) + '"></a></li>';
        var prePage = '<li><a id="prePage" title="上一页" class="upPage" href="/panic/groupBuy.jsp?page=' + (currentpage - 1) + '"></a></li>';
        var button = '<li>&nbsp;&nbsp;到第&nbsp;<input value="1" id="inputPage">&nbsp;页</li>' +
            '<li><a class="goToPage" href="javascript:;" ></a></li>';
        if (currentpage == 1) {
            prePage = '<li><a id="prePage" title="目前已是第一页" class="upPage"></a></li>';
        }
        if (currentpage >= pageNum) {
            nextPage = '<li><a id="nextPage" title="目前已是最后一页" class="downPage"></a></li>';
        }
        list = prePage + getPage(currentpage,html,10,pageNum) + nextPage+button;
        if(pageNum>0){
            $("#pageList").html(list);
        }
    }

}

function getPage(cur, data, count, dataList) {
    var html = "";
    var start;
    var end;
    var empty = '<li>...&nbsp;</li>';
    if(cur<6){
        cur=1;
        start = (cur-1) * count;
        end = cur * count;
    }else{
        start = cur-5;
        end = cur+4;
        if(end>=dataList){
            end=dataList;
            start = end-9;
        }

    }
    if (end > dataList) {
        end = dataList;
    }
    for (var i = start; i < end; i++) {
        html += data[i];
    }
    if(cur>=6){
        html=data[0]+empty+html;
    }
    return html;
}



