import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import { SliderModel } from './SliderModel';
import './interfaces';
import './style.scss'
// skins
import './skins/toxin.scss'
import './skins/material.scss'
import './skins/fine_tune_circle.scss'
import './skins/fine_tune_square.scss'


export class SliderPlugin implements ISliderPlugin {
   #_el: HTMLElement;
   #_$el: JQuery;
   #_initSettings: IPluginConfig;
   #_view!: SliderView
   #_model!: SliderModel
   #_presenter!: SliderPresenter

  constructor(element: HTMLElement, options: IPluginConfig) {
    this.#_el = element;
    this.#_$el = $(element);
    this.#_initSettings = options

    this.init()
  }

  static resizeObserver: ResizeObserver = new ResizeObserver(entries => {
    entries.forEach(e => {
      const element = e.target
      $(element).data('sliderPlugin').resized()
    })
  })

  private async init() {
    this.#_view = await new SliderView(this.#_$el, this.#_initSettings);
    this.#_model = await new SliderModel(this.#_initSettings);
    this.#_presenter = await new SliderPresenter(this.#_model, this.#_view);

    await this.observeResize()
  }
  resized = () => { $(this.#_view).trigger('view:resized') }
  selectedValues = () => this.#_model.selectedValues();
  allValues = () => this.#_model.allValues()
  deleteSelected = () => this.#_model.deleteSelected()

  chooseValue = (first: string | number, last: string | number) => {this.#_model.chooseValue(first, last); return this}
  newRange = (val: string[] | number[]) => {this.#_model.newRange(val); return this}
  generateValues = (val: boolean) => {this.#_model.generateValues(val); return this}
  changeStep = (val: number) => {this.#_model.changeStep(val); return this}
  snapping = (val: boolean) => {this.#_model.snapping(val); return this}
  changeClass = (val:string) => {this.#_model.changeClass(val); return this}
  selectRange = (val:boolean) => {this.#_model.selectRange(val); return this}
  vertical = (val:boolean) => {this.#_model.vertical(val); return this}
  progressBar = (val:boolean) => {this.#_model.progressBar(val); return this}
  showSelected = (val: showSelectedValue | boolean) => {this.#_model.showSelected(val); return this}
  showScale = (val:boolean) => {this.#_model.showScale(val); return this}
  scaleStep = (val: number) => {this.#_model.scaleStep(val); return this}
  scaleHighlighting = (val: boolean) => {this.#_model.scaleHighlighting(val); return this}

  subscribe = (func: Function) => {this.#_model.subscribe(func); return this}
  unsubscribe = (func: Function) => {this.#_model.unsubscribe(func); return this}
  
  observeResize() {
    SliderPlugin.resizeObserver.observe(this.#_el)
  }
}