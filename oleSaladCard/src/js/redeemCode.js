$(document).ready(function () {
    var initconfig = {
        bsV: "3",
        ajaxUrl: "load_redeemCode.jsx",
        data_container: ".record_list",
        pagination_container: ".pagination",
        pagination_params: ".pagination_params"
    };
    var pagination = new $.IsoneAjaxPagination(initconfig);
    pagination.load({m: merchantId,activityId:activityId});

    var $body = $("body");
    var $record_list = $("#record_list");

    //搜索
    $body.on('click', "#search", function () {
        var keyword = $.trim($("#keyword").val());
        var searchArgs = {};
        if (keyword != "") {
            searchArgs.keyword = keyword;
        }
        searchArgs.m = merchantId;
        searchArgs.activityId=activityId;
        pagination.load(searchArgs);
    });

    //生产兑换码
    $body.on('click', ".redeem", function () {
        var post={
            activityId:activityId
        }
        $.post("./handler/doInitSaladCardCode.jsx", post, function (data) {
            if(data.code == "0"){
                window.location.href="redeemCodeList.jsx?m="+merchantId+"&activityId="+activityId;
            } else {
                alert(data.msg);
            }
        }, "json");
    });

    //核销兑换码
    $record_list.on('click', ".cancel", function () {
        var $this = $(this);
        var post={
            id:$this.attr("data-a")
        }
        bootbox.confirm("确定核销吗？",function(result){
            if(result){
                $.post("./handler/nullifyCode.jsx", post, function (data) {
                    if(data.code == "0"){
                        pagination.load({m:merchantId, activityId:activityId});
                    } else {
                        alert(data.msg);
                    }
                }, "json");
            }
        });
        return false;
    });
});
