var $submit_form;
$(document).ready(function () {
    $submit_form = $("#submit_form");
    $submit_form.removeAttr("disabled");
    $submit_form.bind("click", function () {
        if ($("#importFileId").val() == "") {
            alert("请先选择Excel文件");
            return false;
        }
        if(!ifChoseType()){
            alert('请先选择修改类型');
            return false;
        }
        var isDo = confirm("确定要开始批量修改吗");
        if (isDo) {
            var $submit_form = $("#submit_form");
            $submit_form.html("正在处理中...");
            $submit_form.attr("disabled", "disabled");
            $("#importDataForm").submit();

        }
    });

});

function ifChoseType() {
    var flag=false;
    var type=document.getElementsByName('modify_type');
    for(var i=0;i<type.length;i++){
        if(type[i].checked){
            flag=true;
            break;
        }
    }
    if(flag){
        return true;
    }else {
        return false;
    }
}

function doImportCallback(msg) {
    if (msg == "ok") {
        var infoLayer = $.layer({
            shade: [0],
            area: ['auto', 'auto'],
            dialog: {
                msg: '批量修改正在后台处理中，请稍后查看日志了解处理结果',
                btns: 2,
                type: 4,
                btn: ['查看日志', '关闭'],
                yes: function () {
                    window.location.href = "LogView.jsx?m=" + merchantId;
                },
                no: function () {
                    layer.close(infoLayer);
                    $submit_form.html("执行批量修改");
                    $submit_form.removeAttr("disabled");
                }
            }
        });
    } else if (msg.indexOf("File is too large") > -1) {
        alert("文件上传失败，原因是文件超过了1M的限制");
        $submit_form.html("执行批量修改");
        $submit_form.removeAttr("disabled");
    } else if (msg.indexOf("fileType is not allowed") > -1) {
        alert("文件上传失败，原因是文件格式不正确");
        $submit_form.html("执行批量修改");
        $submit_form.removeAttr("disabled");
    } else {
        alert(msg);
    }

}


