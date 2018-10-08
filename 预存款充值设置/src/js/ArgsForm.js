$(document).ready(function () {
    $("#submit_form").click(function () {
        var eWalletProductId = $("#eWalletProductId").val();
        var myWalletProductId = $("#myWalletProductId").val();
        var deliveryRuleId = $("#deliveryRuleId").val();
        var postData = {
            eWalletProductId: eWalletProductId,
            deliveryRuleId: deliveryRuleId,
            myWalletProductId: myWalletProductId
        };

        $.post("ArgsForm_handler.jsx", postData, function (data) {
            if (data.code == 'ok') {
                alert("保存成功");
            } else {
                alert(data.msg);
            }
        }, "json");
    });
});



