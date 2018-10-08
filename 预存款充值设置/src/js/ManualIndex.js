$(document).ready(function () {
    $("#submit_form").click(function () {
        var orderId = $("#orderId").val();
        if(orderId == ""){
            alert("请输入订单号");
            return;
        }

        if (!confirm("确定要手工操作订单充值？")) {
            return;
        }
        var postData = {
            orderId:orderId
        };

        $.post("ManualIndex_handler.jsx", postData, function (data) {
            if (data.code == 'ok') {
                alert("操作成功");
            } else {
                alert(data.msg);
            }
        }, "json");
    });
});



