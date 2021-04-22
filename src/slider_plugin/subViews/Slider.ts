import { Control } from "./Control"
import { ProgressBar } from "./ProgressBar"
import { Scale } from "./Scale"

export class Slider implements ISlider{
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