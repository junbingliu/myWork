$(document).ready(function(){
    function init(){
        $.post("/InDoorNavigation/server/front/getBuildings.jsx",{spec:"920X548"},function(data){
            for(var i=0;i<data.length;i++){
                if(data[i].description){
                    var buildingHtml='<li data-id="'+data[i].id+'" style="cursor: pointer" data-imgUrl="'+data[i].imgUrl+'"><h3><i class="i'+(i+1)+'"></i><a>'+data[i].name+'</a></h3><div class="floorLayer" style="display: none"><p>'+data[i].description+'</p></div></li>'
                }else{
                    var buildingHtml='<li data-id="'+data[i].id+'" style="cursor: pointer" data-imgUrl="'+data[i].imgUrl+'"><h3><i class="i'+(i+1)+'"></i><a>'+data[i].name+'</a></h3></li>'
                }
                if(i==0){
                    if(data[i].description){
                        buildingHtml='<li data-id="'+data[i].id+'" style="cursor: pointer" class="cur" data-imgUrl="'+data[i].imgUrl+'"><h3><i class="i'+(i+1)+'"></i><a>'+data[i].name+'</a></h3><div class="floorLayer" style="display: none"><p>'+data[i].description+'</p></div></li>'
                    }else{
                        buildingHtml='<li data-id="'+data[i].id+'" style="cursor: pointer" class="cur" data-imgUrl="'+data[i].imgUrl+'"><h3><i class="i'+(i+1)+'"></i><a>'+data[i].name+'</a></h3></li>'
                    }
                    $(".f_map img").attr({src: data[i].imgUrl});
                    getfloor(data[i].id);
                }
                $("#buildingList").append(buildingHtml);
            }
            $("#buildingList li").mouseenter(function(){
                $("#buildingList li").removeClass("cur");
                $(this).addClass("cur");
                $(this).find(".floorLayer").show();
            }).mouseleave(function(){
                    $(this).find(".floorLayer").hide();
                }).click(function(){
                    var building=$(this).attr("data-id");
                    var imgUrl=$(this).attr("data-imgUrl");
                    $(".f_map img").attr({ src: imgUrl});
                    $("#current").val("1");
                    getfloor(building);
                })

        },"json")
    }
    function getfloor(buildingId){
        var previousName="上一页";
        var nextName="下一页" ;
        var previous='<a id="previous" class="every">'+previousName+'</a>';
        var next='<a id="next" class="every">'+nextName+'</a>';
        var list="";
        var pageSize = 7;
        var current =parseInt($("#current").val());
        $.post("/InDoorNavigation/server/front/getFloors.jsx",{spec:"800X733",buildingId:buildingId},function(data){
            var floorHtml="";
            var floorHtml2=[];
            var Num =parseInt((data.length-1)/7)+1;
            for(var i=0;i<data.length;i++){
                if(i<7){
                    floorHtml+='<li data-index='+i+' data-imgUrl="'+data[i].imgUrl+'" data-id="'+data[i].id+'">'+data[i].name+'</li>';
                }
                if(i==0){
                    floorHtml2[0]='<a data-index='+i+' data-imgUrl="'+data[i].imgUrl+'" data-id="'+data[i].id+'" class="every cur">'+data[i].name+'</a>';
                    $(".stImg img").attr({ src: data[i].imgUrl});
                    if(data[i].showMap){
                        var map = new BMap.Map("allmap");
                        map.centerAndZoom("武汉",18);
                        map.addControl(new BMap.NavigationControl());
                        var local = new BMap.LocalSearch(map, {
                            renderOptions:{map: map}
                        });
                        var searchString=data[0].address;
                        local.search(searchString);
                        $("#allmap").show();
                        $(".stImg").hide();
                    }else{
                        $("#allmap").hide();
                        $(".stImg").show();
                    }
                    setMerchant(data[0].merchantList,data[i].showMap)
                }else{
                    floorHtml2[i]='<a data-index='+i+' data-imgUrl="'+data[i].imgUrl+'" data-id="'+data[i].id+'" class="every">'+data[i].name+'</a>';
                }
            }
            if(data.length<pageSize){
                pageSize = data.length;
                list = getPage(current,floorHtml2,pageSize,data.length);
            }else{
                if(current==1){
                    list = getPage(current,floorHtml2,pageSize,data.length)+next;
                }else{
                    if(current*pageSize>data.length){
                        list = previous+ getPage(current,floorHtml2,pageSize,data.length);
                    }else{
                        list = previous+ getPage(current,floorHtml2,pageSize,data.length)+next;
                    }
                }
            }
            $(".tool .page").html(list);
            $(".f_map .numbox").html(floorHtml);

            $("#next").click(function(){
                current =current+1;
                if(current>Num){
                    current =Num;
                }
                if(current*pageSize>data.length){
                    pageSize=data.length;
                }
                list = previous+ getPage(current,floorHtml2,pageSize,data.length)+next;
                $("#current").val(current);
                $(".tool .page").html(list);
                getfloor(buildingId)
            })
            $("#previous").click(function(){
                current = current-1;
                if(current<1){
                    current = 1;
                }
                list = previous+ getPage(current,floorHtml2,pageSize,data.length)+next;
                $("#current").val(current);
                $(".tool .page").html(list);
                getfloor(buildingId)
            })

            $(".f_map .numbox li").click(function(){
                $('body,html').animate({scrollTop:1030},1000);
                var id=$(this).attr("data-id");
                $.each($(".tool .page a"), function(i, n){
                    var floorId=$(n).attr("data-id");
                    if(id==floorId){
                        $(n).trigger("click");
                    }
                });
            })
            $(".tool .page a").bind("click",function(){
                var index=$(this).attr("data-index");
                if(index){
                if(data[index].showMap){
                    // 百度地图API功能
                    var map = new BMap.Map("allmap");
                    map.centerAndZoom("武汉",18);
                    map.addControl(new BMap.NavigationControl());

                    var local = new BMap.LocalSearch(map, {
                        renderOptions:{map: map}
                    });
                    var searchString=data[index].address;
                    local.search(searchString);
                    $("#allmap").show();
                    $(".stImg").hide();
                }else{
                    $("#allmap").hide();
                    $(".stImg").show();
                    var imgUrl=data[index].imgUrl;
                    $(".stImg img").attr({ src: imgUrl});
                }
                $(".tool .page a").removeClass("cur");
                $(this).addClass("cur");
                setMerchant(data[index].merchantList,data[index].showMap)
                }
            })
            function setMerchant(merchantList,showMap){
                var merchantHtml="";
                for(var i=0;i<merchantList.length;i++){
                    var shortDesc=merchantList[i].shortDesc;
                    if(!shortDesc){
                        shortDesc="";
                    }
                    if(!showMap){
                        merchantHtml+='<li><div><img src="'+merchantList[i].logoUrl+'"></div><h2 style="position: absolute;bottom: 5px">'+merchantList[i].name+'</h2>'+shortDesc+'<div class="btns"><a target="_blank" href="/merchantDetail.html?id='+merchantList[i].id+'" class="bt1">品牌详情</a></div></li>';
                        $(".tabs a").html("品牌故事")
                    }else{
                        merchantHtml+='<li><div><img src="'+merchantList[i].logoUrl+'"></div><h2 style="position: absolute;bottom: 5px">'+merchantList[i].name+'</h2>'+shortDesc+'</li>';
                        $(".tabs a").html("量贩门店")
                    }
                }
                $(".stAll ul").html(merchantHtml);
                $(".stInfo ul li").mouseenter(function(){
                    $(".stInfo ul li").removeClass("cur");
                    $(this).addClass("cur");
                })
            }
        },"json");

        function getPage(cur,data,count,dataList){
            var html="";
            var start=(cur-1)*count;
            var end=cur*count;
            if(end>dataList){
                end =dataList;
            }
            for(var i=start;i<end;i++){
                html+=data[i];
            }
            return html;
        }
    }
    init();

})