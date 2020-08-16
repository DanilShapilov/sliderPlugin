/// <reference path="SliderPlugin.d.ts" />
/// <reference path="SliderModel.d.ts" />
/// <reference path="SliderPresenter.d.ts" />
/// <reference path="SliderView.d.ts" />
/// <reference path="ResizeObserver.d.ts" />

interface JQuery{
  sliderPlugin(options?: TProvidedOptions): ISliderPlugin | ISliderPlugin[]
}