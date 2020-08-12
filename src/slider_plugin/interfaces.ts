interface JQuery {
  sliderPlugin(options?: TProvidedOptions): ISliderPlugin | ISliderPlugin[]
}

type TProvidedOptions = {
  [P in keyof IPluginConfig]?: IPluginConfig[P];
};

type showSelectedValue = 'always' | 'hover' | 'never'

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

interface ISliderPlugin {
  selectedValues(): string | string[]
  allValues(): string[]
  deleteSelected(): string | string[]

  chooseValue(first: string | number, last: string | number): ISliderPlugin
  newRange(val: string[] | number[]): ISliderPlugin
  generateValues(val: boolean): ISliderPlugin
  changeStep(val: number): ISliderPlugin
  snapping(val: boolean): ISliderPlugin
  changeClass(val:string): ISliderPlugin
  selectRange(val:boolean): ISliderPlugin
  vertical(val:boolean): ISliderPlugin
  progressBar(val:boolean): ISliderPlugin
  showSelected(val: showSelectedValue | boolean): ISliderPlugin
  showScale(val:boolean): ISliderPlugin
  scaleStep(val: number): ISliderPlugin
  scaleHighlighting(val: boolean): ISliderPlugin

  subscribe(func: Function): ISliderPlugin
  unsubscribe(func: Function): ISliderPlugin
}

interface ISliderModel {

}

interface ISliderView {
  
}

interface ISliderPresenter {
  
}


declare interface ResizeObserver {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

declare var ResizeObserver: {
  prototype: ResizeObserver;
  new(callback: ResizeObserverCallback): ResizeObserver;
};

interface ResizeObserverSize {
    inlineSize: number;
    blockSize: number;
}

type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void;

interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize: ResizeObserverSize;
    readonly contentBoxSize: ResizeObserverSize;
}