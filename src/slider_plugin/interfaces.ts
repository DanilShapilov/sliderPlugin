interface JQuery {
  sliderPlugin(options?: object): JQuery
}

interface PluginConfig {
  range: number[] | string[]
  rangeOfPixels?: number[];
  step: number
  current: number
  snapping: boolean
}


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
interface AllowedLeftObj {
  minLeft: number,
  maxLeft: number
}

