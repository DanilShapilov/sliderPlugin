import './index.scss';
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
    scaleHighlighting: true,

    subscribers: []
  };
  
  
  (function($)  {
    $.fn.sliderPlugin = function(options: PluginConfig = defaultConfig) {   
      // default configuration
      options = {
        ...options,
        class: `${options.class ?? ''}`,
        current: Array.isArray(options.current) ? options.current : [0]
      }
      
      let config: PluginConfig = $.extend({}, defaultConfig, options);

      let methodsToReturn: object[] = []      
  
      this.each(function() {
        if ( !$.data(this, 'sliderPlugin') ) {
          methodsToReturn.push( $.data(this, 'sliderPlugin', new sliderPlugin(this, config)) )
        }
      });
      
      if (methodsToReturn.length > 1) {
        return methodsToReturn
      }else if (methodsToReturn.length === 1) {
        return methodsToReturn[0]
      }else if (this.length === 1){
        return $(this).data('sliderPlugin')
      }else if (this.length > 1) {
        this.each(function() {
            methodsToReturn.push( $(this).data('sliderPlugin') )
        })
        return methodsToReturn
      }else{
        throw new Error("Looks like selector you provided does not exists");
      }
    };
    
    $(function () {
      if ($(".sliderPlugin").length) {
        $(".sliderPlugin").sliderPlugin();
      }
    })
  })(jQuery);

//@ts-ignore
window.slider1 = $(".sliderPlugin1").sliderPlugin({
    range: [-100, 100],
    current: [6, 12],
    step: 10,
    class: 'sp-skin--material',
    snapping: true,
    selectRange: true,
    vertical: true,
    showSelected: 'hover',
    showScale: true,
    scaleStep: 5
})



$(".sliderPlugin2").sliderPlugin({
    range: ['А', 'я'],
    current: [7, 42],
    class: 'sp-skin--fine-tune-square',
    snapping: true,
    selectRange: true,
    vertical: true,
    showScale: true,
    scaleStep: 7
})

$(".sliderPlugin3").sliderPlugin({
    range: ['A', 'z'],
    class: 'sp-skin--material',
    snapping: true,
    current: [0,6],
    showSelected: 'hover',
    selectRange: true,
    showScale: true,
    scaleStep: 3
})

$(".sliderPlugin4").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    // class: 'sp-skin--material',
    current: [2, 5],
    selectRange: true,
    showScale: true,
    step: 10
})

$(".sliderPlugin5").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    current: [2, 5],
    class: 'sp-skin--fine-tune-square',
    selectRange: true,
    showScale: true,
    scaleHighlighting: false,
    step: 10
})

$(".sliderPlugin6").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6, 7],
    current: [0],
    class: 'sp-skin--toxin',
    snapping: true,
    showScale: true,
    scaleStep: 0
})