$(document).ready(function () {
    $("#submit_btn").click(function () {
        var $merchantId = $("#merchantId");
        var address = $("#address").val();
        var namespaceURI = $("#namespaceURI").val();
        var postData = {
            address: address,
            namespaceURI: namespaceURI,
            m: $merchantId.val()
        };
        console.log("postData=>"+JSON.stringify(postData));
        $.post("ArgsForm_handler.jsx", postData, function (data) {
            if (data.code == 'ok') {
                alert("操作成功");
            } else {
                alert(data.msg);
            }
        }, "json");
    });
});



