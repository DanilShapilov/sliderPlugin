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
  current: [0],
  snapping: false,
  class: '',
  selectRange: false,
  vertical: false,
  progressBar: true
};


(function($)  {
  $.fn.sliderPlugin = function(options: PluginConfig = defaultConfig):JQuery {   
    // default configuration
    options = {
      ...options,
      current: Array.isArray(options.current) ? options.current : [0]
    }
    
    let config: PluginConfig = $.extend({}, defaultConfig, options);

    // // проверка шага
    // if ( (config.step % 1) !== 0 || typeof config.step !== 'number') {
    //   throw new Error(`
    //   SliderPlugin: step should be type of number, and  an integer
    //     The element is:
    //       class: ${this[0].className}
    //       id:${this[0].id}
    //   `);
    // }

    // // проверка куррента(индекс)
    // if (config.current > config.range.length - 1 || config.current < 0) {
    //   throw new Error(`
    //   SliderPlugin: your current option:'${config.current}' not exists in range array,
    //    your range array has ${config.range.length} elements, so the last index is ${config.range.length - 1}
    //    The element is:
    //     class: ${this[0].className}
    //     id:${this[0].id}
    //    `);
    // }
    
    // main function
    // function DoSomething($el: JQuery) {
    //     $($el).html(view.toHTML())
    // }
    

    // initialize every element
    this.each(function() {
      const stateForView = {
        class: `${config.class} ${config.vertical ? 'vertical': ''}`, 
        snapping: config.snapping,
        selectRange: config.selectRange,
        vertical: config.vertical,
        progressBar: config.progressBar
      }
      const view = new SliderView($(this), stateForView);
      const model = new SliderModel(config);
      const presenter = new SliderPresenter(model, view);
  
      // @ts-ignore
      window.sliders.push({
        view,
        presenter,
        model
      })
    });

    return this;
  };
  
  $(function () {
    if ($(".sliderPlugin").length) {
      $(".sliderPlugin").sliderPlugin();
    }
  })
})(jQuery);