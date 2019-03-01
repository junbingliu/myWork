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

    $("input.date").datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: true,
        startView: 2,
        forceParse: true,
        showMeridian: false,
        minuteStep: 5,
        minView:2
    });

    //兑换码
    $record_list.on('click', ".redeem", function () {
        var $this = $(this);
        var activityId=$this.attr("data-a")
        window.location.href="redeemCodeList.jsx?m="+merchantId+"&activityId="+activityId;
    });

    //活动详情
    $record_list.on('click', ".doUpdate", function () {
        var $this = $(this);
        var postData={
            id : $this.attr("data-a")
        };
        $('#updateId').val(postData.id)
        $.post("activity_detail.jsx",postData,function (res) {
            if(res.code == "0"){
                var data=res.data||{};
                $("#update_title").val(data.title);
                $("#update_disc").val(data.disc);
                $("#update_startDate").val(data.startDate);
                $("#update_endDate").val(data.endDate);
                $("#update_shareTitle").val(data.shareTitle);
                $("#update_shareDisc").val(data.shareDisc);
                $("#update_shareLink").val(data.shareLink);
                $("#edit_detailImage").val(data.shareImg);

                if(data.imgUrl==''){
                    $("#edit_previewImage").attr('src','/upload/nopic_200.jpg');
                }else{
                    $("#edit_previewImage").attr('src',data.imgUrl);
                }
                $('#doUpdateStateModal').modal('show');
            } else {
                alert(res.msg);
            }

        },"json");
    });

    //发布活动
    $record_list.on('click', ".publish", function () {
        var $this = $(this);
        var post={
            id : $this.attr("data-a")
        }
        bootbox.confirm("确定要发布吗？",function(result){
            if(result){
                $.post("publishActivity.jsx", post, function (data) {
                    if(data.code == "0"){
                        pagination.load(null);
                    } else {
                        alert(data.msg);
                    }
                }, "json");
            }
        });
        return false;
    });

    //删除活动
    $record_list.on('click', ".delete", function () {
        var $this = $(this);
        var post={
            id : $this.attr("data-a")
        }
        bootbox.confirm("确定删除吗？",function(result){
            if(result){
                $.post("deleteActivity.jsx", post, function (data) {
                    if(data.code == "0"){
                        pagination.load(null);
                    } else {
                        alert(data.msg);
                    }
                }, "json");
            }
        });
        return false;
    });

    $("#edit_detailImageSelectBtn").click(function () {
        photoGallery.openSelectImgView(function (item) {
            var imgFileId = item.fileId();
            var imgUrl = item.imgUrl().replace("_100X100", "");
            $("#edit_detailImage").val(imgFileId);
            $("#edit_previewA").attr("href", imgUrl);
            $("#edit_previewImage").attr("src", imgUrl);
        }, false);
    });
    $("#edit_detailImageDeleteBtn").click(function () {
        $("#edit_detailImage").val("");
        $("#edit_previewA").attr("href", "javascript:;");
        $("#edit_previewImage").attr("src", "/upload/nopic_200.jpg");
    });

    //修改活动
    $body.on('click', "#update_activity", function () {
        if (new Date($('#update_startDate').val()).getTime() > new Date($('#update_endDate').val()).getTime()) {
            alert("开始时间不能大于结束时间");
            return;
        }
        var post={
            id:$('#updateId').val(),
            title:$('#update_title').val(),
            disc:$('#update_disc').val(),
            startDate:$('#update_startDate').val(),
            endDate:$('#update_endDate').val(),
            shareTitle:$('#update_shareTitle').val(),
            shareDisc:$('#update_shareDisc').val(),
            shareLink:$('#update_shareLink').val(),
            shareImg:$('#edit_detailImage').val()
        }
        $.post("updateActivity.jsx", post, function (data) {
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

    //搜索
    $body.on('click', "#search", function () {
        var keyword = $.trim($("#keyword").val());
        var searchArgs = {};
        if (keyword != "") {
            searchArgs.keyword = keyword;
        }
        searchArgs.m = merchantId;
        pagination.load(searchArgs);
    });

    $body.on('click', "#addObj", function () {
        $('#add_recordModal').modal('show');

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

    //添加活动
    $body.on('click', "#add_activity", function () {
        if (new Date($('#startDate').val()).getTime() > new Date($('#endDate').val()).getTime()) {
            alert("开始时间不能大于结束时间");
            return;
        }
        var post={
            title:$('#title').val(),
            disc:$('#disc').val(),
            startDate:$('#startDate').val(),
            endDate:$('#endDate').val(),
            shareTitle:$('#shareTitle').val(),
            shareDisc:$('#shareDisc').val(),
            shareLink:$('#shareLink').val(),
            shareImg:$('#detailImage').val()
        }
        $.post("add_activity.jsx", post, function (data) {
            if(data.code == "0"){
                $('#add_recordModal').modal('hide');
                pagination.load(null);
            } else {
                alert(data.msg);
            }
        }, "json");
    });


});
