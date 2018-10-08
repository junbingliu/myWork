 $(function () {

    var url = '/resources/plugin/JigsawValidateUtil/JigsawValidateUtil.text';

    $.ajax({
        url: url,
        dataType: 'text',
        success: function (data) {
            $('body').children(':last').after(data);
        }
    });

    function JigsawValidateUtil(obj) {
        if (!(this instanceof JigsawValidateUtil)) return new JigsawValidateUtil(obj);
        this.option = {
            postUrl: obj.postUrl || '',
            getImgUrl: obj.getImgUrl || '',
            httpStyle: obj.httpStyle,
            success: typeof obj.success == 'function' ? obj.success : function () {
            }
        };
        this.moveSuccess = this.option.success;
    }

    var _proto = JigsawValidateUtil.prototype;

    _proto.init = function (postData) {
        var _this = this;
        if (_this.state == "success") return;
        this.state = 'INIT';
        this.action = 'INIT';
        this.postData = postData;
        _this.initImg();
        _this.initMatt();
        _this.initSlideBtn();
        _this.initIndicator();

        this.moveX = 0;
        this.maxMove = $('#JigsawValidateUtil_slide_bar').width() - $('#JigsawValidateUtil_slideBtn').width();
        this.maxMove = parseInt(this.maxMove);

        var $body = $("body");

        $body.on('dblclick', "#JigsawValidateUtil_backgroundImg", _this, function () {
            // if(_this.state=="success")return;
            _this.initImg();
            _this.initIndicator();
            _this.initSlideBtn();
            _this.initMatt();
        });

        $body.on('mousedown', '#JigsawValidateUtil_slideBtn', {_this: _this}, function (event) {
            var _this = event.data._this;
            _this.moveX = 0;
            if (_this.state == "success" || _this.action != "INIT") {
                return;
            }
            _this.action = "DOWN";
            event.preventDefault();
            var initX = event.clientX;

            _this.blueBtn();
            $(document).on('mousemove', {initX: initX, _this: _this}, _this.move);
            $(document).on('mouseup', {_this: _this}, _this.up)
        });
        $body.on('click', '.JigsawValidateUtil_TB_overlayBG', _this.hide);
        $body.on('click', '.JigsawValidateUtil_TB_window .JigsawValidateUtil_close', _this.hide)
    };

    _proto.move = function (event) {
        var _this = event.data._this;
        if (!_this.action == "DOWN") {
            return
        }
        _this.action = "MOVE";
        _this.moveX = event.clientX - event.data.initX;
        $('#JigsawValidateUtil_slideBtn').off('mouseover').off('mouseout');
        if (_this.moveX < 0) {
            _this.initIndicator();
            _this.initSlideBtn();
            _this.initMatt()
        } else if (_this.moveX >= 0 && _this.moveX <= _this.maxMove) {
            _this.blueBtn();
            $('#JigsawValidateUtil_mattingImg').css('left', _this.moveX + 'px');
            $('#JigsawValidateUtil_slide_indicator').css('border', '1px solid #1991fa');
            $('#JigsawValidateUtil_slide_indicator').css('width', _this.moveX + $('#JigsawValidateUtil_slideBtn').width() + "px");
            $('#JigsawValidateUtil_slideBtn').css('left', _this.moveX + 'px');
        } else {
            $('#JigsawValidateUtil_mattingImg').css('left', _this.maxMove + 'px');
            $('#JigsawValidateUtil_slide_indicator').css('border', '1px solid #1991fa');
            $('#JigsawValidateUtil_slide_indicator').css('width', _this.maxMove + $('#JigsawValidateUtil_slideBtn').width() + 'px');
            $('#JigsawValidateUtil_slideBtn').css('left', _this.maxMove + "px");
        }
    };

    _proto.up = function (event) {
        var _this = event.data._this;
        if (!_this.action == "MOVE") {
            return;
        }
        _this.action = "UP";
        $(document).off('mousemove');
        $(document).off('mouseup');

        _this.postData.moveX = encrypt(_this.moveX, kkV, iI);
        _this.postData.boxWidth = encrypt($('#JigsawValidateUtil_slide_bar').width(), kkV, iI);
        _this.checkMove(_this.postData);
        _this.action = "INIT"
    };

    _proto.initImg = function () {
        var _this = this;
        _this.state = "INIT";
        var postData = {};
        postData.ac = encrypt(acV, kkV, iI);
        $.post(_this.option.getImgUrl, postData, function (result) {
            if (result.code == "0") {
                var bgFilePath = result.bgFilePath;
                var mattingFilePath = result.mattingFilePath;
                $('#JigsawValidateUtil_mattingImg').attr('src', mattingFilePath);
                $('#JigsawValidateUtil_backgroundImg').attr('src', bgFilePath);

                $('.JigsawValidateUtil_TB_overlayBG').css('z-index', '999');
                $('.JigsawValidateUtil_TB_overlayBG').fadeIn(500);
                $('.JigsawValidateUtil_TB_window').fadeIn();
            } else {
                alert(result.msg);
            }
        }, "json");
    };

    _proto.checkMove = function (postData) {
        var _this = this;
        window.alert = function (e) {
            $('.JigsawValidateUtil_alert_text').text(e)
            $('.JigsawValidateUtil_alert_window').show();
            $('.JigsawValidateUtil_alert_close').click(function () {
                $('.JigsawValidateUtil_alert_window').hide();
            })
            $('.JigsawValidateUtil_alert_bnt').click(function () {
                $('.JigsawValidateUtil_alert_window').hide();
            })
        }
        $.ajax({
            url: _this.option.postUrl,
            type: _this.option.httpStyle,
            data: postData,
            async:false,
            dataType: 'json',
            success: function (resp) {
                if (resp.result && resp.result.code=='0') {
                    //位移正确
                    _this.rightIndicator();
                    setTimeout(function () {
                        _this.hide();//收起弹窗
                    },1000)

                    setTimeout(function () {
                        _this.moveSuccess(resp);
                    })

                } else {
                    //位移错误
                    _this.wrongIndicator();
                    setTimeout(function () {
                        $('#JigsawValidateUtil_mattingImg').animate({
                            left: '0'
                        }, 200);
                        $('#JigsawValidateUtil_slideBtn').animate({
                            left: '0'
                        }, 200);
                        $('#JigsawValidateUtil_slideBtn').css("background-color", "#ffffff");
                        $("#JigsawValidateUtil_slide_icon").css("background-position", "0px -26px");
                        //初始化移入移出效果
                        $('#JigsawValidateUtil_slideBtn').on('mouseover', _this.blueBtn);
                        $('#JigsawValidateUtil_slideBtn').on('mouseout', _this.whiteBtn);
                        $('#JigsawValidateUtil_slide_indicator').animate({
                            width: '0px'
                        }, 200);
                        $('#JigsawValidateUtil_slide_indicator').css("background-color", "#d1e9fe");
                        $('#JigsawValidateUtil_slide_indicator').css("border", "1px solid transparent");
                        _this.initImg();
                    }, 500)

                }
            }
        })
    };

    _proto.initMatt = function () {
        $('#JigsawValidateUtil_mattingImg').css('left', '0px')
    };

    _proto.initSlideBtn = function () {
        var _this = this;
        //初始化位置
        $('#JigsawValidateUtil_slideBtn').css('left', '0px');
        $('#JigsawValidateUtil_slideBtn').css('background-color', '#ffffff');
        $("#JigsawValidateUtil_slide_icon").css("background-position", "0px -26px");
        //初始化移入移出效果
        $('#JigsawValidateUtil_slideBtn').on('mouseover', _this.blueBtn);
        $('#JigsawValidateUtil_slideBtn').on('mouseout', _this.whiteBtn);
    };

    _proto.initIndicator = function () {
        $('#JigsawValidateUtil_slide_indicator').css('width', '0px');
        $('#JigsawValidateUtil_slide_indicator').css('border', '1px solid transparent');
        $('#JigsawValidateUtil_slide_indicator').css('background-color', '#d1e9fe');
    };

    _proto.wrongIndicator = function () {
        var _this = this;
        _this.state = "FAIL";
        $("#JigsawValidateUtil_slide_icon").css("background-position", "0px -83px");
        $('#JigsawValidateUtil_slide_indicator').css('background-color', '#fce1e1');
        $('#JigsawValidateUtil_slide_indicator').css('border-color', '#f57a7a');
        $('#JigsawValidateUtil_slideBtn').css('background-color', '#f57a7a')
    }

    _proto.rightIndicator = function () {
        var _this = this;
        _this.state = "success";
        $("#JigsawValidateUtil_slide_icon").css("background-position", "0px 0px");
        $('#JigsawValidateUtil_slide_indicator').css('background-color', '#d2f4ef');
        $('#JigsawValidateUtil_slide_indicator').css('border-color', '#52ccba');
        $('#JigsawValidateUtil_slideBtn').css('background-color', '#52ccba')
    };

    _proto.whiteBtn = function () {
        $('#JigsawValidateUtil_slideBtn').css('background-color', '#fff');
        $('.JigsawValidateUtil_slideBtn span').css('background-position', '0 -26px')
    };

    _proto.blueBtn = function () {
        $('#JigsawValidateUtil_slideBtn').css('background-color', '#1991fa');
        $('.JigsawValidateUtil_slideBtn span').css('background-position', '0 -13px')
    };

    _proto.show = function (postData) {
        this.init(postData);
    };
    _proto.hide = function () {
        $('.JigsawValidateUtil_TB_overlayBG').fadeOut(1000);
        $('.JigsawValidateUtil_TB_window').fadeOut(1000);
    };
    window.JigsawValidateUtil = JigsawValidateUtil;
});

