import { deepCopy, generateRangeArr } from "./helpers";

export class SliderModel implements ISliderModel {
  private state: PluginConfig
  constructor(state:PluginConfig){
    this.state = deepCopy(state)
    // range: options.range !== undefined ? generateRangeArr(options.range, options.step ?? defaultConfig.step) : generateRangeArr(defaultConfig.range, options.step ?? defaultConfig.step)
  }

  init(sliderWidth:number) {
    this.state.range = generateRangeArr(this.state.range, this.state.step)

    this.generateRangeOfPixels(sliderWidth)
  }
  
  get isSnapping() {
    return this.state.snapping
  }

  get pixelOfCurrent() {
    return this.state.rangeOfPixels![this.state.current]
  }

  get currentValue() {
    return this.state.range[this.state.current] as string
  }

  public updateStateCurrent(selectedPixel: number) {
    const closest:number = this.state.rangeOfPixels!.reduce((a:number, b:number, i:number) => {
      return Math.abs(b - selectedPixel) < Math.abs(a - selectedPixel) ? b : a;
    });

    const closestIndex = this.state.rangeOfPixels?.indexOf(closest) as number
    this.state.current = closestIndex
  }

  generateRangeOfPixels(sliderWidth: number) {
    const pixelStep = sliderWidth / (this.state.range.length - 1);
    const rangeOfPixels =
      (this.state.range as string[])
        .map((_el, index) => {
          return Math.round(index * pixelStep)
        })
    this.state.rangeOfPixels = rangeOfPixels
  }
}