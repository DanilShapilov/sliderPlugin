interface ISliderView {
  init(): void
  updateState(newState: IPluginConfig): void
  updatePosAndValue(selectedControlIndex: number,
    selectedPixel: number,
    value: string,
    current: number[]): void
  readonly isSnapping: boolean
  readonly sliderLength: number
  destroy(): void
}

interface ISlider {
  $el: HTMLDivElement
  $progressBar: IProgressBar
  $scale: IScale
  updateState(newState: IPluginConfig): void
  getSelectedControlIndex(evt: JQueryEventObject): number
  setSelectedToNull(): void
  removeZindex(): void
  offset(): number
  readonly length: number
  readonly HTML: HTMLDivElement
}

interface IProgressBar {
  updateState(visible: boolean): void
  readonly element: HTMLDivElement
}

interface IControl {
  $el: HTMLDivElement
  $controlInfo: IControlInfo
  width(): number
  height(): number
  updateState(showSelected: showSelectedValue): void
  changeControlPos(newPos: number,
    sliderWidth: number,
    isVertical: boolean): void
  position(isVertival: boolean): number
  readonly getIndex: number
}

interface IScale {
  highliteEls(current: number[]): void
  updateState(newState: IPluginConfig): void
  updateElsState(): void
}

interface IControlInfo {
  text: string
  readonly element: HTMLDivElement
}