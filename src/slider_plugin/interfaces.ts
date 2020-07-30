interface JQuery {
  sliderPlugin(options?: object): JQuery
}

interface PluginConfig {
  range: number[] | string[]
  rangeOfPixels?: number[];
  step: number
  current: number[]
  snapping: boolean
  class: string
  selectRange: boolean
  vertical: boolean
}

interface IViewState {
  class: string
  snapping: boolean
  selectRange: boolean
  vertical: boolean
}

interface ISliderView {

}

interface ISliderModel {
}


