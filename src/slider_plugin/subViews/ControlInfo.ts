export class ControlInfo implements IControlInfo {
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