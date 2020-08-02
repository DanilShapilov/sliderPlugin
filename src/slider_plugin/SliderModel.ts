import { deepCopy, generateRangeArr } from "./helpers";

export class SliderModel {
  private state: PluginConfig
  constructor(state:PluginConfig){
    this.state = deepCopy(state)
    // range: options.range !== undefined ? generateRangeArr(options.range, options.step ?? defaultConfig.step) : generateRangeArr(defaultConfig.range, options.step ?? defaultConfig.step)
  }

  init(sliderWidth:number) {
    this.state.range = generateRangeArr(this.state.range, this.state.step)

    this.generateRangeOfPixels(sliderWidth)
  }

  resizeLogic(newSliderWidth:number){
    this.generateRangeOfPixels(newSliderWidth)
  }

  getState() {
    return this.state
  }
  
  public pixelOfCurrent(index: number) {
    return this.state.rangeOfPixels![this.state.current[index]] ?? 0
  }

  currentValue(index:number) {
    return this.state.range[this.state.current[index] ] as string
  }

  get currentArr() {
    if (this.state.selectRange) {
      this.state.current[1] = this.state.current[1] ?? 0
    }
    return this.state.current
  }

  get selectedValues(){
    if (!this.state.selectRange) {
      return this.currentValue(0)
    }
      let i: number = this.state.current[0];
      let j: number = this.state.current[1];
      if (i > j) {
        [i, j] = [j, i]
      }
      const selectedRange:string[] = []
      for (; i <= j; i++) {
        selectedRange.push(this.state.range[i] as string)
      }
      return selectedRange as string[]
  }

  public updateStateCurrent(index:number, selectedPixel: number) {
    const closest:number = this.state.rangeOfPixels!.reduce((a:number, b:number, i:number) => {
      return Math.abs(b - selectedPixel) < Math.abs(a - selectedPixel) ? b : a;
    });
    
    const closestIndex = this.state.rangeOfPixels?.indexOf(closest) as number

    this.state.current[index] = closestIndex
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