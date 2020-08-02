interface JQuery {
  sliderPlugin(options?: object): any
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