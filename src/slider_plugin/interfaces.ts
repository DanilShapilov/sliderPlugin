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
}

interface IViewState {
  class: string
  snapping: boolean
  selectRange: boolean
  vertical: boolean
  progressBar: boolean
  showSelected: showSelectedValue
}

interface ISliderView {

}

interface ISliderModel {
}


