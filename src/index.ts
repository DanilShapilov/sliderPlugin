

import '../declarations/index'
import { SliderPlugin } from './slider_plugin/SliderPlugin'
import { SliderView } from './slider_plugin/SliderView';
import { SliderModel } from './slider_plugin/SliderModel';
import { SliderPresenter } from './slider_plugin/SliderPresenter';

export const defaultConfig: IPluginConfig = {
  range: [0, 100],
  generateValues: true,
  rangeOfPixels: [],
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

(function ($) {
  $.fn.sliderPlugin = function (options: TProvidedOptions = defaultConfig): ISliderPlugin | ISliderPlugin[] {
    let methodsToReturn: ISliderPlugin[] = []
    // default configuration
    let config: IPluginConfig = $.extend({}, defaultConfig, options);

    this.each(function () {
      if (!$.data(this, 'sliderPlugin')) {
        const rootEl = this as HTMLDivElement

        const view = new SliderView(rootEl, config);
        const model = new SliderModel(config);
        const presenter = new SliderPresenter(model, view);
        methodsToReturn.push(
          $.data(this,
            'sliderPlugin',
            new SliderPlugin(rootEl, view, model, presenter))
        )
      }
    });

    if (methodsToReturn.length > 1) {
      return methodsToReturn
    } else if (methodsToReturn.length === 1) {
      return methodsToReturn[0]
    } else if (this.length === 1) {
      return $(this).data('sliderPlugin')
    } else if (this.length > 1) {
      this.each(function () {
        methodsToReturn.push($(this).data('sliderPlugin'))
      })
      return methodsToReturn
    } else {
      throw new Error("Looks like selector you provided does not exists");
    }
  };

  $(function () {
    if ($(".sliderPlugin").length) {
      $(".sliderPlugin").sliderPlugin();
    }
  })
})(jQuery);

// if ( (process.env.NODE_ENV === 'development') ) {
//   // @ts-ignore
//   import('./index.scss');

//   $(".sliderPlugin1").sliderPlugin({
//       range: [-100, 100],
//       current: [6, 12],
//       step: 10,
//       class: 'sp-skin--material',
//       snapping: true,
//       selectRange: true,
//       vertical: true,
//       showSelected: 'hover',
//       showScale: true,
//       scaleStep: 5
//   })

//   $(".sliderPlugin2").sliderPlugin({
//       range: ['А', 'я'],
//       current: [7, 42],
//       class: 'sp-skin--fine-tune-square',
//       snapping: true,
//       selectRange: true,
//       vertical: true,
//       showScale: true,
//       scaleStep: 7
//   })

//   $(".sliderPlugin3").sliderPlugin({
//       range: ['A', 'z'],
//       class: 'sp-skin--material',
//       snapping: true,
//       current: [0,6],
//       showSelected: 'hover',
//       selectRange: true,
//       showScale: true,
//       scaleStep: 3
//   })

//   $(".sliderPlugin4").sliderPlugin({
//       range: [-100, 100],
//       snapping: true,
//       // class: 'sp-skin--material',
//       current: [2, 5],
//       selectRange: true,
//       showScale: true,
//       step: 10
//   })

//   $(".sliderPlugin5").sliderPlugin({
//       range: [-100, 100],
//       snapping: true,
//       current: [2, 5],
//       class: 'sp-skin--fine-tune-square',
//       selectRange: true,
//       showScale: true,
//       scaleHighlighting: false,
//       step: 10
//   })

//   $(".sliderPlugin6").sliderPlugin({
//       range: [1, 2, 3, 4, 5, 6, 7],
//       current: [0],
//       class: 'sp-skin--toxin',
//       snapping: true,
//       showScale: true,
//       scaleStep: 0
//   })
// }