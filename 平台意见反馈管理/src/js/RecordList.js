
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

    var $body = $("body");
    var $record_list = $("#record_list");

    //弹出修改框并显示详情
    $record_list.on('click', ".doUpdate", function () {
        var $this = $(this);
        globalSetMerchantId = $this.attr("data-a");
        var postData={
            id : globalSetMerchantId
        };

        $.post("detail_edit.jsx",postData,function (data) {
            $("#doUpdateRecord_form_title").val(data.title);
            $("#doUpdateRecord_form_content").val(data.content);
            $("#doUpdateRecord_form_contact").val(data.contact);
            $("#recordState").val(data.state);
        },"json");

        $('#doUpdateStateModal').modal('show');
    });

    // 删除单个数据
    $record_list.on('click', ".delete", function () {
        var $this = $(this);
        var id = $this.attr("data-a");
        var postData={
            recordId:id
        };

        //弹框提示（要应用bootbox.min.js）
        bootbox.confirm("确定删除吗？",function(result){
            if(result){
                del(postData);
            }
        });
        return false;//这句不能少

    });

    //删除数据函数
    function del(postData){
        $.post("delete_record.jsx", postData, function (data) {
            if(data.code == "0"){
                pagination.load(null);
            } else {
                alert(data.msg);
            }
        }, "json");
    };

    //全选
    $body.on('click','#selectAll',function () {
        if ($(this).is(":checked")) {
            $("[name=test]:checkbox").prop("checked", true);
        } else {
            $("[name=test]:checkbox").prop("checked", false);
        }
    });

    //多选删除
    $('#deleteChecked').click(function () {
        var ids=[];
        $("input[name='test']:checked").each(function() { // 遍历选中的checkbox
            /*var n = $(this).parents("tr").index();  // 获取checkbox所在行的顺序
            $("table#test_table").find("tr:eq("+n+")").remove();*/
            var $this = $(this);
            var id = $this.attr("data-a");
            ids.push(id);
        });
        var postData={
            ids:JSON.stringify(ids)
        }

        //弹框提示（要应用bootbox.min.js）
        bootbox.confirm("确定删除吗？",function(result){
            if(result){
                del(postData);
            }
        });
        return false;//这句不能少
    });

    //修改数据
    $body.on('click', "#updateStateBtn", function () {
        var recordTitle = $("#doUpdateRecord_form_title").val();
        var recordContent = $("#doUpdateRecord_form_content").val();
        var recordContact = $("#doUpdateRecord_form_contact").val();
        var recordState = $("#recordState").val();
        var postData = {};
        postData.m = merchantId;
        postData.id = globalSetMerchantId;
        postData.state = recordState;
        postData.title = recordTitle;
        postData.content = recordContent;
        postData.contact = recordContact;

        $.post("RecordUpdateState.jsx", postData, function (data) {
            if(data.code == "0"){
                $('#doUpdateStateModal').modal('hide');
                pagination.load(null);
            } else {
                alert(data.msg);
            }
        }, "json");

    });

    $body.on('click', "#cancelStateBtn", function () {
        $('#doUpdateStateModal').modal('hide');
    });

    $body.on('click', "#search", function () {
        var keyword = $.trim($("#keyword").val());
        var searchArgs = {};
        if (keyword != "") {
            searchArgs.keyword = keyword;
        }
        searchArgs.m = merchantId;
        pagination.load(searchArgs);
    });

    //打开添加数据对话框
    $body.on('click', "#addObj", function () {
        $('#add_recordModal').modal('show');

    });

    //提交数据
    $body.on('click', "#add_record", function () {

        var testObj={};

        testObj.title=$('#addRecord_form_title').val();
        testObj.content=$('#addRecord_form_content').val();
        testObj.contact=$('#addRecord_form_contact').val();

        $.post("add_record.jsx", testObj, function (data) {
            if(data.code == "0"){
                $('#add_recordModal').modal('hide');
                pagination.load(null);
            } else {
                alert(data.msg);
            }
        }, "json");
    });


});
