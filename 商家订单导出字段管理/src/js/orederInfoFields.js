$(document).ready(function () {

    $('input').iCheck({//执行icheck样式
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });

    bootbox.setDefaults("locale", "zh_CN");//bootbox设置为中文
    var $body = $("body");

    var type = getQueryString("type");
    var gradeId = getQueryString("gradeId");
    var columnId = getQueryString("columnId");

    console.log(gradeId, columnId, type);

    //打开添加数据对话框
    $("#add").on('click', function () {
        $('#add_field').modal('show');
    });

    //tab切换
    (function () {
        $(".anchor").children().each(function () {
            $(this).removeClass("active")
        })
        if (type == "order_all") {
            $("#anchor_orderInfo").addClass("active")
        } else if (type == "order_item") {
            $("#anchor_orderGoodsInfo").addClass("active")
        } else if (type == "order_baseInfo") {
            $("#anchor_orderBaseInfo").addClass("active")
        }

    })();

    //添加单条
    $("#submit").on('click', function () {

        var postData = {
            type: type,
            gradeId: gradeId,
            columnId: columnId,
            "id": $('#id').val().replace(/\s/g, ""),
            "name": $('#name').val().replace(/\s/g, ""),
            "columnWidth": $('#columnWidth').val().replace(/\s/g, ""),
            "index": $('#index').val().replace(/\s/g, ""),
            "isChecked": $('#isChecked').is(":checked") ? "true" : "false",
            "isShow": $('#isShow').is(":checked") ? "true" : "false"
        };

        add(postData);

    });

    // 删除单条
    $("#recordList").on('click', ".delete", function () {
        var $this = $(this);
        var id = $this.attr("data-a");
        var postData = {
            type: type,
            gradeId: gradeId,
            columnId: columnId,
            id: id
        };

        //弹框提示（需引用bootbox.min.js）
        bootbox.confirm("确定删除吗？", function (result) {
            if (result) {
                del(postData);
            }
        });
        return false;

    });

    //保存全部
    $("#save").on('click', function () {
        var size = $("[name='recordList_id']").size();
        var list = [];
        var reg = /^\d+$/;
        for (var i = 0; i < size; i++) {
            var obj = {
                id: $("[name='recordList_id']").eq(i).text(),
                name: $("[name='recordList_name']").eq(i).text(),
                columnWidth: $("[name='recordList_columnWidth']").eq(i).val(),
                index: $("[name='recordList_sortNum']").eq(i).val(),
                isChecked: $("[name='recordList_isChecked']").eq(i).is(":checked") ? "true" : "false",
                isShow: $("[name='recordList_isShow']").eq(i).is(":checked") ? "true" : "false"
            };

            if(!reg.test(obj.columnWidth)){
                alert("宽度存在非数字的字符:" + obj.columnWidth);
                return;
            }

            if(!reg.test(obj.index)){
                alert("排序存在非数字的字符:" + obj.index);
                return;
            }

            list.push(obj)
        }
        var postData = {
            type: type,
            gradeId: gradeId,
            columnId: columnId,
            list: JSON.stringify(list)
        };
        saveAll(postData)
    });

    //全选
    $('#selectAll').on('ifChecked', function (event) {
        $("[name='select']:checkbox").iCheck('check')
    });
    $('#selectAll').on('ifUnchecked', function (event) {
        $("[name='select']:checkbox").iCheck('uncheck')
    });

    //全选是否默认选中
    $('#selectAll_isChecked').on('ifChecked', function (event) {
        $("[name='recordList_isChecked']:checkbox").iCheck('check')
    });
    $('#selectAll_isChecked').on('ifUnchecked', function (event) {
        $("[name='recordList_isChecked']:checkbox").iCheck('uncheck')
    });

    //全选是否显示
    $('#selectAll_isEnabled').on('ifChecked', function (event) {
        $("[name='recordList_isShow']:checkbox").iCheck('check')
    });
    $('#selectAll_isEnabled').on('ifUnchecked', function (event) {
        $("[name='recordList_isShow']:checkbox").iCheck('uncheck')
    });

    //多选删除
    $('#deleteChecked').click(function () {
        var ids = [];
        $("input[name='select']:checked").each(function () {
            var $this = $(this);
            var id = $this.attr("data-a");
            ids.push(id);
        });
        var postData = {
            type: type,
            gradeId: gradeId,
            columnId: columnId,
            ids: JSON.stringify(ids)
        }

        //弹框提示
        bootbox.confirm("确定删除吗？", function (result) {
            if (result) {
                delMore(postData);
            }
        });
        return false;
    });


});

//添加函数
function add(obj) {
    $.post("saveOrderInfo.jsx", obj, function (data) {
        if (data.code == "0") {
            $('#add_field').modal('hide');
            alert(data.msg);
            window.location.href = "getOrderInfo.jsx?gradeId=" + gradeId + "&columnId=" + columnId + "&type=" + type + "&m=" + merchantId;
        } else {
            alert(data.msg);
        }
    }, "json");
}

//保存全部
function saveAll(obj) {
    $.post("saveAllOrderInfo.jsx", obj, function (data) {
        if (data.code == "0") {
            alert(data.msg);
            window.location.href = "getOrderInfo.jsx?gradeId=" + gradeId + "&columnId=" + columnId + "&type=" + type + "&m=" + merchantId;
        } else {
            alert(data.msg);
        }
    }, "json");
}

//删除单个
function del(postData) {
    $.post("deleteOrderInfo.jsx", postData, function (data) {
        if (data.code == "0") {
            alert(data.msg);
            window.location.href = "getOrderInfo.jsx?gradeId=" + gradeId + "&columnId=" + columnId + "&type=" + type + "&m=" + merchantId;
        } else {
            alert(data.msg);
        }
    }, "json");
}

//删除多个
function delMore(postData) {
    $.post("deleteMoreOrderInfo.jsx", postData, function (data) {
        if (data.code == "0") {
            alert(data.msg);
            window.location.href = "getOrderInfo.jsx?gradeId=" + gradeId + "&columnId=" + columnId + "&type=" + type + "&m=" + merchantId;
        } else {
            alert(data.msg);
        }
    }, "json");
}

//获取href参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}





