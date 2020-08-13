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

interface IPluginMethods{
  selectedValues(): string | string[]
  allValues(): string[]
  deleteSelected(): string | string[]

  chooseValue(first: string | number, last: string | number): ISliderPlugin | void
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
}

interface ISliderModel extends IPluginMethods {
  init(sliderWidth: number): void
  callSubs(): void
  updateStateCurrent(selectedControlIndex: number, selectedPixel: number): void
  getState(): IPluginConfig
  pixelOfCurrent(index: number): number
  currentValue(index: number): string
  readonly currentArr: number[]
  callSubs(): void
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