import { SliderView } from './SliderView'
import { SliderModel } from "./SliderModel";

export class SliderPresenter {
  constructor(public model:SliderModel, public view:SliderView) {

    this.view.init()
    this.model.init(this.view.sliderWidth)

    this.initEvents()

    this.initTrigger()
  }

  initEvents() {
    $(this.view).on("view:selectChanged", (_e, selectedPixel) =>{
      this.model.updateStateCurrent(selectedPixel)
      if (this.model.isSnapping) {
        selectedPixel = this.model.pixelOfCurrent
      }
      this.view.updatePosAndValue(selectedPixel, this.model.currentValue)
    })
  }

  initTrigger() {
    $(this.view).trigger("view:selectChanged", this.model.pixelOfCurrent)
  }
}