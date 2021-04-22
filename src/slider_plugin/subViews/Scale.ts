export class Scale implements IScale {
  private $wrapper: HTMLDivElement
  private $els: HTMLDivElement[] = []
  constructor(private state:IPluginConfig, private $root:HTMLDivElement) {
    this.$wrapper = document.createElement('div')
    this.$wrapper.classList.add('scale')
    if (this.state.vertical) {
      this.$wrapper.classList.add('vertical')
    }

    if (this.state.rangeOfPixels) {
      if (this.$els.length === 0 || this.$els.length !== this.state.range.length) {
        this.generateScale()
      }else {
        this.updateElsState()
      }
    }
  }

  highliteEls(current: number[]){
    if (!this.state.showScale) {
      return
    }
    this.$els.forEach( (el, index) =>{
      if ( this.shouldBeHighlited(current, index) ) {
        el.classList.add('selected')
      }else {
        el.classList.remove('selected')
      }
    })
  }

  private shouldBeHighlited(current: number[], index:number){
    if (this.state.scaleHighlighting) {
      let min = current[0]
      let max = current[1]
      if (min > max) {
        [min, max] = [max, min]
      }
      if ( (current.length > 1) 
      && ( (index >= min) 
      && (index <= max) ) ) {
        return true
      }
    }
      return current.includes(index)
  }

  private generateScale(){
    $(this.$wrapper).empty()
    this.$els = []

    this.state.range?.forEach( (value: string | number, index:number, arr: string[] | number[]) => {
      const el = document.createElement('div')
      el.classList.add('scale__el')
      const line = document.createElement('div')
      line.classList.add('scale__line')
      const val = document.createElement('div')
      val.classList.add('scale__val')
      val.textContent = value as string

      this.handleHidden(index, el, arr.length)

      el.append(line, val)

      this.$els.push(el)

      if (this.state.vertical) {
        $(el).css('top', this.state.rangeOfPixels![index])
      }else{
        $(el).css('left', this.state.rangeOfPixels![index])
      }
      
    } )
    this.$els.forEach((el) => {
      this.$wrapper.appendChild(el)
    })
    this.$root.appendChild(this.$wrapper)
  }

  updateState(newState: IPluginConfig){
    this.state = {
      ...this.state,
      ...newState
    }
    this.highliteEls(this.state.current)
    if (this.state.showScale) {
      $(this.$wrapper).css('display', '')
    }else if (!this.state.showScale){
      $(this.$wrapper).css('display', 'none')
    }
    if (this.$els.length === 0 || this.$els.length !== this.state.range.length) {
      this.generateScale()
    }else {
      this.updateElsState()
    }
  }

  updateElsState() {
    this.$els.forEach((el, index, arr) => {
      const scaleVal = el.querySelector('.scale__val')!
      scaleVal.textContent = this.state.range[index] as string

      el.classList.remove('hidden')
      this.handleHidden(index, el, arr.length)

      if (this.state.vertical) {
        $(el).css('top', this.state.rangeOfPixels![index])
        $(el).css('left', '')
      }else{
        $(el).css('left', this.state.rangeOfPixels![index])
        $(el).css('top', '')
      }
    })
  }

  private handleHidden(index: number, el: HTMLElement, elsArrLength: number){
    if (index % this.state.scaleStep !== 0) {
      el.classList.add('hidden')

      if (this.state.scaleStep === 0) {
        const isOdd = (elsArrLength) % 2 !== 0
        
        if (index === 0 
          || index === elsArrLength-1 
          || (isOdd && index === (elsArrLength - 1) / 2 )) {
          el.classList.remove('hidden')
        }
      }
    }
  }
}