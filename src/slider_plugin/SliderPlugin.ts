import { SliderView } from './SliderView'
import './style.scss'
import './interface'

// @ts-ignore
window.slider = {};

(function($)  {
	$.fn.sliderPlugin = function(options: object):JQuery {
  
    const view = new SliderView();
    //@ts-ignore
    window.slider['view'] = view
    
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