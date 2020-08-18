import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import { SliderModel } from './SliderModel';
import './style.scss'
// skins
import './skins/toxin.scss'
import './skins/material.scss'
import './skins/fine_tune_circle.scss'
import './skins/fine_tune_square.scss'
import { resizeObserver } from './helpers';


export class SliderPlugin implements ISliderPlugin {
   #_rootEl: HTMLDivElement;
   #_view: ISliderView
   #_model: ISliderModel
   #_presenter: ISliderPresenter

  constructor(rootEl: HTMLDivElement, view: ISliderView, model: ISliderModel, presenter: ISliderPresenter) {
    this.#_rootEl = rootEl;

    this.#_view = view
    this.#_model = model
    this.#_presenter = presenter

    resizeObserver.observe(this.#_rootEl)
    this.init()
  }

  private async init(){
    await this.#_view.init()
    await this.#_model.init(this.#_view.sliderLength)

    await this.#_view.updateState(this.#_model.getState())

    await this.#_presenter.initEvents()

    await this.#_presenter.initTrigger()
  }

  destroy() {
    resizeObserver.unobserve(this.#_rootEl)
    this.#_view.destroy()
    this.#_presenter.destroy()
    // remove SliderPlugin instance
    $(this.#_rootEl).removeData('sliderPlugin');
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
}