interface View {
  attach(observer: Observer): void;

  // Отсоединяет наблюдателя от издателя.
  detach(observer: Observer): void;

  // Уведомляет всех наблюдателей о событии.
  notify(): void;
}
interface Observer {
  // Получить обновление от субъекта.
  update(subject: View): void;
}

export class SliderView implements View {
  private state: PluginConfig
  private observers: Observer[] = [];
  private $root: JQuery;

  private $sliderControl!: JQuery
  private $sliderControlInfo!: JQuery

  private allowedLeftForControl!: object;
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
    this.mouseupHandler = this.mouseupHandler.bind(this)
    


    $(this.$root).on('mousedown', this.eventHandler.bind(this))
  }
  
  eventHandler(e: JQueryEventObject) {
    console.log('mousedown', e);

    this.allowedLeftForControl = {
      minLeft: this.$root.offset()?.left,
      maxLeft: this.$root.offset()?.left! + this.$root.width()!
    }
    this.changeControlPos(e.offsetX)
    console.log(e);
    
    
    $('body').on('mousemove', this.mousemoveHandler)
    $('body').on('mouseup', this.mouseupHandler)
  }

  mousemoveHandler(e: Event) {
    // console.log('root',this.$root.width());
    // console.log('sliderControl',this.$sliderControl.offset());
    
  }

  mouseupHandler(e: Event) {
    console.log('mouseupHandler');
    
    $('body').off('mousemove')
    $('body').off('mouseup')
  }

  changeControlPos(left: number) {
    // if (left >= this.allowedLeftForControl.maxLeft) {
      
    // }
    $(this.$sliderControl).css('left', left)
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

