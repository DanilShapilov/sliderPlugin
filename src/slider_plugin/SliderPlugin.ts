import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import './style.scss'
import './interfaces'
import { SliderModel } from './SliderModel';
import { generateRangeArr } from './helpers';

// @ts-ignore
window.slider = {};

const defaultConfig: PluginConfig = {
  range: [0, 100],
  step: 1,
  current: 0
};


(function($)  {
  $.fn.sliderPlugin = function(options: PluginConfig = defaultConfig):JQuery {   

    options = {
      ...options,
      range: options.range !== undefined ? generateRangeArr(options.range) : defaultConfig.range
    }
    // default configuration
    let config: PluginConfig = $.extend({}, defaultConfig, options);
  
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