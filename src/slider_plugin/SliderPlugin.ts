import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import { SliderModel } from './SliderModel';
import './interfaces';
import './style.scss'
import './skins.scss'


export class sliderPlugin {
  private _el: HTMLElement;
  private _$el: JQuery;
  private _initSettings: PluginConfig;

  private _view!: SliderView
  private _model!: SliderModel
  private _presenter!: SliderPresenter

  constructor(element: HTMLElement, options: PluginConfig) {
    this._el = element;
    this._$el = $(element);
    this._initSettings = options

    this.init()
  }

  static resizeObserver: ResizeObserver = new ResizeObserver(entries => {
    entries.forEach(e => {
      const element = e.target
      $(element).data('sliderPlugin').resized()
    })
  })

  async init() {
    this._view = await new SliderView(this._$el, this._initSettings);
    this._model = await new SliderModel(this._initSettings);
    this._presenter = await new SliderPresenter(this._model, this._view);

    await this.observeResize()
  }
  resized = () => { $(this._view).trigger('view:resized') }
  selectedValues = () => this._model.selectedValues;
  chooseValue = (first: string | number, last: string | number) => this._model.chooseValue(first, last)
  allValues = () => this._model.getState().range as string[]
  deleteSelected = () => this._model.deleteSelected()

  newRange = (val: string[] | number[]) => this._model.newRange(val)
  generateValues = (val: boolean) => this._model.generateValues(val)
  changeStep = (val: number) => this._model.changeStep(val)
  snapping = (val: boolean) => this._model.snapping(val)

  changeClass = (val:string) => this._model.changeClass(val)
  selectRange = (val:boolean) => this._model.selectRange(val)
  vertical = (val:boolean) => this._model.vertical(val)
  progressBar = (val:boolean) => this._model.progressBar(val)
  showSelected = (val: showSelectedValue | boolean) => this._model.showSelected(val)
  showScale = (val:boolean) => this._model.showScale(val)
  scaleStep = (val: number) => this._model.scaleStep(val)
  scaleHighlighting = (val: boolean) => this._model.scaleHighlighting(val)

  subscribe = (func: Function) => this._model.subscribe(func)
  unsubscribe = (func: Function) => this._model.unsubscribe(func)
  
  observeResize() {
    sliderPlugin.resizeObserver.observe(this._el)
  }
}