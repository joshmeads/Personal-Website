$(function () {
	noJs();
	headerImgLoad();
	headerForm();
	bioSlide();
	testimonials();
});


function noJs() {

	$("#head-btn, #testimonials-slider-controls").removeClass('no-display');

	setTimeout(function () {
		$("#head-form, #bio-expand").removeClass('no-display');
	}, 500)

}



function headerImgLoad() {
	var $headerOverlay 	= $("#header-overlay");

	$('<img/>').attr('src', 'img/jpg-sprite.jpg').load(function() {
		$(this).remove();
		$headerOverlay.addClass('header-img')
	});
}



function headerForm() {
	var	$headBtn		= $("#head-btn"),
		$headForm 		= $("#head-form"),
		$headFormClose	= $("#head-form-x, #head-form-close");

		$headBtn.on('click', isVisible);

		$(document).keyup(function(event) {
			if(event.which=='27') {
				isNotVisible();
			}
		});

		$headForm.on('click', function(event){
			if( $(event.target).is($headForm) || $(event.target).is($headFormClose) ) {
				isNotVisible();
			}
		});

		function isVisible () {
			$headForm.addClass('is-visible');
		}

		function isNotVisible () {
			$headForm.removeClass('is-visible');
		}
}



function bioSlide() {
	var $bioCtrl	= $("#bio-open, #bio-close"),
		$bioOpen	= $("#bio-open"),
		$bioClose	= $("#bio-close"),
		$bioExpand	= $("#bio-expand");

		$bioCtrl.on('click', toggleSlide);
		$bioClose.on('click', fadeText);

		function toggleSlide () {
			$bioExpand.slideToggle('slow');
			$bioOpen.addClass('not-visible');
		}

		function fadeText () {
			$bioOpen.removeClass('not-visible').addClass('fadeIn');
			setTimeout(function () {
				$bioOpen.removeClass('fadeIn');
			}, 2000)
		}
}



function testimonials() {
	var $slide 				= $("#testimonials-slide"),
		$slider 			= $("#testimonials-slider"),
		$ctrlLeft			= $("#testimonials-control-left"),
		$ctrlRight			= $("#testimonials-control-right"),
		$ctrlBtns			= $("#testimonials-control-right, #testimonials-control-left");

		$('.testimonials-nojs').removeClass('testimonials-nojs');
		$slide.first().addClass('active-testimonial');

		$ctrlBtns.on('click', function() {
			var $this 		= $(this),
				$active 	= $slider.find(".active-testimonial"),
				$index		= $slider.children().index($active),
				$slideNum	= $slide.length;

				if ($this.is($ctrlRight)) {
					if ($index < $slideNum +1) {
						$(".active-testimonial").removeClass('active-testimonial').next().addClass('active-testimonial');
					} else {
						$(".testimonials-slide").removeClass('active-testimonial').first().addClass('active-testimonial');
					}

				} else {

					if ($index === 0) {
						$(".testimonials-slide").removeClass('active-testimonial').last().addClass('active-testimonial');				
					} else {
						$(".active-testimonial").removeClass('active-testimonial').prev().addClass('active-testimonial');
					}

				};

		});






}

















