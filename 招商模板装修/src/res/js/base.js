/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-03-15 10:40:01
 * @version $Id$
 */
$(function(){
	//菜单弹出
	$('.subMenu dl').hover(function(){
		var layer = $(this).find('.sortLayer');
		if (layer.length) {
			$(this).prev().find('.m-mark').stop().animate({'width': 200}, 300);
			$(this).addClass('active').find('.m-mark').stop().animate({'padding-left': 20}, 300).siblings('.sortLayer').fadeIn();
		};

	},function(){
		var layer = $(this).find('.sortLayer');
		if (layer.length) {
			$(this).prev().find('.m-mark').stop().animate({'width': 181}, 300);
			$(this).removeClass('active').find('.m-mark').stop().animate({'padding-left': 0}, 300).siblings('.sortLayer').fadeOut().end();
		};
	})

	//产品经过显示按钮
	$('.floorBox .list').hover(function(){
		$(this).addClass('active').find('.scroll-box').stop().animate({marginTop : -46,opacity : .6},500);
	},function(){
		$(this).removeClass('active').find('.scroll-box').stop().animate({marginTop : 0,opacity : 1},500);
	})

	// 搜索向右展开
	$('.searchCty .searchBox').hover(function() {
		$(this).find('.searchVal').stop().animate({width : 308}, 500);
	}, function() {
		$(this).find('.searchVal').stop().animate({width : 0}, 500);
	});


})
