import { Control } from "./Control"

export class ProgressBar implements IProgressBar{
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