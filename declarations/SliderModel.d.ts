interface ISliderModel extends IPluginMethods {
    init(sliderWidth: number): void
    callSubs(): void
    updateStateCurrent(selectedControlIndex: number, selectedPixel: number): void
    pixelOfCurrent(index: number): number
    readonly currentArr: number[]
    callSubs(): void
    resizeLogic(newSliderWidth: number): void
  }