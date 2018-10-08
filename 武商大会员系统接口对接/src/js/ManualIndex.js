$(document).ready(function () {
    $("#submit_form").click(function () {
        var requestData = $("#postData").val();
        var iType = $("#iType").val();
        var postData = {
            iType: iType,
            postData: requestData,
            m: merchantId
        };

        $.post("ManualIndex_handler.jsx", postData, function (data) {
            var responseData = $("#responseData");
            responseData.html(data);
        }, "html");
    });
});



