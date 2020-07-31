interface JQuery {
  sliderPlugin(options?: object): JQuery
}

type showSelectedValue = 'always' | 'hover' | 'never'

interface PluginConfig {
  range: number[] | string[]
  rangeOfPixels?: number[];
  step: number
  current: number[]
  snapping: boolean
  class: string
  selectRange: boolean
  vertical: boolean
  progressBar: boolean
  showSelected: showSelectedValue
  showScale: boolean
  scaleStep: number
  scaleHighlighting: boolean
}

interface IViewState {
  class: string
  range?: number[] | string[]
  rangeOfPixels?: number[];
  snapping: boolean
  selectRange: boolean
  vertical: boolean
  progressBar: boolean
  showSelected: showSelectedValue
  showScale: boolean
  scaleStep: number
  scaleHighlighting: boolean
}

interface ISliderView {

}

interface ISliderModel {
}


