var globalSetMerchantId;
$(document).ready(function () {

    var initconfig = {
        bsV: "3",
        ajaxUrl: "load_activity.jsx",
        data_container: ".record_list",
        pagination_container: ".pagination",
        pagination_params: ".pagination_params"
    };
    var pagination = new $.IsoneAjaxPagination(initconfig);
    pagination.load({m: merchantId});

    bootbox.setDefaults("locale","zh_CN");//bootbox设置为中文

    var $body = $("body");
    var $record_list = $("#record_list");


    //打开添加数据对话框
    $body.on('click', "#addObj", function () {
        $('#add_recordModal').modal('show');
    });

    //提交前校验
    $body.on('click', "#add_record", function () {
        var obj={
            "columnId" : $('#columnId').val().replace(/\s/g, ""),
            "gradeId" : $('#gradeId').val().replace(/\s/g, "")
        };

        add(obj);

    });

    // 删除单条
    $body.on('click', ".delete", function () {
        var $this = $(this);
        var id = $this.attr("data-a");
        var postData={
            id:id
        };

        //弹框提示（需引用bootbox.min.js）
        bootbox.confirm("确定删除吗？",function(result){
            if(result){
                del(postData);
            }
        });
        return false;

    });


});

 //添加函数
 function add(postData) {
     $.post("add_jExport.jsx", postData, function (data) {
         if(data.code == "0"){
             $('#add_recordModal').modal('hide');
             alert(data.msg);
             window.location.href = "jExportList.jsx?m="+merchantId;
         } else {
             alert(data.msg);
         }
     }, "json");
 }

 //删除函数
 function del(postData){
     $.post("delete_jExport.jsx", postData, function (data) {
         if(data.code == "0"){
             alert(data.msg);
             window.location.href = "jExportList.jsx?m="+merchantId
         } else {
             alert(data.msg);
         }
     }, "json");
 }





