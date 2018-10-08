
function builtMultiUrl(key,value){
    var location = document.location;
    var path = location.pathname;
    var search = location.search;
    if(search && search != ""){
        var queryStr = "?";
        search = search.substring(1);
        var hasKey = search.indexOf(key+"=") > -1 ? true : false;
        var splitAnd = search.split("&");
        for(var i=0;i<splitAnd.length;i++){
            var splitEq = splitAnd[i].split("=");
            if(splitEq[0] == key){
                queryStr += key + "=" + value;
            }else{
                queryStr += splitEq[0] + "=" + splitEq[1];
            }
            if(i<splitAnd.length-1){
                queryStr += "&";
            }
        }
        if(!hasKey){
            queryStr += "&" + key + "=" + value;
        }
        return path + queryStr;
    }
    return path;
}

function handleAddToCart(){
    var initconfigs = {
        getAttrsUrl: "/appMarket/appEditor/getProductAttrs.jsp",
        completeUrl: "/shopping/handle/v3/do_buy.jsp",
        attr_container: ".attrBox",
        loadAfterEvent: {
            fireEvent: function (cxt) {
                doLoadAfterEvent(cxt);
            }
        },
        completeAfterEvent: {
            fireEvent: function (cxt) {
//                layer.close(skuLayer);
                var tips = '加入购物车<span class="floatTips'+ (!cxt.state ? ' error' : '') +'">' + cxt.msg + '<i></i></span>';
                cxt.target.html(tips);
                var timer = 0;
                clearTimeout(timer);
                var tipsObj = $(".floatTips",cxt.target);
                tipsObj.fadeIn();
                var timer = setTimeout(function (){
                    tipsObj.fadeOut();
                }, 1000);

                tipsObj.mouseover(function (){
                    clearTimeout(timer);
                });

                tipsObj.mouseout(function (){
                    timer = setTimeout(function (){
                        tipsObj.fadeOut();
                    }, 1000);
                });

            }
        }
    };

    function doLoadAfterEvent(cxt) {
        if (!skuSelector) {
            return;
        }
        document.location.href = cxt.target.attr("href");
    }

    var skuSelector = new $.SkuSelector(initconfigs);
    $("#page_content").on("click",".btn-buy",function(){
        var curObj = $(this),pid = curObj.attr("pid");
        var config = {productId:pid,target:curObj};
        skuSelector.load(config);
        return false;
    });
}

$(function () {
    // side Menu
    function sideMenu(){
        $('.nav_list .title2').click(function (){
            $(this).next('.list').toggleClass('active').siblings('.list').removeClass('active');
            $(this).toggleClass('active').siblings('.title2').removeClass('active');
        });
    }
    sideMenu();

    // conditional filter
    function conditionalFilter(){
        // multi select switch
        $('.multiSelect').click(function (){
            // clear status
            $(this).parents('.filter-row').find('.condition-listContent li').removeClass('active');

            $('.filter-row .all').addClass('active');

            $(this).toggleClass('active').parents('.filter-conditional')
                .find('.condition-wrap').toggleClass('active');
        });

        // brand select cancel
        $('.cancelBtn').click(function (){
            $('.filter-row *').removeClass('active');
            $('.filter-row .all').addClass('active');
        });

        // bind condition item
        var parent = $('.filter-conditional');

        parent.find('.condition-list li').click(function (){
            var that = $(this);

            if (that.index() == 0){
                // if  checked 'all'
                that.addClass('active')
                    .siblings().removeClass('active');
            } else {

                // check multi select status
                // multi select model
                if (that.parents('.condition-list').siblings('.multiSelect').hasClass('active')){
                    // is selectAll now
                    if (that.siblings('.all').hasClass('active')) {
                        that.siblings('.all').removeClass('active');
                        that.toggleClass('active');
                    } else {
                        that.toggleClass('active');

                        // if only self has active
                        if (that.parents('.condition-wrap').find('li.active').length == 0) {
                            that.siblings('.all').addClass('active');
                        } else {
                        }
                    }
                } else {
                    // single select model
                    that.toggleClass('active')
                        .siblings().removeClass('active');

                    // if only self has active
                    if (that.parents('.condition-list').find('li.active').length == 0) {
                        that.siblings('.all').addClass('active');
                    } else {
                    }
                }

                var curParent = that.parent();
                if(curParent.is("[isBrand='true']")){
                    var selectBrandIds = $("li.active",curParent).find("input:hidden").map(function(){
                        return $(this).val();
                    }).get().join(",");

                    $(".btnPrimary",parent).attr("href",builtMultiUrl("brands",selectBrandIds));

                }




            }
        });

        // slide more filter
        var moreAttrBtnObj = $('.filter-more');
        var backToggleStr = "";
        if(moreAttrBtnObj && moreAttrBtnObj.length > 0){
            backToggleStr = moreAttrBtnObj.find("p").html();
            moreAttrBtnObj.click(function (){
                if($(this).is(".active")){
                    $('.filterMod .filter-row:gt(3)').hide();
                    $(this).removeClass("active").find("p").html(backToggleStr)
                }else{
                    $('.filterMod .filter-row').show();
                    $(this).addClass("active").find("p").html("收起<i></i>")
                }
//            $(this).toggleClass('active');
            });
        }

    }
    conditionalFilter();

    (function(){
        $(".filterMod-bd").on("click",".showMore",function(){
            var contentList = $(".condition-listContent");
            var bash = ["&#x2748;", "&#x2749;"],ico = $(this).find(".ico")
            if(contentList.hasClass("show")){
                contentList.removeClass("show");
                ico.addClass("animate");
                setTimeout(function () {
                    ico.removeClass("animate").html(bash[0]);
                }, 500);
            }else{
                contentList.addClass("show");
                ico.addClass("animate");
                setTimeout(function () {
                    ico.removeClass("animate").html(bash[1]);
                }, 500);
            }
        });
    })();


    // product filter
    function productFilter(){
        $('.filter_nav .item').click(function (){
            $('.filter_nav .item').removeClass('active');
            $(this).addClass('active').toggleClass('toggle')
                .siblings('.item').removeClass('toggle');
        });
    }
//    productFilter();

    $(".filterMod-bd").on("click",".condition-wrap.active a.condition-link",function(){
        return false;
    });

    handleAddToCart();

    var productObjs = $(".product_list li");
    if(productObjs && productObjs.length > 0){
        var jsonParam = {};
        var ids = "";
        productObjs.each(function(index){
            var self = $(this);
            var mid = self.attr("mid");
            var objId = self.attr("objId");
            if(!jsonParam[mid]){
                jsonParam[mid] = [];
            }
            jsonParam[mid].push(objId);
        });

        $.get(rappId + "/serverHandler/matchProductsRules.jsx",{jsonString:JSON.stringify(jsonParam),t:Math.random()},function(resp){
            if(resp.state){
                var jsonData = resp.data;
                productObjs.each(function(){
                    var self = $(this);
                    var objId = self.attr("objId");
                    var labelList = jsonData[objId];
                    var targetObj = $(".details .price",self);
                    var html = "";
                    var classArray = ["group","down","free","rush"];
                    if(labelList && labelList.length > 0){
                        for(var i=0;i<labelList.length;i++){
                            if(i > 1){
                                if($("s",targetObj).length > 0){
                                    break;
                                }
                            }
                            html += '<em class="' + classArray[i] + '">' + labelList[i] + '</em>';
                        }
                    }
                    $(".details .price",self).append(html);
                });
            }
        },"json");
    }

    if(true){

        $('#stockBtn').click(function (){
            var hasStock = false;
            if ($(this).find('i.active').length == 0) {
                $(this).find('i.active').addClass('active');
                hasStock = true
            } else {
                $(this).find('i.active').removeClass('active');
                hasStock = false
            }

            var params = window.location.search;
            var newParams = "";
            if(hasStock){
                var addStock = true;
                var splitParams = params.split("&");
                for(var i=0;i<splitParams.length;i++){
                    var splitP = splitParams[i].split("=");
                    if(splitP[0] == "stock"){
                        splitP[1] = "0";
                        addStock = false;
                    }
                    newParams += splitP[0] + "=" + splitP[1];
                    if(i < splitParams.length - 1){
                        newParams += "&";
                    }
                }
                if(addStock){
                    newParams += "&stock=0"
                }
            }else{
                var splitParams = params.split("&");
                for(var i=0;i<splitParams.length;i++){
                    var splitP = splitParams[i].split("=");
                    if(splitP[0] == "stock"){
                        continue;
                    }
                    newParams += splitP[0] + "=" + splitP[1] + "&";
                }
                newParams = newParams.substring(0,newParams.length - 1)
            }

            window.location.href = window.location.pathname + newParams;

        });
    }


    var greyImg = $("#greyImg").attr("src");
    $("img[original]").lazyload({
        placeholder:greyImg,
        failurelimit: 10,
        effect: "fadeIn",
        threshold : 200
    });

});