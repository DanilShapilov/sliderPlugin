createSliders()
async function createSliders() {
  await $(".sliderPlugin1").sliderPlugin({
    range: [-100, 100],
    current: [6, 12],
    step: 10,
    snapping: true,
    selectRange: true,
    progressBar: true,
    class: 'sp-skin--material',
    showSelected: 'hover',
    showScale: true,
    scaleStep: 5
  })
  
  await $(".sliderPlugin2").sliderPlugin({
    range: ['А', 'я'],
    current: [7, 42],
    class: 'sp-skin--fine-tune-square',
    snapping: true,
    selectRange: true,
    vertical: true
  })
  
  await $(".sliderPlugin3").sliderPlugin({
    range: ['A', 'z'],
    snapping: true,
    class: 'sp-skin--fine-tune-circle',
    current: [0,6],
    selectRange: true,
    showScale: true,
    scaleStep: 3
  })
  
  await $(".sliderPlugin4").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    class: 'sp-skin--toxin',
    current: [2, 5],
    selectRange: true,
    showScale: true,
    step: 10
  })
  
  await $(".sliderPlugin5").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    current: [2, 5],
    selectRange: true,
    showScale: true,
    scaleHighlighting: false,
    step: 10
  })
  
  await $(".sliderPlugin6").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6, 7],
    current: [0],
    snapping: true,
    showScale: true,
    scaleStep: 0
  })  
  await createControls()
}



class CreateControls {
  constructor(sliderEl){
    this.$slider = sliderEl
    this.$main = document.createElement('div');
    this.$main.classList.add('control')

    this.$main.append(this.container())

    this.$main.append(this.selectedValues())
    this.$main.append(this.chooseValue())
    this.$main.append(this.newRange())
    this.$main.append(this.generateValues())
    this.$main.append(this.changeStep())
    this.$main.append(this.snapping())
    this.$main.append(this.changeClass())
    this.$main.append(this.selectRange())
    this.$main.append(this.vertical())
    this.$main.append(this.progressBar())
    this.$main.append(this.showSelected())
    this.$main.append(this.showScale())
    this.$main.append(this.scaleStep())
    this.$main.append(this.scaleHighlighting())
  }

  container(){
    const wrapper = document.createElement('div')
    wrapper.classList.add('container-controls')
    const inputWidth = document.createElement("input")
    const inputHeight = document.createElement("input")
    const container = $(this.$slider).closest('.container')
    inputWidth.type = inputHeight.type = "number"
    inputWidth.value = container.width()
    inputWidth.onchange = () => {
      container.width(+inputWidth.value)
    }
    inputHeight.type = inputHeight.type = "number"
    inputHeight.value = container.height()
    inputHeight.onchange = () => {
      container.height(+inputHeight.value)
    }

    wrapper.append(`Контейнер width/height`, inputWidth, inputHeight)
    return wrapper
  }

  selectedValues(){
    const wrapper = document.createElement('div',)
    const btnSelected = document.createElement('button')
    const btnAll = document.createElement('button')
    const btnDelSelected = document.createElement('button')
    const textArea = document.createElement('textarea')
    textArea.value = JSON.stringify(this.methods.selectedValues(), null, 2)
    btnSelected.textContent = 'Получить выбранные'
    btnSelected.onclick = () => {
      textArea.value = JSON.stringify(this.methods.selectedValues(), null, 2)
    }
    btnAll.textContent = 'Получить все значения'
    btnAll.onclick = () => {
      textArea.value = JSON.stringify(this.methods.allValues(), null, 2)
    }
    btnDelSelected.textContent = 'Удалить выбранные и показать их'
    btnDelSelected.onclick = () => {
      textArea.value = this.methods.deleteSelected()
    }
    

    wrapper.append(btnSelected, btnAll, btnDelSelected, textArea)
    return wrapper
  }

  chooseValue(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    const firstInput = document.createElement('input')
    firstInput.value = this.methods.currentValue(0)
    let lastInput;
    const lastVal = this.methods.currentValue(1);
    if (lastVal) {
      lastInput = document.createElement('input')
      lastInput.value = lastVal
    }
    
    btn.textContent = 'Выбрать значения'
    btn.onclick = () => {this.methods.chooseValue(firstInput.value, lastInput === undefined ? undefined : lastInput.value)}

    wrapper.append(`Если значение существует, оно будет выбрано [бегунок 1, бегунок 2]`, btn, firstInput, lastInput ?? '')
    return wrapper
  }

  newRange(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    const textArea = document.createElement('textarea')
    textArea.value = JSON.stringify(this.methods.getInitRange(), null, 2)
    btn.textContent = 'Задать новый диапазон'
    btn.onclick = () => {
      this.methods.newRange(JSON.parse(textArea.value))
    }

    wrapper.append(btn, textArea)
    return wrapper
  }

  generateValues(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let generateValuesState = this.methods.getState().generateValues
    btn.textContent = `${generateValuesState ? 'Выключить' : 'Включить'} генерацию`
    btn.onclick = () => {
      this.methods.generateValues(!generateValuesState)
      generateValuesState = !generateValuesState
      btn.textContent = `${generateValuesState ? 'Выключить' : 'Включить'} генерацию`
    }

    wrapper.append(`Слайдер может генерировать значения сам,
    если передать массив из двух аргументов одинакового типа
    в диапазон, пример: [-100, 100] ["A", "z"] ["А", "я"]`, btn)
    return wrapper
  }

  changeStep(){
    const wrapper = document.createElement('div')
    const input = document.createElement("input")
    input.type = "number"
    input.value = this.methods.getState().step
    input.onchange = () => {
      this.methods.changeStep(input.value)
    }

    wrapper.append(`Шаг`, input)
    return wrapper
  }

  snapping(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let snappingState = this.methods.getState().snapping
    btn.textContent = `${snappingState ? 'Выключить' : 'Включить'} примагничиваение`
    btn.onclick = () => {
      this.methods.snapping(!snappingState)
      snappingState = !snappingState
      btn.textContent = `${snappingState ? 'Выключить' : 'Включить'} примагничиваение`
    }

    wrapper.append(`Snapping:`, btn)
    return wrapper
  }

  changeClass(){
    const wrapper = document.createElement('div')
    const input = document.createElement("input")
    input.value = this.methods.getState().class
    input.onchange = () => {
      this.methods.changeClass(input.value)
    }

    wrapper.append(`Class (enter чтобы применить):`, input)
    return wrapper
  }

  selectRange(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let selectRangeState = this.methods.getState().selectRange
    btn.textContent = `${selectRangeState ? 'Один бегунок' : 'Два бегунка'}`
    btn.onclick = () => {
      this.methods.selectRange(!selectRangeState)
      selectRangeState = !selectRangeState
      btn.textContent = `${selectRangeState ? 'Один бегунок' : 'Два бегунка'}`
    }

    wrapper.append(`selectRange:`, btn)
    return wrapper
  }

  vertical(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let verticalState = this.methods.getState().vertical
    btn.textContent = `${verticalState ? 'Горизонтальный' : 'Вертикальный'}`
    btn.onclick = () => {
      this.methods.vertical(!verticalState)
      verticalState = !verticalState
      btn.textContent = `${verticalState ? 'Горизонтальный' : 'Вертикальный'}`
    }

    wrapper.append(`vertical:`, btn)
    return wrapper
  }

  progressBar(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let progressBarState = this.methods.getState().progressBar
    btn.textContent = `${progressBarState ? 'Выкл' : 'Вкл'}`
    btn.onclick = () => {
      this.methods.progressBar(!progressBarState)
      progressBarState = !progressBarState
      btn.textContent = `${progressBarState ? 'Выкл' : 'Вкл'}`
    }

    wrapper.append(`progressBar:`, btn)
    return wrapper
  }

  showSelected(){
    const wrapper = document.createElement('div')
    const btnOnHover = document.createElement('button')
    const btnAlways = document.createElement('button')
    const btnNever = document.createElement('button')

    const showSelectedState = this.methods.getState().showSelected

    btnOnHover.textContent = `hover`
    btnAlways.textContent = `always`
    btnNever.textContent = `never`
    $(btnOnHover).css('backgroundColor', btnOnHover.textContent === showSelectedState ? 'green' : '')
    $(btnAlways).css('backgroundColor', btnAlways.textContent === showSelectedState ? 'green' : '')
    $(btnNever).css('backgroundColor', btnNever.textContent === showSelectedState ? 'green' : '')


    btnOnHover.onclick = () => this.methods.showSelected('hover')
    btnAlways.onclick = () => this.methods.showSelected('always')
    btnNever.onclick = () => this.methods.showSelected('never')

    wrapper.append(`showSelected:`, btnOnHover, btnAlways, btnNever)
    return wrapper
  }

  showScale(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let showScaleState = this.methods.getState().showScale
    btn.textContent = `${showScaleState ? 'Убрать' : 'Показать'}`
    btn.onclick = () => {
      this.methods.showScale(!showScaleState)
      showScaleState = !showScaleState
      btn.textContent = `${showScaleState ? 'Убрать' : 'Показать'}`
    }

    wrapper.append(`Шкала:`, btn)
    return wrapper
  }

  scaleStep(){
    const wrapper = document.createElement('div')
    const input = document.createElement("input")
    input.type = "number"
    input.value = this.methods.getState().scaleStep
    input.onchange = () => {
      this.methods.scaleStep(+input.value)
    }

    wrapper.append(`Шаг шкалы`, input)
    return wrapper
  }

  scaleHighlighting(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    let scaleHighlightingState = this.methods.getState().scaleHighlighting
    btn.textContent = `${scaleHighlightingState ? 'Нет' : 'Да'}`
    btn.onclick = () => {
      this.methods.scaleHighlighting(!scaleHighlightingState)
      scaleHighlightingState = !scaleHighlightingState
      btn.textContent = `${scaleHighlightingState ? 'Нет' : 'Да'}`
    }

    wrapper.append(`Подсветить выделенные знач-я на шкале:`, btn)
    return wrapper
  }


  get methods(){
    return $(this.$slider).data('sliderPlugin')
  }

  get HTML() {
    return this.$main
  }
}



async function createControls() {
  const allSliders = await document.querySelectorAll('[class^="sliderPlugin"]')

  await allSliders.forEach( async slider => {
    let sliderControls = await new CreateControls(slider)
    await $(slider).closest('.container').before(sliderControls.HTML)

    sliderControls.methods.subscribe(() => {
      $(sliderControls.HTML).remove()
      sliderControls = new CreateControls(slider)
      $(slider).closest('.container').before(sliderControls.HTML)
    })
  })
}

