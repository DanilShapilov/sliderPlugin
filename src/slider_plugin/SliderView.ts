import {boundMethod} from 'autobind-decorator'
import { deepCopy } from './helpers';
export class SliderView implements ISliderView{
  private $root: JQuery;

  private $slider!: Slider
  private $control!: Control[]

  private state: IPluginConfig

  constructor($root: JQuery, state:IPluginConfig) {
    this.state = deepCopy(state)

    this.$root = $root
  }

  async init() {
    this.$slider = await new Slider(this.state)
    this.$control = await this.$slider.$control

    await $(this.$root).html(this.$slider.HTML)

    await this.updateProgressBar()

    await $(this.$slider.$el).on('mousedown', this.eventHandler)
  }

  updateState(newState: IPluginConfig){
    this.state = deepCopy(newState)

    this.$slider.updateState(newState)
  }

  @boundMethod
  private eventHandler(e: JQueryEventObject) {
    this.change(e)
    $('html').on('mousemove', this.mousemoveHandler)
    $('html').on('mouseup', this.mouseUp)
  }

  @boundMethod
  private mousemoveHandler(e: JQueryEventObject) {    
    this.change(e)
  }

  private change(e: JQueryEventObject) {
    const selectedControlIndex: number = this.$slider.getSelectedControlIndex(e)
    const $sliderOffset = this.$slider.offset() as number;
    let mousePos = e.pageX
    if (this.state.vertical) {
      mousePos = e.pageY
    }
    const selectedPixel = mousePos - $sliderOffset - this.$control[0].width()! / 2

    $(this).trigger('view:selectChanged', [selectedControlIndex, selectedPixel])
  }

  updatePosAndValue(selectedControlIndex: number, selectedPixel: number, value: string, current:number[]) {
    this.$control[selectedControlIndex].changeControlPos(selectedPixel, this.sliderLength, this.state.vertical)
    this.$control[selectedControlIndex].$controlInfo.text = value

    this.updateProgressBar()

    this.highliteScale(current)
  }

  @boundMethod
  private mouseUp(e: JQueryEventObject) {
    this.$slider.removeZindex()
    this.$slider.setSelectedToNull()
    $('html').off('mousemove')
    $('html').off('mouseup')
    
  }

  private updateProgressBar(){
    this.$slider.$progressBar.update(this.state.vertical, this.$control)
  }

  private highliteScale(current: number[]) {
    this.$slider.$scale.highliteEls(current)
  }

  get isSnapping() {
    return this.state.snapping
  }

  get sliderLength() {
    return this.$slider.length
  }

  destroy(){
    $('html').off('mousemove')
    $('html').off('mouseup')
    $(this.$slider.$el).off('mousedown')
    $(this.$root).empty()
  }
}

class Slider implements ISlider{
  $el: HTMLDivElement
  $control: Control[]
  $progressBar: ProgressBar
  $scale: Scale
  private $selectedControl: Control | null
  private state: IPluginConfig

  constructor(state:IPluginConfig) {
    this.$selectedControl = null;
    this.state = state
    this.$el = document.createElement('div')
    this.$el.className = `slider ${this.state.class} ${this.state.vertical ? 'vertical': ''}`

    this.$scale = new Scale(this.state, this.$el)

    this.$progressBar = new ProgressBar(this.state.progressBar)

    if (this.state.selectRange) {
      this.$control = [new Control('0', this.state.showSelected), new Control('1', this.state.showSelected)]
    }else {
      this.$control = [new Control('0', this.state.showSelected)]
    }

    if (this.state.selectRange) {
      this.$el.append(this.$control[0].$el,this.$progressBar.element, this.$control[1].$el)
    }else {
      this.$el.append(this.$progressBar.element, this.$control[0].$el)
    }
  }

  updateState(newState: IPluginConfig){
    this.state = newState

    this.$progressBar.updateState(this.state.progressBar)

    this.$control.forEach( el => el.updateState(this.state.showSelected))

    this.$scale.updateState(newState)
  }

  getSelectedControlIndex(evt: JQueryEventObject) {
    if (this.$selectedControl) {
      return this.$selectedControl.getIndex;
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

  setSelectedToNull(){
    this.$selectedControl = null
  }

  private addZindex(){
    if (this.$selectedControl) {
      $(this.$selectedControl.$el).css('z-index', 100)
      this.whenDragged('add')
    }
  }
  removeZindex(){
    if (this.$selectedControl) {
      $(this.$selectedControl.$el).css('z-index', '')
      this.whenDragged('remove')
    }
  }

  private whenDragged(key: 'add' | 'remove'){
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
      return $(this.$el).height()! - this.$control[0].height()
    }
    return $(this.$el).width()! - this.$control[0].width()
  }

  get HTML() {
    return this.$el
  }
}

class ProgressBar implements IProgressBar{
  private $el: HTMLDivElement
  constructor(visible: boolean){
    this.$el = document.createElement('div')
    this.$el.className = 'progress'
    
    this.updateState(visible)
  }

  updateState(visible: boolean){
    if (!visible) {
      $(this.$el).css('display', 'none')
    }else{
      $(this.$el).css('display', '')
    }
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
      $(this.$el).css(topOrLeft, firstControlPos + (controls[0].width() / 2))
      $(this.$el).css(widthOrHeight, secondControlPos - firstControlPos  )
    }else {
      $(this.$el).css(widthOrHeight, controls[0].position(isVertical) + (controls[0].width() / 2))
    }
  }
  
}

class Control implements IControl{
  $el: HTMLDivElement;
  $controlInfo: ControlInfo
  private index: number
  constructor(index:string, show:string) {
    this.index = +index
    this.$el = document.createElement('div')
    this.$el.setAttribute('data-control_index', index)
    this.$el.className = `slider__control ${show}`

    this.$controlInfo = new ControlInfo()

    this.$el.append(this.$controlInfo.element)
  }

  get getIndex(){
    return this.index
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

  updateState(showSelected: showSelectedValue): void {
    this.$el.className = `slider__control ${showSelected}`
  }

  public position(isVertical: boolean) {
    if (isVertical) {
    return parseInt($(this.$el).css('top'))
    }
    return parseInt($(this.$el).css('left'))
  }

  public width() {
    return $(this.$el).width() as number
  }
  public height() {
    return $(this.$el).height() as number
  }
}

class Scale implements IScale {
  private $wrapper: HTMLDivElement
  private $els: HTMLDivElement[] = []
  constructor(private state:IPluginConfig, private $root:HTMLDivElement) {
    this.$wrapper = document.createElement('div')
    this.$wrapper.classList.add('scale')
    if (this.state.vertical) {
      this.$wrapper.classList.add('vertical')
    }

    if (this.state.rangeOfPixels) {
      if (this.$els.length === 0 || this.$els.length !== this.state.range.length) {
        this.generateScale()
      }else {
        this.updateElsState()
      }
    }
  }

  highliteEls(current: number[]){
    if (!this.state.showScale) {
      return
    }
    this.$els.forEach( (el, index) =>{
      if ( this.shouldBeHighlited(current, index) ) {
        el.classList.add('selected')
      }else {
        el.classList.remove('selected')
      }
    })
  }

  private shouldBeHighlited(current: number[], index:number){
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

  private generateScale(){
    $(this.$wrapper).empty()
    this.$els = []

    this.state.range?.forEach( (value: string | number, index:number, arr: string[] | number[]) => {
      const el = document.createElement('div')
      el.classList.add('scale__el')
      const line = document.createElement('div')
      line.classList.add('scale__line')
      const val = document.createElement('div')
      val.classList.add('scale__val')
      val.textContent = value as string

      this.handleHidden(index, el, arr.length)

      el.append(line, val)

      this.$els.push(el)

      if (this.state.vertical) {
        $(el).css('top', this.state.rangeOfPixels![index])
      }else{
        $(el).css('left', this.state.rangeOfPixels![index])
      }
      
    } )
    this.$els.forEach((el) => {
      this.$wrapper.appendChild(el)
    })
    this.$root.appendChild(this.$wrapper)
  }

  updateState(newState: IPluginConfig){
    this.state = {
      ...this.state,
      ...newState
    }
    this.highliteEls(this.state.current)
    if (this.state.showScale) {
      $(this.$wrapper).css('display', '')
    }else if (!this.state.showScale){
      $(this.$wrapper).css('display', 'none')
    }
    if (this.$els.length === 0 || this.$els.length !== this.state.range.length) {
      this.generateScale()
    }else {
      this.updateElsState()
    }
  }

  updateElsState() {
    this.$els.forEach((el, index, arr) => {
      const scaleVal = el.querySelector('.scale__val')!
      scaleVal.textContent = this.state.range[index] as string

      el.classList.remove('hidden')
      this.handleHidden(index, el, arr.length)

      if (this.state.vertical) {
        $(el).css('top', this.state.rangeOfPixels![index])
        $(el).css('left', '')
      }else{
        $(el).css('left', this.state.rangeOfPixels![index])
        $(el).css('top', '')
      }
    })
  }

  private handleHidden(index: number, el: HTMLElement, elsArrLength: number){
    if (index % this.state.scaleStep !== 0) {
      el.classList.add('hidden')

      if (this.state.scaleStep === 0) {
        const isOdd = (elsArrLength) % 2 !== 0
        
        if (index === 0 
          || index === elsArrLength-1 
          || (isOdd && index === (elsArrLength - 1) / 2 )) {
          el.classList.remove('hidden')
        }
      }
    }
  }
}

class ControlInfo implements IControlInfo {
  private $el: HTMLDivElement;
  constructor() {
    this.$el = document.createElement('div')
    this.$el.className = `slider__control-info`
  }

  set text(value:string){
    this.$el.innerHTML = value
  }
  get element(){
    return this.$el
  }
}
