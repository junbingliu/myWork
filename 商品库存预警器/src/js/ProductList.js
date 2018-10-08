$(document).ready(function () {
    var initconfig = {
        bsV: "3",
        ajaxUrl: "load_product.jsx",
        data_container: ".record_list",
        pagination_container: ".pagination",
        pagination_params: ".pagination_params"
    };
    var merchantId = $("#merchantId").val();
    var listType = $("#listType").val();
    var detail = $("#detail").val();
    var pagination = new $.IsoneAjaxPagination(initconfig);
    pagination.load({m: merchantId,t:listType,d:detail});

    $("#searchForm").on('click', "#search", function () {
        var keyword = $.trim($("#keyword").val());

        var searchArgs = {};
        searchArgs.m = merchantId;
        searchArgs.t = listType;
        if (keyword != "") {
            searchArgs.keyword = keyword;
        }
        pagination.load(searchArgs);
    });

    var $body = $("body");
    $body.on('click','.check-detail',function () {
        var $this = $(this);
        var id = $this.attr("data-a");
        var postData={
            d:id,
            m:merchantId,
            t:'downStock'
        };
        $.post("load_product.jsx", postData, function (data) {
            if(data.code == "0"){
                var arrText = doT.template($("#template").text());
                $("#showInfo").html(arrText(data));
            }
        }, "json");
    })


});
