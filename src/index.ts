import './index.scss';
import './slider_plugin/interfaces'

import { sliderPlugin } from './slider_plugin/SliderPlugin'

const defaultConfig: PluginConfig = {
    range: [0, 100],
    step: 1,
    current: [0],
    snapping: false,
    class: '',
    selectRange: false,
    vertical: false,
    progressBar: true,
    showSelected: 'always',
  
    showScale: false,
    scaleStep: 1,
    scaleHighlighting: true
  };
  
  
  (function($)  {
    $.fn.sliderPlugin = function(options: PluginConfig = defaultConfig):JQuery {   
      // default configuration
      options = {
        ...options,
        class: `${options.class ?? ''} ${options.vertical ? 'vertical': ''}`,
        current: Array.isArray(options.current) ? options.current : [0]
      }
      
      let config: PluginConfig = $.extend({}, defaultConfig, options);
  
      return this.each(function() {
        if ( !$.data(this, 'sliderPlugin') ) {
            $.data(this, 'sliderPlugin', new sliderPlugin(this, config))
        }
      });
    };
    
    $(function () {
      if ($(".sliderPlugin").length) {
        $(".sliderPlugin").sliderPlugin();
      }
    })
  })(jQuery);


$(".sliderPlugin1").sliderPlugin({
    range: [-100, 100],
    current: [6, 12],
    step: 10,
    snapping: true,
    selectRange: true,
    vertical: true,
    progressBar: false,
    showSelected: 'hover',
    showScale: true,
    scaleStep: 5
})

$(".sliderPlugin2").sliderPlugin({
    range: ['А', 'я'],
    current: [7, 42],
    snapping: true,
    selectRange: true,
    vertical: true
})

$(".sliderPlugin3").sliderPlugin({
    range: ['A', 'z'],
    snapping: true,
    current: [0,6],
    selectRange: true,
    showScale: true,
    scaleStep: 3
})

$(".sliderPlugin4").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    current: [2, 5],
    selectRange: true,
    showScale: true,
    step: 10
})

$(".sliderPlugin5").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    current: [2, 5],
    selectRange: true,
    showScale: true,
    scaleHighlighting: false,
    step: 10
})

$(".sliderPlugin6").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6, 7],
    current: [0],
    snapping: true,
    showScale: true,
    scaleStep: 0
})