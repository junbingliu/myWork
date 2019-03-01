$(document).ready(function () {
    var $body = $("body");
    var $record_list = $("#record_list");

    //编辑商品编码
    $record_list.on('click', ".doUpdate", function () {
        var $this = $(this);
        $("#update_proCode").val($this.attr("data-a"));
        $("#oriProCode").val($this.attr("data-a"))
        $('#doUpdateStateModal').modal('show');
    });

    //删除商品编码
    $record_list.on('click', ".delete", function () {
        var $this = $(this);
        var post={
            proCode:$this.attr("data-a"),
            activityId : $this.attr("data-b")
        }
        bootbox.confirm("确定删除吗？",function(result){
            if(result){
                $.post("deleteProCode.jsx", post, function (data) {
                    if(data.code == "0"){
                        window.location.href='productCodeList.jsx?id='+$this.attr("data-b")+'&m='+merchantId;;
                    } else {
                        alert(data.msg);
                    }
                }, "json");
            }
        });
        return false;
    });

    //修改商品编码
    $body.on('click', "#update_submit", function () {
        var $this=$(this);
        var post={
            oriProCode:$('#oriProCode').val(),
            newProCode:$('#update_proCode').val(),
            activityId : $this.attr("data-a")
        }
        $.post("updateProCode.jsx", post, function (data) {
            if(data.code == "0"){
                $('#doUpdateStateModal').modal('hide');
                window.location.href='productCodeList.jsx?id='+$this.attr("data-a")+'&m='+merchantId;            } else {
                alert(data.msg);
            }
        }, "json");

    });

    $body.on('click', "#cancelStateBtn", function () {
        $('#doUpdateStateModal').modal('hide');
    });

    $body.on('click', "#addProCode", function () {
        $('#add_recordModal').modal('show');

    });

    //添加商品编码
    $body.on('click', "#add_submit", function () {
        var $this=$(this);
        var post={
            proCode:$('#proCode').val(),
            activityId : $this.attr("data-a")
        }
        $.post("addProductCode.jsx", post, function (data) {
            if(data.code == "0"){
                $('#add_recordModal').modal('hide');
                window.location.href='productCodeList.jsx?id='+$this.attr("data-a")+'&m='+merchantId;
            } else {
                alert(data.msg);
            }
        }, "json");
    });


});
