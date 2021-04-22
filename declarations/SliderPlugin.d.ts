type TProvidedOptions = {
  [P in keyof IPluginConfig]?: IPluginConfig[P];
};

interface IPluginConfig {
  range: number[] | string[]
  generateValues: boolean
  rangeOfPixels: number[];
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

  subscribers: Function[]
}
type showSelectedValue = 'always' | 'hover' | 'never'

interface IPluginMethods{
  selectedValues(): string | string[]
  currentValue(index: number): string
  getInitRange(): string[] | number[]
  allValues(): string[]
  deleteSelected(): string | string[]
  getState(): IPluginConfig

  chooseValue(first: string | number, last?: string | number): ISliderPlugin | void
  newRange(val: string[] | number[]): ISliderPlugin | void
  generateValues(val: boolean): ISliderPlugin | void
  changeStep(val: number): ISliderPlugin | void
  snapping(val: boolean): ISliderPlugin | void
  changeClass(val:string): ISliderPlugin | void
  selectRange(val:boolean): ISliderPlugin | void
  vertical(val:boolean): ISliderPlugin | void
  progressBar(val:boolean): ISliderPlugin | void
  showSelected(val: showSelectedValue | boolean): ISliderPlugin | void
  showScale(val:boolean): ISliderPlugin | void
  scaleStep(val: number): ISliderPlugin | void
  scaleHighlighting(val: boolean): ISliderPlugin | void

  subscribe(func: Function): ISliderPlugin | void
  unsubscribe(func: Function): ISliderPlugin | void
}

interface ISliderPlugin extends IPluginMethods {
  resized(): void
  destroy(): void
}