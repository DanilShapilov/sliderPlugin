import {boundMethod} from 'autobind-decorator'
import { deepCopy } from './helpers';
export class SliderView implements ISliderView{
  private $root: JQuery;

  private $slider!: Slider
  private $control!: Control[]

  private state: IViewState

  constructor($root: JQuery, state:IViewState) {
    this.state = deepCopy(state)

    this.$root = $root
  }

  async init() {
    this.$slider = new Slider(this.state)
    this.$control = this.$slider.$control

    await $(this.$root).html(this.$slider.HTML)

    await this.updateProgressBar()

    await $(this.$slider.$el).on('mousedown', this.eventHandler.bind(this))
  }

  updateState(newState: object){
    this.state = {
      ...this.state,
      ...newState
    }

    this.$slider.updateState(newState)
  }

  @boundMethod
  eventHandler(e: JQueryEventObject) {
    this.change(e)    
    this.updateProgressBar()
    $('html').on('mousemove', this.mousemoveHandler)
    $('html').on('mouseup', this.mouseUp)
  }

  @boundMethod
  mousemoveHandler(e: JQueryEventObject) {    
    this.change(e)
    this.updateProgressBar()
  }

  change(e: JQueryEventObject) {
    // DEBUG 
    // console.log('scaleState',this.$slider.$scale?.scaleState);
    
    // DEBUG END
    const selectedControlIndex: number = this.$slider.getSelectedControlIndex(e)
    const $sliderOffset = this.$slider.offset() as number;
    let mousePos = e.pageX
    if (this.state.vertical) {
      mousePos = e.pageY
    }
    const selectedPixel = mousePos - $sliderOffset - this.$control[0].width()! / 2

    $(this).trigger('view:selectChanged', [selectedControlIndex, selectedPixel])
  }

  public updatePosAndValue(selectedControlIndex: number, selectedPixel: number, value: string, current:number[]) {
    this.$control[selectedControlIndex].changeControlPos(selectedPixel, this.sliderLength, this.state.vertical)
    this.$control[selectedControlIndex].$controlInfo.text = value

    if (this.$slider.$scale) {
      this.$slider.$scale.highliteEls(current)
    }
  }

  @boundMethod
  mouseUp(e: JQueryEventObject) {
    this.$slider.removeZindex()
    this.$slider.$selectedControl = null
    $('html').off('mousemove')
    $('html').off('mouseup')
    this.updateProgressBar()
  }

  updateProgressBar(){
    this.$slider.$progressBar.update(this.state.vertical, this.$control)
  }

  get isSnapping() {
    return this.state.snapping
  }

  public get sliderLength():number {
    return this.$slider.length
  }
}

class Slider {
  $el: HTMLDivElement;
  $control: Control[];
  $progressBar: ProgressBar
  $scale?: Scale
  $selectedControl: Control | null
  private state: IViewState

  constructor(state:IViewState) {
    this.$selectedControl = null;
    this.state = state
    this.$el = document.createElement('div')
    this.$el.className = `slider ${this.state.class}`

    if (this.state.showScale) {
      this.$scale = new Scale(this.state, this.$el)
    }

    this.$progressBar = new ProgressBar()

    if (this.state.selectRange) {
      this.$control = [new Control('0', this.state.showSelected), new Control('1', this.state.showSelected)]
    }else {
      this.$control = [new Control('0', this.state.showSelected)]
    }

    if (this.state.selectRange) {
      this.$el.append(this.$control[0].$el,this.state.progressBar ? this.$progressBar.element : '', this.$control[1].$el)
    }else {
      this.$el.append(this.state.progressBar ? this.$progressBar.element : '',this.$control[0].$el)
    }
  }

  updateState(newState: object){
    this.state = {
      ...this.state,
      ...newState
    }
    if (this.$scale) {
      this.$scale.updateState(newState)
    }
  }

  getSelectedControlIndex(evt: JQueryEventObject) {
    if (this.$selectedControl) {
      return this.$selectedControl.index;
    }
    const $sliderOffset = this.offset() as number;
    let mousePos = evt.pageX
    if (this.state.vertical) {
      mousePos = evt.pageY
    }
    const selectedPixel = mousePos - $sliderOffset - this.$control[0].width()! / 2

    let closestControlIndex: number = 0;
    
    if (this.$control.length > 1) {
      const arrOfControlPos = [this.$control[0].position(this.state.vertical), this.$control[1].position(this.state.vertical)];

      closestControlIndex = arrOfControlPos.indexOf(
        arrOfControlPos.reduce((a:number, b:number) => {
          return Math.abs(b - selectedPixel) < Math.abs(a - selectedPixel) ? b : a;
        })
      )
    }

    this.$selectedControl = this.$control[closestControlIndex]
    
    this.addZindex()

    return closestControlIndex;
  }
  addZindex(){
    if (this.$selectedControl) {
      $(this.$selectedControl.$el).css('z-index', 100)
      this.whenDragged('add')
    }
  }
  removeZindex(){
    if (this.$selectedControl) {
      $(this.$selectedControl.$el).css('z-index', 1)
      this.whenDragged('remove')
    }
  }

  whenDragged(key: 'add' | 'remove'){
    if (this.state.showSelected === 'hover') {
      this.$selectedControl?.$el.classList[key]('always')
    }
  }

  public offset() {    
    if (this.state.vertical) {
      return $(this.$el).offset()!.top
    }
    return $(this.$el).offset()!.left
  }

  get length():number {
    if (this.state.vertical) {
      return $(this.$el).height()! - this.$control[0].height()! as number
    }
    return $(this.$el).width()! - this.$control[0].width()! as number
  }

  get HTML() {
    return this.$el
  }
}

class Scale {
  $wrapper: HTMLDivElement
  $els!: HTMLDivElement[]
  constructor(private state:IViewState, private $root:HTMLDivElement) {
    this.$wrapper = document.createElement('div')
    this.$wrapper.classList.add('scale')
    this.$els = []
  }

  highliteEls(current: number[]){
    this.$els.forEach( (el, index) =>{
      if ( this.shouldBeHighlited(current, index) ) {
        el.classList.add('selected')
      }else {
        el.classList.remove('selected')
      }
    })
  }

  shouldBeHighlited(current: number[], index:number){
    if (this.state.scaleHighlighting) {
      let min = current[0]
      let max = current[1]
      if (min > max) {
        [min, max] = [max, min]
      }
      if ( (current.length > 1) 
      && ( (index >= min) 
      && (index <= max) ) ) {
        return true
      }
    }
      return current.includes(index)
  }

  generateAndAppendScale(){
    if (this.state.vertical) {
      this.$wrapper.classList.add('vertical')
    }
    this.state.range?.forEach( (value: string | number, index:number, arr: string[] | number[]) => {
      // const stepForPos = 100 / arr.length;
      const el = document.createElement('div')
      el.classList.add('scale__el')
      const line = document.createElement('div')
      line.classList.add('scale__line')
      const val = document.createElement('div')
      val.classList.add('scale__val')
      val.textContent = value as string

      if (index % this.state.scaleStep !== 0) {
        el.classList.add('hidden')

        if (this.state.scaleStep === 0) {
          const isOdd = (arr.length) % 2 !== 0
          
          if (index === 0 
            || index === arr.length-1 
            || (isOdd && index === (arr.length - 1) / 2 )) {
            el.classList.remove('hidden')
          }
        }
      }

      el.append(line, val)

      this.$els.push(el)

      if (this.state.vertical) {
        $(el).css('top', this.state.rangeOfPixels![index])
      }else{
        $(el).css('left', this.state.rangeOfPixels![index])
      }
      this.$wrapper.appendChild(el)
    } )

    this.$root.appendChild(this.$wrapper)
  }

  get scaleState(){
    return this.state
  }

  updateState(newState: object){
    this.state = {
      ...this.state,
      ...newState
    }
    this.generateAndAppendScale()
  }
}

class ProgressBar {
  $el: HTMLDivElement
  constructor(){
    this.$el = document.createElement('div')
    this.$el.className = 'progress'
  }
  public get element() : HTMLDivElement {
    return this.$el
  }

  update(isVertical: boolean, controls: Control[]) {
    const topOrLeft = isVertical ? 'top' : 'left'
    const widthOrHeight = isVertical ? 'height' : 'width'
    if (controls.length > 1) {
      let firstControlPos = controls[0].position(isVertical)
      let secondControlPos = controls[1].position(isVertical)
      if (firstControlPos > secondControlPos) {
        [firstControlPos, secondControlPos] = [secondControlPos, firstControlPos]
      }
      $(this.$el).css(topOrLeft, firstControlPos)
      $(this.$el).css(widthOrHeight, secondControlPos - firstControlPos + controls[0].width()! )
    }else {
      $(this.$el).css(widthOrHeight, controls[0].position(isVertical)  + controls[0].width()!)
    }
  }
  
}

class Control {
  $el: HTMLDivElement;
  $controlInfo: ControlInfo
  index: number
  constructor(index:string, show:string) {
    this.index = +index
    this.$el = document.createElement('div')
    this.$el.setAttribute('data-control_index', index)
    this.$el.className = `slider__control ${show}`

    this.$controlInfo = new ControlInfo()

    this.$el.append(this.$controlInfo.$el)
  }

  changeControlPos(newPos: number, sliderWidth:number, isVertical: boolean) {
    const key = isVertical ? 'top' : 'left';
    if (newPos >= sliderWidth) {
      $(this.$el).css(key, sliderWidth)
    } else if (newPos <= 0) {
      $(this.$el).css(key, 0)
    } else {
      $(this.$el).css(key, newPos)
    }
  }
  public position(isVertical: boolean) {
    if (isVertical) {
    return parseInt($(this.$el).css('top'))
    }
    return parseInt($(this.$el).css('left'))
  }

  public width() {
    return $(this.$el).width()
  }
  public height() {
    return $(this.$el).height()
  }
}

class ControlInfo {
  $el: HTMLDivElement;
  constructor() {
    this.$el = document.createElement('div')
    this.$el.className = `slider__control-info`
  }

  set text(value:string){
    this.$el.innerHTML = value
  }
}
