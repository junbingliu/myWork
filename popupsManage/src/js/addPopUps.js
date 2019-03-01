$(document).ready(function () {
    $("input.date").datepicker({
        changeYear: false
    });

    $("#detailImageSelectBtn").click(function () {
        photoGallery.openSelectImgView(function (item) {
            var imgFileId = item.fileId();
            var imgUrl = item.imgUrl().replace("_100X100", "");
            $("#detailImage").val(imgFileId);
            $("#previewA").attr("href", imgUrl);
            $("#previewImage").attr("src", imgUrl);
        }, false);
    });

    $("#detailImageDeleteBtn").click(function () {
        $("#detailImage").val("");
        $("#previewA").attr("href", "javascript:;");
        $("#previewImage").attr("src", "/upload/nopic_200.jpg");
    });

    $("#saveAddBtn").click(function () {
        var v = $("#saveAddBtn").val();
        var type = $("input[name='type']:checked").val();
        var isEnable = $("input[name='isEnable']:checked").val();

        var image = $("#detailImage").val();
        var returnUrl = $("#returnUrl").val();

        var beginDate1 = $("#beginDate").val();
        var beginDate2 = $("#beginTime").val();

        var endDate1 = $("#endDate").val();
        var endDate2 = $("#endTime").val();

        var tempBeginData = beginDate1.replace(new RegExp("-", "g"), "/")
        var tempBeginTime = tempBeginData + " " + beginDate2
        var beginTime = new Date(tempBeginTime).getTime();

        var tempEndData = endDate1.replace(new RegExp("-", "g"), "/")
        var tempEndTime = tempEndData + " " + endDate2;
        var endTime = new Date(tempEndTime).getTime();

        var channel = getCheckboxVal($("input[name=channel]"))
        var applicablePage = getCheckboxVal($("input[name=applicablePage]"))
        var description = $("#description").val();

        if (beginTime > endTime) {
            alert("有效的开始时间不能大于结束时间");
            return;
        }
        if (image == "undefined" || image == "") {
            alert("请选择图片");
            return;
        } else if (!returnUrl) {
            alert("跳转链接不能为空")
            return;
        } else if (!beginDate1) {
            alert("有效开始时间不能为空")
            return;
        } else if (!endDate1) {
            alert("有效结束时间不能为空")
            return;
        }
        else if (channel == null) {
            alert("适用渠道未选择")
            return;
        } else if (applicablePage == null) {
            alert("适用页面未选择")
            return;
        }
        else if (!description) {
            alert("说明不能为空")
            return;
        }

        var postData = {}
        postData.type = type;
        postData.isEnable = isEnable;
        postData.image = image
        postData.returnUrl = returnUrl
        postData.beginTime = beginTime
        postData.endTime = endTime
        postData.channel = channel
        postData.applicablePage = applicablePage.toString();
        postData.description = description
        if (v == "add") {
            postData.handle = "add"
        } else {
            postData.id = $(this).data("id");
            postData.handle = "edit"
        }
        postData.merchantId = merchantId;
        $.get("addPopUps_handler.jsx", postData, function (ret) {
            if (ret.code != "0") {
                alert(ret.msg);
                return;
            } else {
                if (v == "add") {
                    alert("添加成功")
                }
                else {
                    alert("修改成功")
                }
                window.location.href = "popUpsList.jsx?m=" + merchantId + "&t=all";
            }
            // pagination.load(null);
        }, "json");
    })
});

function getCheckboxVal(t) {
    var result = [];
    $.each(t, function (i, n) {
        if (n.checked) {
            result.push(n.value);
        }
    });
    if (result.length == 0) {
        return null;
    }
    return result.toString();
}


