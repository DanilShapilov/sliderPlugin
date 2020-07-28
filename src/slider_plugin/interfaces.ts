interface JQuery {
  sliderPlugin(options?: object): JQuery
}

interface PluginConfig {
  range: number[] | string[]
  rangeOfPixels?: number[];
  step: number
  current: number
  snapping: boolean
  class: string
}

interface IViewState {
  class: string
}

interface ISliderView {

}

interface ISliderModel {
  readonly isSnapping: boolean
  readonly pixelOfCurrent: number
}


