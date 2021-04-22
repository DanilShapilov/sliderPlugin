import {boundMethod} from 'autobind-decorator'
import { deepCopy } from './helpers';
import { Slider } from './subViews/Slider';
import { Control } from './subViews/Control';
export class SliderView implements ISliderView{
  private $root: HTMLDivElement;

  private $slider!: Slider
  private $control!: Control[]

  private state: IPluginConfig

  constructor($root: HTMLDivElement, state:IPluginConfig) {
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