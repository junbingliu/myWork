


var ProductDetail = function(){
    var tipsTimer = 0;
    function showTips(text){
        clearTimeout(tipsTimer);
        var tips = $("#error_tips");
        tips.html(text);
        tipsTimer = setTimeout(function(){
            tips.html("");
        },3000);
    }


    var handleForm = function(){
        var ViewModel = function(){
            var self=this;
            self.getQueryString=function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]); return null;
            };
            //购买数
            self.limitCount = ko.observable(limitCount);
            self.sellableCount = ko.observable((sellableCount&&sellableCount == "" ? 0 : sellableCount));
            self.buyAmount=ko.observable(limitBuyConfig.minNumber > 1 ? limitBuyConfig.minNumber : 1);
            self.skuSelector = new SkuSelector();
            self.skuSelector.skuSelectListener = function(skuId){
                $("#btnbuy").hide();
                $("#buyInfo").fadeIn();
                var postData = {
                    productId:productId,
                    skuId:skuId,
                    mid:merchantId,
                    userId:userId
                }
                $.post("/" + rappId +"/serverHandler/getSellableCount.jsx",postData,function(ret){
                    if(ret.state=='ok' && ret.skuId==skuId){
                        if(ret.sellableCount>0){
                            //$("#buyInfo").hide();
                            $(".btnAddToCart").removeClass("enable");
                            //$("#btnNotification").hide();
                            $(".kucun").html("库存:" + ret.sellableCount);
                        }else{
                            //$("#buyInfo").hide();
                            $(".btnAddToCart").addClass("enable");
                            //$("#btnNotification").show();
                            $(".kucun").html("无库存");
                        }
                        self.sellableCount(ret.sellableCount);
                    }else{
                        $("#buyInfoMsg").text("出错了！检查是否有库存出错。")
                    }
                },"json");
                $.post("/"+rappId+"/serverHandler/getPriceBySkuId.jsx",postData,function(ret){
                    if(ret.state=="ok"&&ret.price!=0){
                        //console.log(ret.price);
                        var splitPrice = (ret.price/100).toFixed(2);
                        //$(".money .textPrimary").html("¥<strong>"+splitPrice[0]+"</strong>." + splitPrice[1]);
                        $("#productPrice").html("¥"+splitPrice)
                    }
                },"json")

            };
            self.add=function(){
                var newAmount=Number(self.buyAmount())+1;
                var limitCount = Number(limitBuyConfig.maxNumber);
                if(limitCount > 0){
                    if(newAmount > limitCount){
                        showTips("此商品限购" + limitCount + "个！");
                        newAmount = limitCount;
                    }
                }
                var sellableCount = Number(self.sellableCount());
                if(newAmount > sellableCount){
                    showTips("您所选的商品数量大于库存!");
                    newAmount = sellableCount;
                    if(newAmount <= 0){
                        newAmount = 1;
                    }
                }
                self.buyAmount(newAmount);
            }
            self.decrease=function(){
                var newAmount=Number(self.buyAmount())-1;
                if(newAmount<=0){
                    self.buyAmount(1);
                    return;
                }
                var minAmount = Number(limitBuyConfig.minNumber);
                if(newAmount < minAmount){
                    showTips("此商品最少买" + minAmount + "个！");
                    newAmount = minAmount;
                }
                self.buyAmount(newAmount);
            }
            self.changeNumber = function(){
                var curAmount = Number(self.buyAmount()),minNumber = limitBuyConfig.minNumber,maxNumber = limitBuyConfig.maxNumber;
                if(minNumber < 1){
                    minNumber = 1;
                }

                if(isNaN(curAmount)){
                    curAmount = minNumber;
                }
                if(maxNumber > 0 && curAmount > maxNumber){
                    curAmount = maxNumber
                }
                self.buyAmount(curAmount);
            }
            self.checknumber=function(strs) {
                var Letters = "1234567890";
                var i;
                var c;
                for (i = 0; i < strs.length; i ++) {
                    c = strs.charAt(i);
                    if (Letters.indexOf(c) == -1) {
                        return true;
                    }
                }
                return false;
            }
            self.checkBuyForm=function() {
                if (self.checknumber(self.buyAmount())) {
                    showTips("您填写购买的商品数量不是有效的数字");
                    self.buyAmount(1);
                    return false;
                } else {
                    if(isNaN(self.buyAmount())){
                        showTips("您填写购买的商品数量不是有效的数字");
                        self.buyAmount(1);
                        return false;
                    }
                    if (self.buyAmount() == "0") {
                        showTips("购买的商品数量必须大于0");
                        self.buyAmount(1);
                        return false;
                    }
                    if(Number(self.sellableCount()) <= 0){
                        showTips("商品库存为0，不能购买。");
                        return false;
                    }
                    if (self.buyAmount() == "999" || self.buyAmount().length > 3) {
                        showTips("尊敬的客户您订购的数量太多,请您与客服或与商家联系");
                        return false;
                    }
                }
                return true;
                //获取该商品购物车数量
//        var responseCount = jQuery.ajax({url:"/shopping/handle/get_product_buy_count.jsp?dumy=" + Math.random(),data:{productId:self.getQueryString("id")},async:false,cache:false}).responseText;
//        responseCount = Number(jQuery.trim(responseCount));
            }
            self.submitCartForm=function(successCallBack,failCallBack){
                var params={};
                params.objectId=self.getQueryString("id");
                params.amount=self.buyAmount();
                params.flowType="normal_add2cart";
                params.skuId= self.skuSelector.selectedSkuId();
                $.post("/shopping/handle/v3/do_buy.jsp",params,function(data){
                    if(data.indexOf("ok")>-1){
                        successCallBack(data);
                    }else{
                        data=JSON.parse(data);
                        if(!data.state) {
                            if (data.error_code == "product_not_exist") {
                                alert("该商品不存在!");
                            } else if (data.error_code == "product_off_shelves") {
                                alert("该商品已下架!");
                            } else if (data.error_code == "product_info_wrong") {
                                alert("商品销售信息有误!");
                            } else if (data.error_code == "product_out_of_stock") {
                                alert("商品库存不足!");
                            }else if(data.error_code == "error"){
                                showTips(data.msg);
                            }else{
                                alert("加入购物车失败,未知错误!"+data.error_code);
                            }
                        }
                        failCallBack();
                    }
                })

            }
            self.add2Cart = function(){
                if(self.checkBuyForm()){
                    var successCallBack=function(data){
                        if(data){
                            var splitData = data.split("---");
                            if(splitData[0] == "ok"){
                                var cartStat = $.parseJSON(splitData[1]);
                                if(cartStat){
                                    $("#cartItemNumber").html(cartStat.productAmount);
                                    $("#sideCartItemNumber").html(Number(cartStat.productAmount) > 99 ? "99+" : cartStat.productAmount+"");
                                    //var panel = $(".messagePanel.addToCart");
                                    //panel.siblings(".messagePanel").hide();
                                    //panel.html(template("add2CartMsgTemplate",cartStat));
                                    //panelActive('.addToCart');
                                    //$.get("/"+rappId+"/serverHandler/getBuyAlsoBuy.jsx",{pid:productId,mid:merchantId,rd:Math.random()},function(reps){
                                    //    if(reps && reps.buyAlsoBuy.length > 0){
                                    //        $(".bd",panel).html(template("panelBuyAlsoBuyTemplate",reps)).show();
                                    //        $(".slide",panel).slide({titCell:'.slide-hd i', mainCell:'.slide-bd ul',vis:5,effect:"left"});
                                    //    }
                                    //},"json");

                                    alert("加入购物车成功!");
                                }
                            }
                        }
                    }
                    self.submitCartForm(successCallBack);
                }
            }
            self.buyNow=function(){
                if(self.checkBuyForm()){
                    var successCallBack=function(){
                        window.location.href="/cart.html";
                    }
                    self.submitCartForm(successCallBack);
                }
            }
        }
        var model = new ViewModel();
        model.skuSelector.init(skus,inventoryAttrs);
        ko.applyBindings(model);

    }

    var handleImg = function(){
        var bigViewObj = $("#ZPic"),bigImgObj = bigViewObj.find("img"),midImgObj = $("#midimg"),winSelector = $("#winSelector");
        var imageMenu = $("#imageMenu"),imageMenuList = $("li",imageMenu),midImgLoaded = false,bigImgLoaded = false;

        // 图片上下滚动
        var imageLength = imageMenuList.length;
        var count = imageLength-4; /* 显示 6 个 li标签内容 */
        var interval = 85+10;
        var curIndex = 0;

        if(imageLength > 4){
            $('.scrollbutton').click(function () {
                if ($(this).hasClass('disabled')) return false;
                if ($(this).hasClass('smallImgUp'))--curIndex;
                else ++curIndex;

                $('.scrollbutton').removeClass('disabled');
                if (curIndex == 0) $('.smallImgUp').addClass('disabled');
                if (curIndex > count){
                    $('.smallImgDown').addClass('disabled');
                    return;
                }
                $("ul",imageMenu).stop(false, true).animate({ "marginLeft": -curIndex * interval + "px" }, 600);
            });
        }else{
            $('.scrollbutton').addClass('disabled');
        }
        var $viewImgWidth,$viewImgHeight,$height;
        $viewImgWidth = $viewImgHeight = $height = null;

        //点击或鼠标移动到小图图
        imageMenuList.bind("click mouseover", function () {
            var selfObj = $(this);
            if (!selfObj.is(".cur")) {
                midImgObj.attr("src",selfObj.attr("mid-src"));//中图
                bigImgObj.attr("src",selfObj.attr("view-src"));//大图
                selfObj.siblings().removeClass("cur");
                selfObj.addClass("cur");
                $viewImgWidth = $viewImgHeight = $height = null;
                midImgLoaded = false,bigImgLoaded = false;
            }
        });

        //放大镜功能
        var $divWidth = winSelector.width(); //选择器宽度
        var $divHeight = winSelector.height(); //选择器高度
        var $imgWidth = 0; //中图宽度
        var $imgHeight = 0; //中图高度


        $("#midimg,#winSelector").mousemove(function(e){
            //if(midImgLoaded && bigImgLoaded){
                if (winSelector.is(":hidden")) {
                    winSelector.show();
                    bigViewObj.show();
                }
                winSelector.css(fixedPosition(e));
            //}
            e.stopPropagation();
        }).mouseout(function (e) {
            if (!winSelector.is(":hidden")) {
                winSelector.hide();
                bigViewObj.hide();
            }
            e.stopPropagation();
        }); //选择器事件


        bigViewObj.scrollLeft(0).scrollTop(0);
        function fixedPosition(e) {
            if (e == null) {
                return;
            }

            $imgWidth = midImgObj.width();
            $imgHeight = midImgObj.height();
            var $imgLeft = midImgObj.offset().left;
            var $imgTop = midImgObj.offset().top;
            var X = Math.floor(e.pageX - $imgLeft) - $divWidth / 2;
            var Y = Math.floor(e.pageY - $imgTop) - $divHeight / 2;
            //X = X < 0 ? 0 : X;
            //Y = Y < 0 ? 0 : Y;
            X = Math.max(X, 0);
            Y = Math.max(Y, 0);
            X = Math.min(X, ($imgWidth - $divWidth));
            Y = Math.min(Y, ($imgHeight - $divHeight));

            $viewImgWidth = bigImgObj[0].width;
            $viewImgHeight = bigImgObj[0].height;
            if ($viewImgWidth < 200 || $viewImgHeight < 200) {
                $viewImgWidth = $viewImgHeight = 800;
            }
            $height = $divHeight * $viewImgHeight / $imgHeight;

            var scrollX = X * $viewImgWidth / ($imgWidth + 140);
            var scrollY = Y * $viewImgHeight / ($imgHeight + 140);

            bigImgObj.css({ "left": scrollX *-1, "top": scrollY * -1 });
            return { left: X + "px", top: Y + "px" };
        }

    }


    var handleCombination = function(){
        var combination = $(".combination");
        if(combination){
            combination.on("click",".checkbox",function(evt){
                var curObj = $(this),totalPrice=0,totalMarketPrice=0;
                if(curObj.attr("memberPrice") == ""){
                    return;
                }
                var selectedPro = $(".checkbox[data-checked='true']",combination);
                selectedPro.each(function(){
                    var thisObj = $(this);
                    totalPrice += parseFloat(thisObj.attr("memberPrice"));
                    var marketPrice = thisObj.attr("marketPrice");
                    if(!marketPrice){
                        marketPrice = 0;
                    }
                    totalMarketPrice += parseFloat(marketPrice);
                });
                totalPrice = parseFloat(totalPrice).toFixed(2);
                totalMarketPrice = parseFloat(totalMarketPrice).toFixed(2);
                var splitTotalPrice = (totalPrice + "").split(".");
                var totalPriceBlock = $("#bestTotalPrice",combination);
                if(totalPrice > 9999){
                    totalPriceBlock.parent(".price").addClass("small");
                }else{
                    totalPriceBlock.parent(".price").removeClass("small");
                }
                totalPriceBlock.html("¥<span>" + splitTotalPrice[0] + "</span>." + splitTotalPrice[1]);
                $("#bestTotalMarketPrice",combination).html(totalMarketPrice > 0 ? "¥" + totalMarketPrice : '-');
                $("#bestSelectedNum",combination).html(selectedPro.length);
            });

            //最佳搭配立刻购买
            var errorMessages=[];
            $("#bestAddToCart").click(function(){
                var callback=function(){
                    if(errorMessages.length>0){
                        alert(errorMessages);
                    }else{
                        window.location.href="/cart.html";
                    }
                    errorMessages=[];

                }
                addToCart(callback);
            });

            var addToCart=function(callback){
                var selectedPro = $(".checkbox[data-checked='true']",combination);
                if(selectedPro.length == 1){
                    alert("请先选择商品！");
                    return;
                }
                var productItem = [];
                selectedPro.each(function(){
                    var thisObj = $(this);
                    productItem.push(thisObj.attr("objId"));
                });

                var params={};
                params.objectId=productItem[0];
                params.relationType="combination";
                params.flowType="normal_add2cart";
                var destObjIds="";
                for(var i=0;i<productItem.length;i++){
                    destObjIds=productItem[i]+","+destObjIds;
                }
                params.destObjIds=destObjIds;
                submitCart(params,callback);
            }

            var submitCart=function(params,callback){
                $.post("/shopping/handle/v3/do_buy.jsp",params,function(data){
                    if(data.indexOf("ok")<0){
                        data=$.parseJSON(data);
                        if(!data.state) {
                            if (data.error_code == "product_not_exist") {
                                errorMessages.push(params.objectId+":商品不存在");
                            } else if (data.error_code == "product_off_shelves") {
                                errorMessages.push(params.objectId+":商品已下架!");
                            } else if (data.error_code == "product_info_wrong") {
                                errorMessages.push(params.objectId+":商品销售信息有误!");
                            } else if (data.error_code == "product_out_of_stock") {
                                errorMessages.push(params.objectId+":商品库存不足!");
                            } else {
                                errorMessages.push(params.objectId+":加入购物车失败,未知错误!"+data.error_code);
                            }
                        }
                    }
                    if(callback){
                        callback();
                    }
                })
            }
        }
    }

    var handleGroupTab = function(){
        $('.combination .groupTabHd li').click(function (){
            $('.combination .groupTabBd .item').eq($(this).index()).fadeIn().siblings('.item').hide();
        });
    }

    var handleTab = function(){
        var tabMenu = $("#tabMenu"),tabContent = $("#tabContent");
        $("li[tab-target]",tabMenu).on("click",function(){
            var selfObj = $(this);
            if(selfObj.find("a").is(".cur")){
                return;
            }
            var targetTabId = selfObj.attr("tab-target");
            var targetTab = $("#" + targetTabId);
            targetTab.siblings().hide();
            $("li a.cur").removeClass("cur");
            selfObj.find("a").addClass("cur");
            targetTab.show();
        });

        var wrapTop = tabMenu.offset().top;
        $(window).scroll(function() {
            var vtop = $(document).scrollTop();
            var tabContentBottomTop = tabContent.offset().top + tabContent.outerHeight() -40;
            if(vtop >= wrapTop && vtop < tabContentBottomTop){
                tabMenu.css({"position":"fixed","top":0,"width":"978px",zIndex:200});
            }else{
                tabMenu.css({"position":"static","width":"auto"});
            }
        });

    }

    var handleOther = function(){

        var addFavorTimer = 0;
        $("#addFavor").on("click",function () {
            window.clearTimeout(addFavorTimer);
            var params = {};
            params["objId"] = $(this).attr("pid");
            params["type"] = "product";
            $.post("/" + rappId +"/serverHandler/favor_add_handler.jsx", params, function(msg) {
                var msgContent;
               msg = $.trim(msg);
                if(msg=="ok"){
                     msgContent = "收藏成功!";
                    $("#addFavor i").addClass("cur");
                    $("#addFavor").html('<i class="cur"></i>已收藏商品');
                }else{
                    if(msg == "none"){
                        window.location.href = "/login.html?rurl="+ location.href;
                        return;
                    }else if (msg == "existed") {
                        $("#xj_msg_info").css("display", "block").show(1).delay(1000).hide(0);
                        msgContent="此商品已收藏过!";
                    } else {
                        $("#xj_msg_info").css("display", "block").show(1).delay(1000).hide(0);
                        msgContent="系统繁忙请稍后再试！";
                    }

                }
                alert(msgContent);
            });
        });



        // recommend  tab;
        function recommendGroupTab(){
            $('.combination .groupTabHd li').click(function (){
                $('.combination .groupTabBd .item').eq($(this).index())
                    .fadeIn().siblings('.item').hide();

                $(this).addClass('active')
                    .siblings('li').removeClass('active');
            });
        }
//    recommendGroupTab();




        function components_Checkbox(){
            $('.checkbox').click(function (){
                if ($(this).attr('data-checked') != 'true') {
                    $(this).attr('data-checked', true).addClass('active');
                } else {
                    $(this).attr('data-checked', false).removeClass('active');
                }
            });
        }
        components_Checkbox();


        if(true){


            //加载大家都在看
            $.get("/"+rappId+"/serverHandler/getBuyAlsoBuy.jsx",{pid:productId,mid:merchantId,size:"200X200",count:5,rd:Math.random()},function(reps){
                if(reps && reps.buyAlsoBuy.length > 0){
                    $("#buyAlsoBuyBlock").html(template("buyAlsoBuyTemplate",reps)).show();
                }
            },"json");

            $.get("/"+rappId+"/serverHandler/productGetViewHistory.jsx",{size:"200X200",count:5,rd:Math.random()},function(reps){
                if(reps && reps.state && reps.viewHistory.length > 0){
                    $("#viewHistoryBlock").html(template("viewHistoryTemplate",reps)).show();
                }
            },"json");





        }

    }

    function panelActive (panel,timeout){
        if(!timeout){
            timeout = 5000;
        }
        clearTimeout(timer);
        $(panel).fadeIn();

        var timer = setTimeout(function (){
            $(panel).fadeOut();
        }, timeout);

        $(panel).mouseover(function (){
            clearTimeout(timer);
        });

        $(panel).mouseout(function (){
            timer = setTimeout(function (){
                $(panel).fadeOut();
            }, timeout);
        });
    }

    function handleOtherAddToCart(){
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
        $(".backededed").on("click",".btn-buy",function(){
            var curObj = $(this),pid = curObj.attr("pid");
            var config = {productId:pid,target:curObj};
            skuSelector.load(config);
            return false;
        });
    }


    var handleCommit = function(){
        var commentBlock = $("#tabComment");

        function loadComment(page){
            $.get("/" + rappId + "/serverHandler/loadComment.jsx",{id:productId,page:page||1},function(resp){
                commentBlock.html(template("commentTemplate",resp));

                var total = $(".pagination",commentBlock).attr("total");
                var page = $(".pagination",commentBlock).attr("page");
                makePage(parseInt(total),15,parseInt(page),"")
                handlePageTarget();
                if(resp.appraisCount > 0){
                    $("#tabComment_num").html(resp.resp.appraisCount);
                }
            },"json");
        }
        loadComment();

        function changeURLPar(url,param,nextPage){
            return nextPage + "";
        }


        function makePage(totalRecord, pageSize,currentpage,url) {
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
                        html[i] = '<a id="href_' + i + '" class="but active">' + (i + 1) + '</a>';
                    }else{
                        html[i] = '<a id="href_' + i + '" class="but" targetPage="'+changeURLPar(url,'page',i+1)+'">' + (i + 1) + '</a>';
                    }
                }
                var totalShow = '<span class="title">共<span class="colore333">'+totalRecord+'</span>件商品</span>';
                totalShow = "";
                var nextPage = '<a title="下一页" class="but" targetPage="'+changeURLPar(url,'page',currentpage+1)+'">下一页</a>';
                var prePage = '<a title="上一页" class="but" targetPage="'+changeURLPar(url,'page',currentpage-1)+'">上一页</a>';
                var button = '<li>&nbsp;&nbsp;到第&nbsp;<input value="1" id="inputPage">&nbsp;页</li>' +
                    '<li><a class="goToPage" href="javascript:;" ></a></li>';
                if (currentpage == 1) {
                    prePage = '<a title="目前已是第一页" class="but">上一页</a>';
                }
                if (currentpage >= pageNum) {
                    nextPage = '<a title="目前已是最后一页" class="but">下一页</a>';
                }
                list = totalShow + prePage + getPage(currentpage,html,10,pageNum) + nextPage;
                if(pageNum>0){
                    $("#comment .pagination").html(list);
                }
            }
        }

        function getPage(cur, data, count, dataList) {
            var html = "";
            var start;
            var end;
            //    var empty = '<li>...&nbsp;</li>';
            var empty = '<span class="omission">...</span>';
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
                if(start < 0){
                    start = 0;
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
            }else{
                if(dataList > 10){
                    html=html+empty+data[dataList-1];
                }

            }
            return html;
        }


        function handlePageTarget(){
            $(".pagination",commentBlock).on("click","a[targetPage]",function(){
                loadComment(parseInt($(this).attr("targetPage")));
            });
        }



    }

    return {
        init:function(){
            handleImg();
            handleForm();
            //handleCombination();
            //handleGroupTab();
            handleOther();
            handleOtherAddToCart();
            handleTab();
            handleCommit();
        }
    };
}();

$(function(){
    ProductDetail.init();

    var greyImg = $("#greyImg").attr("src");
    $("img[original]").lazyload({
        placeholder:greyImg,
        failurelimit: 10,
        effect: "fadeIn",
        threshold : 200
    });
});
