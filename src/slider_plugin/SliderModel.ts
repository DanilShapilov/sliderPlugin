import { deepCopy, generateRangeArr, isFunction } from "./helpers";

export class SliderModel {
  private state: PluginConfig
  private initRange: string[] | number[]
  constructor(state: PluginConfig) {
    this.state = deepCopy(state)
    this.initRange = deepCopy(this.state.range)
  }

  init(sliderWidth: number) {
    this.state.range = generateRangeArr(this.state.range, this.state.step, this.state.generateValues)

    this.generateRangeOfPixels(sliderWidth)
  }

  subscribe(func: Function){
    if (!isFunction(func)) {
      console.warn('subscribe can only take functions');
      return
    }
    this.state.subscribers.push(func)
  }

  unsubscribe(func: Function){
    if (!isFunction(func)) {
      console.warn('unsubscribe can only take functions');
      return
    }
    const isInArray = this.state.subscribers.indexOf(func)
    if (isInArray !== -1) {
      this.state.subscribers.splice(isInArray, 1);
    }else{
      console.warn('there is no such function');
    }
  }

  callSubs(){
    
    this.state.subscribers.forEach( func => func())
  }

  

  generateValues(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('generateValues option should take boolean: true or false');
      return
    }
    this.state.generateValues = val
  }

  scaleHighlighting(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('scaleHighlighting option should take boolean: true or false');
      return
    }
    this.state.scaleHighlighting = val
    $(this).trigger('model:stateChanged', 'updateViewState')
  }

  scaleStep(val: number) {
    if (val <= 0 || val % 1 !== 0) {
      console.warn("scaleStep should be more than 0 and an integer");
      return;
    }
    this.state.scaleStep = val
    $(this).trigger('model:stateChanged', 'updateViewState')
  }


  showScale(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('showScale option should take boolean: true or false');
      return
    }
    this.state.showScale = val
    $(this).trigger('model:stateChanged', 'updateViewState')
  }

  showSelected(val: showSelectedValue | boolean) {
    if (val !== 'always'
      && val !== 'hover'
      && val !== 'never'
      && val !== true
      && val !== false
    ) {
      console.warn(`showSelected option can take:
        boolean: true or false,
        string: "always" | "hover" | "never"`);
      return
    }
    if (val === true) {
      val = 'always'
    } else if (val === false) {
      val = 'never'
    }
    this.state.showSelected = val
    $(this).trigger('model:stateChanged', 'updateViewState')
  }


  progressBar(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('progressBar option should take boolean: true or false');
      return
    }
    this.state.progressBar = val
    $(this).trigger('model:stateChanged', 'updateViewState')
  }

  vertical(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('vertical option should take boolean: true or false');
      return
    }
    this.state.vertical = val
    $(this).trigger('model:stateChanged', 'redrawWholeView')
  }

  selectRange(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('selectRange option should take boolean: true or false');
      return
    }
    this.state.selectRange = val
    this.state.current = [this.state.current[0]]
    $(this).trigger('model:stateChanged', 'redrawWholeView')
  }

  changeClass(val: string): void {
    if (typeof val !== 'string') {
      console.warn('changeClass option should take string');
      return
    }
    this.state.class = val
    $(this).trigger('model:stateChanged', 'redrawWholeView')
  }

  snapping(val: boolean) {
    if (typeof val !== 'boolean') {
      console.warn('Snapping option should take boolean: true or false');
      return
    }
    this.state.snapping = val
    $(this).trigger('model:stateChanged', 'updateViewState')
  }

  changeStep(val: number): void {
    if (val <= 0 || val % 1 !== 0) {
      console.warn("Step should be more than 0 and an integer");
      return;
    }
    this.state.step = val
    this.state.range = generateRangeArr(this.initRange, this.state.step, this.state.generateValues)
    this.generateRangeOfPixels()
    $(this).trigger('model:stateChanged', 'updateViewState')
  }

  resizeLogic(newSliderWidth: number) {
    this.generateRangeOfPixels(newSliderWidth)
  }

  newRange(val: string[] | number[]) {
    if (!Array.isArray(val)) {
      console.warn('newRange should be an Array');
      return
    }
    this.state.range = generateRangeArr(val, this.state.step, this.state.generateValues)
    this.initRange = deepCopy(val)
    this.generateRangeOfPixels()
    $(this).trigger('model:stateChanged', 'updateViewState')
  }

  chooseValue(first: string | number, last: string | number) {
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

    this.state.range = (this.state.range as string[]).filter((item: string) => {
      return toDelete.indexOf(item) === -1
    })

    if (this.state.range.length < 2) {
      if (this.state.range.length === 0) {
        this.state.range.push('out of values', 'out of values')
      } else if (this.state.range.length === 1) {
        this.state.range.push('out of values')
      }
    }

    this.generateRangeOfPixels()

    $(this).trigger('model:stateChanged', 'updateViewState')

    return toDelete
  }

  getState() {
    return this.state
  }

  public pixelOfCurrent(index: number) {
    return this.state.rangeOfPixels![this.state.current[index]] ?? 0
  }

  currentValue(index: number) {
    return this.state.range[this.state.current[index]] as string
  }

  get currentArr() {
    if (this.state.selectRange) {
      this.state.current[1] = this.state.current[1] ?? 0
    }
    return this.state.current
  }

  get selectedValues() {
    if (!this.state.selectRange) {
      return this.currentValue(0)
    }
    let i: number = this.state.current[0];
    let j: number = this.state.current[1];
    if (i > j) {
      [i, j] = [j, i]
    }
    const selectedRange: string[] = []
    for (; i <= j; i++) {
      selectedRange.push(this.state.range[i] as string)
    }
    return selectedRange as string[]
  }

  public updateStateCurrent(index: number, selectedPixel: number) {
    const closest: number = this.state.rangeOfPixels!.reduce((a: number, b: number, i: number) => {
      return Math.abs(b - selectedPixel) < Math.abs(a - selectedPixel) ? b : a;
    });

    const closestIndex = this.state.rangeOfPixels?.indexOf(closest) as number

    this.state.current[index] = closestIndex
  }

  generateRangeOfPixels(sliderWidth: number | undefined = undefined) {
    if (sliderWidth === undefined) {
      if (this.state.rangeOfPixels) {
        sliderWidth = this.state.rangeOfPixels[this.state.rangeOfPixels?.length - 1]
      } else {
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