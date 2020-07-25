import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import './style.scss'
import './interfaces'
import { SliderModel } from './SliderModel';
import { generateRangeArr } from './helpers';

// @ts-ignore
window.sliders = [];

const defaultConfig: PluginConfig = {
  range: [0, 100],
  step: 1,
  current: 0,
  snapping: false
};


(function($)  {
  $.fn.sliderPlugin = function(options: PluginConfig = defaultConfig):JQuery {   

    options = {
      ...options,
      range: options.range !== undefined ? generateRangeArr(options.range) : generateRangeArr(defaultConfig.range)
    }
    // default configuration
    let config: PluginConfig = $.extend({}, defaultConfig, options);

    // проверка куррента(индекс)
    if (config.current > config.range.length - 1 || config.current < 0) {
      throw new Error(`
      SliderPlugin: your current option:'${config.current}' not exists in range array,
       your range array has ${config.range.length} elements, so the last index is ${config.range.length - 1}
       The element is:
        class: ${this[0].className}
        id:${this[0].id}
       `);
    }
    
    // main function
    // function DoSomething($el: JQuery) {
    //     $($el).html(view.toHTML())
    // }
    

    // initialize every element
    this.each(function() {
      const view = new SliderView($(this), config);
      const presenter = new SliderPresenter();
      const model = new SliderModel();
  
      // @ts-ignore
      window.sliders.push({
        view,
        presenter,
        model
      })
      


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