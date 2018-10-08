/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-03-10 14:42:25
 * @version $Id$
 */

$(function(){

	//flash
	$('.vf1').unslider({
		speed: 500,               //  The speed to animate each slide (in milliseconds)
		delay: 3000,			  //  The delay between slide animations (in milliseconds)
		dots: true,				  //  Display dot navigation
		fluid: true
	});

	$('.vf2,.vf3').unslider({
		speed: 500,
		delay: 3000,
		dots: true,
		fluid: false
	});

	// 服饰tabs切换
	$('.f-tabs li').on('mouseover', function(event) {
		var i = $(this).index();
		var len = $(this).parent().find('li').length;
		if (i == len-1) {
			$(this).addClass('cur').parent().addClass('nomr').end().siblings().removeClass('cur');
		}else{
			$(this).addClass('cur').parent().removeClass('nomr').end().siblings().removeClass('cur');
		}
		$(this).parents('.floorBox').find('.floorMain').hide().eq(i).show();
	})

	var greyImg = $("#greyImg").attr("src");
	$("img[original]").lazyload({
		placeholder:greyImg,
		failurelimit: 10,
		effect: "fadeIn",
		threshold : 200
	});
	
})