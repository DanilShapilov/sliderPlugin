import {boundMethod} from 'autobind-decorator'
import { deepCopy } from './helpers';
export class SliderView implements ISliderView{
  private $root: JQuery;

  private $slider!: Slider
  private $control!: Control[]
  private $sliderControlInfo!: ControlInfo

  private state: IViewState

  constructor($root: JQuery, state:IViewState) {
    this.state = deepCopy(state)

    this.$root = $root
  }

  init() {
    this.$slider = new Slider(this.state)
    this.$control = this.$slider.$control
    // this.$sliderControlInfo = this.$sliderControl.$controlInfo

    $(this.$root).html(this.$slider.HTML)

    $(this.$root).on('mousedown', this.eventHandler.bind(this))
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
    const $sliderOffset = this.$slider.offset() as JQueryCoordinates;
    const selectedPixel = e.pageX - $sliderOffset.left - this.$control[0].width()! / 2

    $(this).trigger('view:selectChanged', [selectedControlIndex, selectedPixel])
  }

  public updatePosAndValue(selectedControlIndex: number, selectedPixel: number, value: string) {
    this.$control[selectedControlIndex].changeControlPos(selectedPixel, this.sliderWidth)
    this.$control[selectedControlIndex].$controlInfo.text = value
  }

  @boundMethod
  mouseUp(e: JQueryEventObject) {
    this.$slider.$selectedControl = null
    $('html').off('mousemove')
    $('html').off('mouseup')
  }

  get isSnapping() {
    return this.state.snapping
  }

  public get sliderWidth():number {
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
    const $sliderOffset = this.offset() as JQueryCoordinates;
    const selectedPixel = evt.pageX - $sliderOffset.left - this.$control[0].width()! / 2

    let closestControlIndex: number = 0;
    
    if (this.$control.length > 1) {
      const arrOfControlPos = [this.$control[0].left, this.$control[1].left];

      closestControlIndex = arrOfControlPos.indexOf(
        arrOfControlPos.reduce((a:number, b:number) => {
          return Math.abs(b - selectedPixel) < Math.abs(a - selectedPixel) ? b : a;
        })
      )
    }

    this.$selectedControl = this.$control[closestControlIndex]
    
    return closestControlIndex;
  }

  public offset() {
    return $(this.$el).offset()
  }

  get width():number {
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

  changeControlPos(left: number, sliderWidth:number) {
    if (left >= sliderWidth) {
      $(this.$el).css('left', sliderWidth)
    } else if (left <= 0) {
      $(this.$el).css('left', 0)
    } else {
      $(this.$el).css('left', left)
    }
  }
  public get left() {
    return parseInt($(this.$el).css('left'))
  }

  public width() {
    return $(this.$el).width()
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
