import { debounce } from './helpers';

export class SliderPresenter implements ISliderPresenter {
  private debouncedCallSubs!: Function
  constructor(private model: ISliderModel, private view: ISliderView) {
    this.debouncedCallSubs = debounce(this.model.callSubs, 300, this.model)
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

    $(this.model).on('model:stateChanged', async (_e, type: string) => {
      if(type === 'chooseValue'){
        this.initTrigger()
        return
      }
      const needToRedraw = ['vertical', 'selectRange', 'changeClass'].includes(type);
      if (!needToRedraw) {
        this.view.updateState(this.model.getState())
        this.initTrigger()
      } else {
        await this.view.destroy()
        await this.view.updateState(this.model.getState())
        await this.view.init()
        await $(this.view).trigger('view:resized')
      }
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

  destroy() {
    $(this.view).off("view:selectChanged")
    $(this.view).off('view:resized')
    $(this.model).off('model:stateChanged')
  }
}