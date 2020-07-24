export class SliderView implements View {
  private state: PluginConfig
  private observers: Observer[] = [];
  private $root: JQuery;

  private $sliderControl!: JQuery
  private $sliderControlInfo!: JQuery

  private allowedLeftForControl!: AllowedLeftObj;
  constructor($root:JQuery, config: PluginConfig) {
    this.state = {...config}
    
    this.$root = $root
  }

  init() {
    $(this.$root).html(this.toHTML())

    this.$sliderControl = $(this.$root).find('.slider__control')
    this.$sliderControlInfo = $(this.$sliderControl).find('.slider__control-info')

    this.eventHandler = this.eventHandler.bind(this)
    this.mousemoveHandler = this.mousemoveHandler.bind(this)
    this.destroyEvents = this.destroyEvents.bind(this)
    


    $(this.$root).on('mousedown', this.eventHandler.bind(this))
  }
  
  eventHandler(e: JQueryEventObject) {
    this.allowedLeftForControl = {
      minLeft: 0,
      maxLeft: this.$root.width()! - this.$sliderControl.width()!
    }
    
    this.changeControlPos(this.calculatePosForControl(e))    
    
    $('html').on('mousemove', this.mousemoveHandler)
    $('html').on('mouseup', this.destroyEvents)
  }

  mousemoveHandler(e: JQueryEventObject) {
    this.changeControlPos(this.calculatePosForControl(e))
  }

  destroyEvents(e: Event) {
    $('html').off('mousemove')
    $('html').off('mouseup')
  }

  calculatePosForControl(evt: JQueryEventObject) {
    const $rootOffset = this.$root.offset();
    return evt.pageX - $rootOffset?.left!
    //DEBUG
    // console.log('offset', this.$root.offset());
    // console.log('pos', this.$root.position());
  }

  changeControlPos(left: number) {
    left -= this.$sliderControl.width()! / 2
    if (left >= this.allowedLeftForControl.maxLeft) {
      $(this.$sliderControl).css('left', this.allowedLeftForControl.maxLeft)
    }else if (left <= this.allowedLeftForControl.minLeft) {
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

