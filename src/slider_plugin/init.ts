import { SliderView } from './SliderView'
import './style.scss'
import './interface'


(function($)  {
	$.fn.sliderPlugin = function(options: object):JQuery {
  
    const view = new SliderView();

		// default configuration
		var config = $.extend({}, {
			opt1: null
		}, options);
	
		// main function
		function DoSomething($el: JQuery) {
      $($el).html(view.render())
    }
    console.log('Из слайдера',this);
    

		// initialize every element
		this.each(function() {
			DoSomething($(this));
		});

		return this;
  };
  
  $(function () {
    $(".sliderPlugin").sliderPlugin();
  })
})(jQuery);