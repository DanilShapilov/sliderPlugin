import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import './style.scss'
import './interface'
import { SliderModel } from './SliderModel';

// @ts-ignore
window.slider = {};


(function($)  {
  $.fn.sliderPlugin = function(options: object):JQuery {

    // default configuration
    var config: PluginConfig = $.extend({}, {
      from: 0,
      to: 100,
      step: 1,
      current: 0
    }, options);
  
    const view = new SliderView(this, config);
    const presenter = new SliderPresenter();
    const model = new SliderModel();

    // @ts-ignore
    window.slider = {
      view,
      presenter,
      model
    }
    
    
  
    // main function
    // function DoSomething($el: JQuery) {
    //     $($el).html(view.toHTML())
    // }
    

    // initialize every element
    this.each(function() {
      // DoSomething($(this));
      view.init()
    });

    return this;
  };
  
  $(function () {
    if ($(".sliderPlugin").length) {
      $(".sliderPlugin").sliderPlugin();
    }
  })
})(jQuery);