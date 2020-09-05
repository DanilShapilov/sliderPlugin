import { ControlInfo } from "./ControlInfo";

export class Control implements IControl{
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