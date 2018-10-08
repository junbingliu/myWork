 $(document).ready(function () {

     bootbox.setDefaults("locale","zh_CN");//bootbox设置为中文

    $("#online_btn").on("click", function () {
        var $this = $(this);
        var $online_span = $("#online_span");
        var flag = $this.attr("data-a");
        if (flag == "1") {
            $this.attr("data-a", "0");
            $online_span.removeClass("glyphicon-menu-down");
            $online_span.addClass("glyphicon-menu-up");
        } else {
            $this.attr("data-a", "1");
            $online_span.removeClass("glyphicon-menu-up");
            $online_span.addClass("glyphicon-menu-down");
        }
        $("#online_tab").toggle();

    });

    //打开添加数据对话框
    $("#addObj").on('click',function () {
        $('#add_recordModal').modal('show');
    });

    //提交前校验
    $("#add_record").on('click', function () {

        var OTORelation={
            "name" : $('#OTORelation_name').val(),
            "mid" : $('#OTORelation_mid').val().replace(/\s/g, ""),//去除所有空格符
            "branchcode" : $('#OTORelation_branchcode').val()
        };

        var patt1=/^m_[0-9]*[0-9]$/;//字母加数字不含英文
        var patt2=/^m_.*/;//字母加任何字符
        var patt3=/^m_[a-zA-Z0-9_]*$/;//只能包含字母数字和下划线
        var patt4=/^m_[a-zA-Z0-9]*$/;//只能包含字母数字

        if( ! patt4.test(OTORelation.mid)){
            alert('商家ID必须以"m_"加数字或字母的格式');
            return;
        }

        add(OTORelation);

    });

    // 删除单条
    $("#online_tab").on('click', ".delete", function () {
        var $this = $(this);
        var mid = $this.attr("data-a");
        var postData={
            mid:mid
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
 function add(OTORelation) {
     $.post("saveOTORelation.jsx", OTORelation, function (data) {
         if(data.code == "0"){
             $('#add_recordModal').modal('hide');
             alert(data.msg);
             window.location.href = "OTORelationList.jsx?m=" + merchantId;
         } else {
             alert(data.msg);
         }
     }, "json");
 }

 //删除函数
 function del(postData){
     $.post("deleteOTORelation.jsx", postData, function (data) {
         if(data.code == "0"){
             alert(data.msg);
             window.location.href = "OTORelationList.jsx?m=" + merchantId;
         } else {
             alert(data.msg);
         }
     }, "json");
 }





