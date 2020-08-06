import { SliderView } from './SliderView'
import { SliderModel } from "./SliderModel";
import { debounce } from './helpers';

export class SliderPresenter {
  private debouncedCallSubs!: Function
  constructor(public model: SliderModel, public view: SliderView) {

    this.view.init()
    this.model.init(this.view.sliderLength)

    this.view.updateState(this.model.getState())

    this.debouncedCallSubs = debounce(this.model.callSubs, 300, this.model)

    this.initEvents()

    this.initTrigger()
  }

  initEvents() {
    $(this.view).on("view:selectChanged", (_e, selectedControlIndex, selectedPixel) => {
      this.model.updateStateCurrent(selectedControlIndex, selectedPixel)
      if (this.view.isSnapping) {
        selectedPixel = this.model.pixelOfCurrent(selectedControlIndex)
      }

      this.debouncedCallSubs()

      this.view.updatePosAndValue(selectedControlIndex, selectedPixel, this.model.currentValue(selectedControlIndex), this.model.currentArr)
    })

    $(this.view).on('view:resized', () => {
      this.model.resizeLogic(this.view.sliderLength)
      this.view.updateState(this.model.getState())

      this.initTrigger()
    })

    $(this.model).on('model:stateChanged', (_e, type: string) => {
      if (type === 'updateViewState') {

        this.view.updateState(this.model.getState())

      } else if (type === 'redrawWholeView') {

        this.view.destroy()
        this.view.updateState(this.model.getState())
        this.view.init()
      }

      this.initTrigger()
    })
  }

  initTrigger() {
    $(this.view).trigger("view:selectChanged", [
      0,
      this.model.pixelOfCurrent(0)
    ])
    if (this.model.getState().selectRange) {
      $(this.view).trigger("view:selectChanged", [
        1,
        this.model.pixelOfCurrent(1)
      ])
    }
  }

}