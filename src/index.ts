import './slider_plugin/interfaces'

import { sliderPlugin } from './slider_plugin/SliderPlugin'

const defaultConfig: PluginConfig = {
    range: [0, 100],
    generateValues: true,
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
        class: `${options.class ?? ''}`,
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

