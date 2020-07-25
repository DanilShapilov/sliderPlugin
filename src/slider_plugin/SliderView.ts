export class SliderView implements View {
  private state: PluginConfig
  private observers: Observer[] = [];
  private $root: JQuery;

  private $sliderControl!: JQuery
  private $sliderControlInfo!: JQuery

  // private $rangeOfPixels: IRangeOfPixels;
  private allowedLeftForControl!: AllowedLeftObj;
  constructor($root: JQuery, config: PluginConfig) {
    this.state = { ...config }

    this.$root = $root
  }

  init() {
    $(this.$root).html(this.toHTML())

    this.$sliderControl = $(this.$root).find('.slider__control')
    this.$sliderControlInfo = $(this.$sliderControl).find('.slider__control-info')

    this.generateAllowedLeftForControl()

    this.generateRangeOfPixels()
    this.updateValueInControlInfo()
    this.changeControlPos(this.state.rangeOfPixels![this.state.current])

    this.eventHandler = this.eventHandler.bind(this)
    this.mousemoveHandler = this.mousemoveHandler.bind(this)
    this.mouseUp = this.mouseUp.bind(this)

    $(this.$root).on('mousedown', this.eventHandler.bind(this))
  }

  eventHandler(e: JQueryEventObject) {
    this.changePosUpdateStateCurrent(e)    

    $('html').on('mousemove', this.mousemoveHandler)
    $('html').on('mouseup', this.mouseUp)
  }

  mousemoveHandler(e: JQueryEventObject) {    
    this.changePosUpdateStateCurrent(e)
  }

  changePosUpdateStateCurrent(e: JQueryEventObject) {
    const selectedPixel: number = this.calculatePosForControl(e)
    this.updateStateCurrent(selectedPixel)
    // step logic
    

    if (this.state.snapping) {
      this.changeControlPos(this.state.rangeOfPixels![this.state.current])
    }else {
      this.changeControlPos(selectedPixel)
    }
   
    this.updateValueInControlInfo()
  }

  handleStep(e: JQueryEventObject) {
    // ПРОЩЕ ПОМЕНЯТЬ ВХОДЯЩИЙ МАССИВ
    if ( this.state.step > 1 && (this.state.current % this.state.step) === 0) {
      // this.state.current = prevCurrent;
      e = {...e, pageX: this.state.rangeOfPixels![this.state.current]}
      this.changePosUpdateStateCurrent(e)
      return;
    }
  }

  updateValueInControlInfo() {
    $(this.$sliderControlInfo).text(this.state.range[this.state.current])
  }

  updateStateCurrent(selectedPixel: number) {
    const closest:number = this.state.rangeOfPixels!.reduce((a:number, b:number, i:number) => {
      return Math.abs(b - selectedPixel) < Math.abs(a - selectedPixel) ? b : a;
    });

    const closestIndex = this.state.rangeOfPixels?.indexOf(closest) as number
    this.state.current = closestIndex
  }

  generateRangeOfPixels() {
    const pixelStep = this.allowedLeftForControl.maxLeft / (this.state.range.length - 1);
    const rangeOfPixels =
      (this.state.range as string[])
        .map((_el, index) => {
          return Math.round(index * pixelStep)
        })
    this.state.rangeOfPixels = rangeOfPixels
  }

  generateAllowedLeftForControl() {
    this.allowedLeftForControl = {
      minLeft: 0,
      maxLeft: this.$root.width()! - this.$sliderControl.width()!
    }
  }

  mouseUp(e: JQueryEventObject) {
    $('html').off('mousemove')
    $('html').off('mouseup')

    this.handleStep(e)
  }

  calculatePosForControl(evt: JQueryEventObject) {
    const $rootOffset = this.$root.offset() as JQueryCoordinates;
    return evt.pageX - $rootOffset.left - this.$sliderControl.width()! / 2
    //DEBUG
    // console.log('offset', this.$root.offset());
    // console.log('pos', this.$root.position());
  }

  changeControlPos(left: number) {
    if (left >= this.allowedLeftForControl.maxLeft) {
      $(this.$sliderControl).css('left', this.allowedLeftForControl.maxLeft)
    } else if (left <= this.allowedLeftForControl.minLeft) {
      $(this.$sliderControl).css('left', this.allowedLeftForControl.minLeft)
    } else {
      $(this.$sliderControl).css('left', left)
    }
  }

  toHTML() {
    return `
      <div class="slider">
        <div class="slider__control">
          <div class="slider__control-info">${this.state.current}</div>
        </div>
      </div>
    `
  }

  public attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    console.log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }

  /**
   * Запуск обновления в каждом подписчике.
   */
  public notify(): void {
    console.log('Subject: Notifying observers...');
    for (const observer of this.observers) {
      observer.update(this);
    }
  }


}

