import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import './style.scss'
import { SliderModel } from './SliderModel';
import './interfaces';


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

  selectedValues = () => this._model.selectedValues;
  resized = () => { $(this._view).trigger('view:resized') }
  chooseValue = (first: string | number, last: string | number) => this._model.chooseValue(first, last)
  allValues = () => this._model.getState().range as string[]
  deleteSelected = () => this._model.deleteSelected()
  newRange = (value: string[] | number[]) => this._model.newRange(value)
  changeStep = (value: number) => this._model.changeStep(value)
  snapping = (val: boolean) => this._model.snapping(val)
  changeClass = (val:string) => this._model.changeClass(val)
  selectRange = (val:boolean) => this._model.selectRange(val)
  vertical = (val:boolean) => this._model.vertical(val)
  progressBar = (val:boolean) => this._model.progressBar(val)
  showSelected = (val: showSelectedValue | boolean) => this._model.showSelected(val)


  // obj:{
  //   _range: [0, 100],
  //   _step: 1,
  //   _current: [0],
  //   _snapping: false,
  //   _class: '',
  //   _selectRange: false,
  //   _vertical: false,
  //   _progressBar: true,
  //   showSelected: 'always',

  //   showScale: false,
  //   scaleStep: 1,
  //   scaleHighlighting: true
  // }
  observeResize() {
    sliderPlugin.resizeObserver.observe(this._el)
  }
}