(function (x,wn) {
    x(function () {
        wn.JigsawValidateUtil=new function() {
            var t=this
            (function () {
                var _t=t;
                x.ajax({
                    url: '/JigsawValidateUtilPlugin/pages/JigsawValidateUtil_inlay.jsx',
                    dataType: 'html',
                    success: function (data) {
                        x('#JigsawValidateUtilDiv').html(data)
                        _t.sr();
                    }
                });

            })();
            t.success=function (callback) {
                callback && "function" == typeof callback && (t.callback = callback)
            }
            t.sr=function () {
                var _t = t;
                _t.st = 'INIT';
                _t.at = 'INIT';
                _t.iI();
                _t.iMt();
                _t.iB();
                _t.iId();
                _t.mx = 0;
                _t.mm = x('#JigsawValidateUtil_slide_bar').width() - x('#JigsawValidateUtil_slideBtn').width();
                _t.mm = parseInt(_t.mm);
                var xbody = x("body");
                x(".JigsawValidateUtil_slide_code").hover(_t.si,_t.hi);
                xbody.on('dblclick', "#JigsawValidateUtil_backgroundImg", _t, function () {
                    _t.iI();
                    _t.iId();
                    _t.iB();
                    _t.iMt();
                });
                xbody.on('mousedown', '#JigsawValidateUtil_slideBtn', {_t: _t}, function (event) {
                    var _t = event.data._t;
                    _t.mx = 0;
                    if (_t.st == "success" || _t.at != "INIT") {
                        return;
                    }
                    _t.at = "DOWN";
                    event.preventDefault();
                    var initX = event.clientX;
                    _t.bB();
                    x(document).on('mousemove', {initX: initX, _t: _t}, _t.mv);
                    x(document).on('mouseup', {_t: _t}, _t.u)
                });
            }

            t.mv = function (event) {
                var _t = event.data._t;
                if (!_t.at == "DOWN") {
                    return
                }
                _t.at = "MOVE";
                _t.mx = event.clientX - event.data.initX;
                x('#JigsawValidateUtil_slideBtn').off('mouseover').off('mouseout');
                x(".JigsawValidateUtil_slide_code").off('mouseenter').off('mouseleave')
                if (_t.mx < 0) {
                    _t.iId();
                    _t.iB();
                    _t.iMt()
                } else if (_t.mx >= 0 && _t.mx <= _t.mm) {
                    _t.bB();
                    x('#JigsawValidateUtil_mattingImg').css('left', _t.mx + 'px');
                    x('#JigsawValidateUtil_slide_indicator').css('border', '1px solid #1991fa');
                    x('#JigsawValidateUtil_slide_indicator').css('width', _t.mx + x('#JigsawValidateUtil_slideBtn').width() + "px");
                    x('#JigsawValidateUtil_slideBtn').css('left', _t.mx + 'px');
                } else {
                    x('#JigsawValidateUtil_mattingImg').css('left', _t.mm + 'px');
                    x('#JigsawValidateUtil_slide_indicator').css('border', '1px solid #1991fa');
                    x('#JigsawValidateUtil_slide_indicator').css('width', _t.mm + x('#JigsawValidateUtil_slideBtn').width() + 'px');
                    x('#JigsawValidateUtil_slideBtn').css('left', _t.mm + "px");
                }
            };

            t.u = function (event) {
                var _t = event.data._t;
                if (!_t.at == "MOVE") {
                    return;
                }
                _t.at = "UP";
                x(document).off('mousemove');
                x(document).off('mouseup');
                x(".JigsawValidateUtil_slide_code").hover(_t.si,_t.hi);
                _t.cm();
                _t.at = "INIT"
            };

            t.iI = function () {
                var _t = t;
                _t.st = "INIT";
                x.post("/JigsawValidateUtilPlugin/handler/gi.jsx", {}, function (result) {
                    if (result.code == "0") {
                        var bgFilePath = result.bgFilePath;
                        var mattingFilePath = result.mattingFilePath;
                        x('#JigsawValidateUtil_mattingImg').attr('src', mattingFilePath);
                        x('#JigsawValidateUtil_backgroundImg').attr('src', bgFilePath);
                    } else {
                        alert(result.msg);
                    }
                }, "json");
            };

            t.cm = function () {
                var _t = t;
                var postData={
                    mx:_t.mx,
                    iw:x('#JigsawValidateUtil_backgroundImg').width()
                }
                x.post("/JigsawValidateUtilPlugin/handler/cm.jsx",postData,function(response){
                    if(response.code=='S0A00000'){
                        _t.rId();
                        _t.hi();
                        x(".JigsawValidateUtil_slide_code").off('mouseenter').off('mouseleave');
                        t.callback && t.callback();
                    }else{
                        _t.wId();
                        setTimeout(function () {
                            x('#JigsawValidateUtil_mattingImg').animate({
                                left: '0'
                            }, 200);
                            x('#JigsawValidateUtil_slideBtn').animate({
                                left: '0'
                            }, 200);
                            x('#JigsawValidateUtil_slideBtn').css("background-color", "#ffffff");
                            x("#JigsawValidateUtil_slide_icon").css("background-position", "0px -26px");
                            x('#JigsawValidateUtil_slideBtn').on('mouseover', _t.bB);
                            x('#JigsawValidateUtil_slideBtn').on('mouseout', _t.wB);
                            x('#JigsawValidateUtil_slide_indicator').animate({
                                width: '0px'
                            }, 200);
                            x('#JigsawValidateUtil_slide_indicator').css("background-color", "#d1e9fe");
                            x('#JigsawValidateUtil_slide_indicator').css("border", "1px solid transparent");
                            _t.iI();
                        }, 500)
                    }
                },'json')
            };

            t.iMt = function () {
                x('#JigsawValidateUtil_mattingImg').css('left', '0px')
            };

            t.iB = function () {
                var _t = t;
                x('#JigsawValidateUtil_slideBtn').css('left', '0px');
                x('#JigsawValidateUtil_slideBtn').css('background-color', '#ffffff');
                x("#JigsawValidateUtil_slide_icon").css("background-position", "0px -26px");
                x('#JigsawValidateUtil_slideBtn').on('mouseover', _t.bB);
                x('#JigsawValidateUtil_slideBtn').on('mouseout', _t.wB);
            };

            t.iId = function () {
                x('#JigsawValidateUtil_slide_indicator').css('width', '0px');
                x('#JigsawValidateUtil_slide_indicator').css('border', '1px solid transparent');
                x('#JigsawValidateUtil_slide_indicator').css('background-color', '#d1e9fe');
            };

            t.wId = function () {
                var _t = t;
                _t.st = "FAIL";
                x("#JigsawValidateUtil_slide_icon").css("background-position", "0px -83px");
                x('#JigsawValidateUtil_slide_indicator').css('background-color', '#fce1e1');
                x('#JigsawValidateUtil_slide_indicator').css('border-color', '#f57a7a');
                x('#JigsawValidateUtil_slideBtn').css('background-color', '#f57a7a')
            }

            t.rId = function () {
                t.st = "success";
                x("#JigsawValidateUtil_slide_icon").css("background-position", "0px 0px");
                x('#JigsawValidateUtil_slide_indicator').css('background-color', '#d2f4ef');
                x('#JigsawValidateUtil_slide_indicator').css('border-color', '#52ccba');
                x('#JigsawValidateUtil_slideBtn').css('background-color', '#52ccba')
            };

            t.wB = function () {
                x('#JigsawValidateUtil_slideBtn').css('background-color', '#fff');
                x('.JigsawValidateUtil_slideBtn span').css('background-position', '0 -26px')
            };

            t.bB = function () {
                x('#JigsawValidateUtil_slideBtn').css('background-color', '#1991fa');
                x('.JigsawValidateUtil_slideBtn span').css('background-position', '0 -13px')
            };
            t.si=function() {
                x('.JigsawValidateUtil_slide-image-img').css({'display':'block','bottom':'15px'})
            }
            t.hi=function() {
                x('.JigsawValidateUtil_slide-image-img').css({'display':'none','bottom':'0px'})
            }
        }
    });
})($,window)



