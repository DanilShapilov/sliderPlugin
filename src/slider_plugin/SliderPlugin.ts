import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import { SliderModel } from './SliderModel';
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
   #_view!: ISliderView
   #_model!: ISliderModel
   #_presenter!: ISliderPresenter

  constructor(element: HTMLElement, options: IPluginConfig) {
    this.#_el = element;
    this.#_$el = $(element);
    this.#_initSettings = options

    this.init()
  }

  private static resizeObserver: ResizeObserver = new ResizeObserver(entries => {
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
  resized() { $(this.#_view).trigger('view:resized') }
  
  selectedValues = () => this.#_model.selectedValues();
  allValues = () => this.#_model.allValues()
  deleteSelected = () => this.#_model.deleteSelected()
  currentValue = (index: number) => this.#_model.currentValue(index)
  getInitRange = () => this.#_model.getInitRange()
  getState = () => this.#_model.getState()

  chooseValue = (first: string | number, last: string | number): ISliderPlugin => {this.#_model.chooseValue(first, last); return this}
  newRange = (val: string[] | number[]): ISliderPlugin => {this.#_model.newRange(val); return this}
  generateValues = (val: boolean): ISliderPlugin => {this.#_model.generateValues(val); return this}
  changeStep = (val: number): ISliderPlugin => {this.#_model.changeStep(val); return this}
  snapping = (val: boolean): ISliderPlugin => {this.#_model.snapping(val); return this}
  changeClass = (val:string): ISliderPlugin => {this.#_model.changeClass(val); return this}
  selectRange = (val:boolean): ISliderPlugin => {this.#_model.selectRange(val); return this}
  vertical = (val:boolean): ISliderPlugin => {this.#_model.vertical(val); return this}
  progressBar = (val:boolean): ISliderPlugin => {this.#_model.progressBar(val); return this}
  showSelected = (val: showSelectedValue | boolean): ISliderPlugin => {this.#_model.showSelected(val); return this}
  showScale = (val:boolean): ISliderPlugin => {this.#_model.showScale(val); return this}
  scaleStep = (val: number): ISliderPlugin => {this.#_model.scaleStep(val); return this}
  scaleHighlighting = (val: boolean): ISliderPlugin => {this.#_model.scaleHighlighting(val); return this}

  subscribe = (func: Function): ISliderPlugin => {this.#_model.subscribe(func); return this}
  unsubscribe = (func: Function): ISliderPlugin => {this.#_model.unsubscribe(func); return this}
  
  private observeResize() {
    SliderPlugin.resizeObserver.observe(this.#_el)
  }
}