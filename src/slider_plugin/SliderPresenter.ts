import { SliderView } from './SliderView'
import { SliderModel } from "./SliderModel";

export class SliderPresenter {
  constructor(public model:SliderModel, public view:SliderView) {

    this.view.init()
    this.model.init(this.view.sliderLength)

    this.initEvents()

    this.initTrigger()
  }

  initEvents() {
    $(this.view).on("view:selectChanged", (_e, selectedControlIndex, selectedPixel) =>{
      this.model.updateStateCurrent(selectedControlIndex, selectedPixel)
      if (this.view.isSnapping) {
        selectedPixel = this.model.pixelOfCurrent(selectedControlIndex)
      }
      console.log('selectedValues: ', this.model.selectedValues);
      
      this.view.updatePosAndValue(selectedControlIndex, selectedPixel, this.model.currentValue(selectedControlIndex))
    })
  }

  initTrigger() {
    $(this.view).trigger("view:selectChanged", [
      0,
      this.model.pixelOfCurrent(0)
    ])
    if (this.model.currentArr.length > 1) {
      $(this.view).trigger("view:selectChanged", [
        1,
        this.model.pixelOfCurrent(1)
      ])
    }
  }
}