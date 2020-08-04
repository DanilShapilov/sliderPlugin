import { deepCopy, generateRangeArr } from "./helpers";

export class SliderModel {
  private state: PluginConfig
  private initRange: string[] | number[]
  constructor(state:PluginConfig){
    this.state = deepCopy(state)
    this.initRange = deepCopy(this.state.range)
    // range: options.range !== undefined ? generateRangeArr(options.range, options.step ?? defaultConfig.step) : generateRangeArr(defaultConfig.range, options.step ?? defaultConfig.step)
  }

  init(sliderWidth:number) {
    this.state.range = generateRangeArr(this.state.range, this.state.step)

    this.generateRangeOfPixels(sliderWidth)
  }
  showSelected(val: showSelectedValue | boolean) {
    if (val === true) {
      val = 'always'
    }else if (val === false) {
      val = 'never'
    }
    this.state.showSelected = val
    $(this).trigger('model:stateChanged', 'showSelected')
  }


  progressBar(val: boolean) {
    this.state.progressBar = val
    $(this).trigger('model:stateChanged', 'progressBar')
  }

  vertical(val: boolean) {
    this.state.vertical = val
    $(this).trigger('model:stateChanged', 'vertical')
  }

  selectRange(val: boolean) {
    this.state.selectRange = val
    this.state.current = [this.state.current[0]]
    $(this).trigger('model:stateChanged', 'selectRange')
  }

  changeClass(val: string): void {
    this.state.class = val
    $(this).trigger('model:stateChanged', 'changeClass')
  }

  snapping(value: boolean){
    if (typeof value !== 'boolean') {
      console.warn('Snapping option should take boolean: true or false');
      return
    }
    this.state.snapping = value
    $(this).trigger('model:stateChanged', 'snapping')
  }

  changeStep(value: number): void {
    if (value === 0 || value % 1 !== 0) {
      console.warn("Step should be more then 0 and an integer");
      return;
    }
    this.state.step = value
    this.state.range = generateRangeArr(this.initRange, this.state.step)
    this.generateRangeOfPixels()
    $(this).trigger('model:stateChanged', 'changeStep')
  }

  resizeLogic(newSliderWidth:number){
    this.generateRangeOfPixels(newSliderWidth)
  }

  newRange(value: string[] | number[]){
    this.state.range = generateRangeArr(value, this.state.step)
    this.initRange = deepCopy(this.state.range)
    this.generateRangeOfPixels()
    $(this).trigger('model:stateChanged', 'newRange')
  }

  chooseValue(first:string | number, last:string | number){
    const firstVal: string | undefined = first !== undefined ? String(first) : undefined
    const lastVal: string | undefined = last !== undefined ? String(last) : undefined

    if (typeof firstVal === 'string') {
      const valIndex = (this.state.range as string[]).indexOf(firstVal)
      if (valIndex !== -1) {
        this.state.current[0] = valIndex
      }
    }

    if (typeof lastVal === 'string' && this.state.selectRange) {
      const valIndex = (this.state.range as string[]).indexOf(lastVal)
      if (valIndex !== -1) {
        this.state.current[1] = valIndex
      }
    }
    $(this).trigger('model:stateChanged')
  }

  deleteSelected() {
    const toDelete = this.selectedValues

    this.state.range = (this.state.range as string[]).filter((item:string) => {
      return toDelete.indexOf(item) === -1
    })

    if (this.state.range.length < 2) {
      if (this.state.range.length === 0) {
        this.state.range.push('out of values','out of values')
      }else if (this.state.range.length === 1) {
        this.state.range.push('out of values')
      }
    }

    this.generateRangeOfPixels()

    $(this).trigger('model:stateChanged')

    return toDelete
  }

  getState() {
    return this.state
  }
  
  public pixelOfCurrent(index: number) {
    return this.state.rangeOfPixels![this.state.current[index]] ?? 0
  }

  currentValue(index:number) {
    return this.state.range[this.state.current[index]] as string
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

  generateRangeOfPixels(sliderWidth: number | undefined = undefined) {
    if (sliderWidth === undefined) {
      if(this.state.rangeOfPixels){
        sliderWidth = this.state.rangeOfPixels[this.state.rangeOfPixels?.length - 1]
      }else {
        throw new Error("Provide sliderWidth variable!");
      }
    }
    const pixelStep = sliderWidth / (this.state.range.length - 1);
    const rangeOfPixels =
      (this.state.range as string[])
        .map((_el, index) => {
          return Math.round(index * pixelStep)
        })
    this.state.rangeOfPixels = rangeOfPixels
  }
}