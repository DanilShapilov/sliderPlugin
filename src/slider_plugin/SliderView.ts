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

  init() {
    this.$slider = new Slider(this.state)
    this.$control = this.$slider.$control

    $(this.$root).html(this.$slider.HTML)

    $(this.$slider.$el).on('mousedown', this.eventHandler.bind(this))
  }

  @boundMethod
  eventHandler(e: JQueryEventObject) {
    this.change(e)    

    $('html').on('mousemove', this.mousemoveHandler)
    $('html').on('mouseup', this.mouseUp)
  }

  @boundMethod
  mousemoveHandler(e: JQueryEventObject) {    
    this.change(e)
  }

  change(e: JQueryEventObject) {
    const selectedControlIndex: number = this.$slider.getSelectedControlIndex(e)
    const $sliderOffset = this.$slider.offset() as number;
    let mousePos = e.pageX
    if (this.state.vertical) {
      mousePos = e.pageY
    }
    const selectedPixel = mousePos - $sliderOffset - this.$control[0].width()! / 2

    $(this).trigger('view:selectChanged', [selectedControlIndex, selectedPixel])
  }

  public updatePosAndValue(selectedControlIndex: number, selectedPixel: number, value: string) {
    this.$control[selectedControlIndex].changeControlPos(selectedPixel, this.sliderLength, this.state.vertical)
    this.$control[selectedControlIndex].$controlInfo.text = value
  }

  @boundMethod
  mouseUp(e: JQueryEventObject) {
    this.$slider.removeZindexFromSelectedControl()
    this.$slider.$selectedControl = null
    $('html').off('mousemove')
    $('html').off('mouseup')
  }

  get isSnapping() {
    return this.state.snapping
  }

  public get sliderLength():number {
    return this.$slider.width
  }
}

class Slider {
  $el: HTMLDivElement;
  $control: Control[];
  $selectedControl: Control | null
  private state: IViewState

  constructor(state:IViewState) {
    this.$selectedControl = null;
    this.state = state
    this.$el = document.createElement('div')
    this.$el.className = `slider ${this.state.class}`

    if (this.state.selectRange) {
      this.$control = [new Control('0'), new Control('1')]
    }else {
      this.$control = [new Control('0')]
    }

    if (this.state.selectRange) {
      this.$el.append(this.$control[0].$el, this.$control[1].$el)
    }else {
      this.$el.append(this.$control[0].$el)
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
    
    this.setZindexToSelectedControl()

    return closestControlIndex;
  }
  setZindexToSelectedControl(){
    if (this.$selectedControl) {
      $(this.$selectedControl.$el).css('z-index', 100)
    }
  }
  removeZindexFromSelectedControl(){
    if (this.$selectedControl) {
      $(this.$selectedControl.$el).css('z-index', 0)
    }
  }

  public offset() {    
    if (this.state.vertical) {
      return $(this.$el).offset()!.top
    }
    return $(this.$el).offset()!.left
  }

  get width():number {
    if (this.state.vertical) {
      return $(this.$el).height()! - this.$control[0].height()! as number
    }
    return $(this.$el).width()! - this.$control[0].width()! as number
  }

  get HTML() {
    return this.$el
  }
}

class Control {
  $el: HTMLDivElement;
  $controlInfo: ControlInfo
  index: number
  constructor(index:string) {
    this.index = +index
    this.$el = document.createElement('div')
    this.$el.setAttribute('data-control_index', index)
    this.$el.className = `slider__control`

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
