import { SliderPresenter } from './SliderPresenter'
import { SliderView } from './SliderView'
import './style.scss'
import { SliderModel } from './SliderModel';
import './interfaces';


export class sliderPlugin{
    private _el: HTMLElement;
    private _$el: JQuery;
    private _initSettings: PluginConfig;

    private view!: SliderView
    private model!: SliderModel
    private presenter!: SliderPresenter

    public selectedValues: () => string | string[];
    public resized: () => void

    constructor(element: HTMLElement, options: PluginConfig) {
        this._el = element;
        this._$el = $(element);
        this._initSettings = options

        this.selectedValues = () => this.model.selectedValues;

        this.resized = () => { $(this.presenter).trigger('plugin:resized') }

        this.init()
    }

    static resizeObserver: ResizeObserver = new ResizeObserver(entries =>{
      entries.forEach( e => {
        const element = e.target
        $(element).data('sliderPlugin').resized()
      })
    })

    async init(){
      this.view = await new SliderView(this._$el, this._initSettings);
      this.model = await new SliderModel(this._initSettings);
      this.presenter = await new SliderPresenter(this.model, this.view);

      await this.observeResize()
    }

    observeResize(){
      sliderPlugin.resizeObserver.observe(this._el)
    }
}