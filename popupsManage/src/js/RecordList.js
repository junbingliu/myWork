$(document).ready(function () {

    var initconfig = {
        bsV: "3",
        ajaxUrl: "load_records.jsx",
        data_container: ".record_list",
        pagination_container: ".pagination",
        pagination_params: ".pagination_params"
    };

    var pagination = new $.IsoneAjaxPagination(initconfig);

    pagination.load({m: merchantId,t:t});
    var $body = $("body");
    //删除操作
    $body.on("click", "#deleteRecord", function () {
        if (confirm("确定要删除该弹窗、浮标吗?")) {
            var id = $(this).data("id");
            $.get("delete.jsx", {id: id}, function (ret) {
                if (ret.status != 200) {
                    alert("发生了错误,错误信息: " + ret.msg);
                    return;
                } else {
                    alert("删除成功")
                }
                pagination.load(null);
            }, "json")
        }
    });
    $body.on('click', "#search", function () {
        var keyword = $.trim($("#keyword").val());
        var searchArgs = {};
        searchArgs.m = merchantId;
        if (keyword != "") {
            searchArgs.keyword = keyword;
        }
        pagination.load(searchArgs);
    });
});

