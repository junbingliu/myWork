(function($){
    $.getUrlParam = function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if (r!=null) return unescape(r[2]); return null;
    }

})(jQuery);

$(document).ready(function(){

    (jQuery);

    function getMerchant(id){
        $.post("/InDoorNavigation/server/merchant/getMerchantById.jsx",{logoSpec:"280X140",id:id},function(data){
            if("ok"==data.state){
                var floor   ="<b>商铺名称：</b>"+data.merchant.name;
                $("div .mt").html(floor);
                var Lurl=data.merchant.logoUrl
                var Purl=data.merchant.photoUrl;
                $(".fd_logo").html("<img width='280' height='140' src='"+Lurl.substr(0,Lurl.length)+"'  />");
                $(".articlePic p").html("<img src='"+Purl.substr(0,Purl.length)+"'/>");
                $(".article p").html(data.merchant.description);
            } },"json")
    }
    getMerchant($.getUrlParam('id'));
});

