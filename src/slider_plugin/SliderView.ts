import {boundMethod} from 'autobind-decorator'
import { deepCopy } from './helpers';
export class SliderView implements ISliderView{
  private $root: JQuery;

  private $slider!: JQuery
  private $sliderControl!: JQuery
  private $sliderControlInfo!: JQuery

  private state: IViewState

  constructor($root: JQuery, state:IViewState) {
    this.state = deepCopy(state)

    this.$root = $root
  }

  init() {
    $(this.$root).html(this.toHTML(this.state.class))

    this.$slider = $(this.$root).find('.slider')
    this.$sliderControl = $(this.$slider).find('.slider__control')
    this.$sliderControlInfo = $(this.$sliderControl).find('.slider__control-info')

    $(this.$root).on('mousedown', this.eventHandler.bind(this))
  }

  @boundMethod
  eventHandler(e: JQueryEventObject) {
    this.changePos(e)    

    $('html').on('mousemove', this.mousemoveHandler)
    $('html').on('mouseup', this.mouseUp)
  }

  @boundMethod
  mousemoveHandler(e: JQueryEventObject) {    
    this.changePos(e)
  }

  changePos(e: JQueryEventObject) {
    const selectedPixel: number = this.calculatePosForControl(e)
    $(this).trigger('view:selectChanged', selectedPixel)  
  }

  public updatePosAndValue(selectedPixel: number, value: string) {
    this.changeControlPos(selectedPixel)
    $(this.$sliderControlInfo).text(value)
  }



  mouseUp(e: JQueryEventObject) {
    $('html').off('mousemove')
    $('html').off('mouseup')
  }

  calculatePosForControl(evt: JQueryEventObject) {
    const $sliderOffset = this.$slider.offset() as JQueryCoordinates;
    return evt.pageX - $sliderOffset.left - this.$sliderControl.width()! / 2
  }

  changeControlPos(left: number) {
    if (left >= this.sliderWidth) {
      $(this.$sliderControl).css('left', this.sliderWidth)
    } else if (left <= 0) {
      $(this.$sliderControl).css('left', 0)
    } else {
      $(this.$sliderControl).css('left', left)
    }
  }

  public get sliderWidth():number {
    return this.$slider.width()! - this.$sliderControl.width()! as number
  }

  toHTML(sliderClass:string) {
    return `
      <div class="slider ${sliderClass}">
        <div class="slider__control">
          <div class="slider__control-info"></div>
        </div>
      </div>
    `
  }
}

