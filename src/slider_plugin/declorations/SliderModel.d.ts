interface ISliderModel extends IPluginMethods {
    init(sliderWidth: number): void
    callSubs(): void
    updateStateCurrent(selectedControlIndex: number, selectedPixel: number): void
    getState(): IPluginConfig
    pixelOfCurrent(index: number): number
    currentValue(index: number): string
    readonly currentArr: number[]
    callSubs(): void
  }