createSliders()
async function createSliders() {
  await $(".sliderPlugin1").sliderPlugin({
    range: [-100, 100],
    current: [6, 12],
    step: 10,
    snapping: true,
    selectRange: true,
    vertical: true,
    progressBar: false,
    showSelected: 'hover',
    showScale: true,
    scaleStep: 5
  })
  
  await $(".sliderPlugin2").sliderPlugin({
    range: ['А', 'я'],
    current: [7, 42],
    snapping: true,
    selectRange: true,
    vertical: true
  })
  
  await $(".sliderPlugin3").sliderPlugin({
    range: ['A', 'z'],
    snapping: true,
    current: [0,6],
    selectRange: true,
    showScale: true,
    scaleStep: 3
  })
  
  await $(".sliderPlugin4").sliderPlugin({
    range: [-100, 100],
    snapping: true,
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

    this.$main.append(this.selectedValues())
    this.$main.append(this.chooseValue())
    this.$main.append(this.newRange())
    this.$main.append(this.generateValues())
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
    firstInput.value = this.methods._model.currentValue(0)
    let lastInput;
    const lastVal = this.methods._model.currentValue(1);
    if (lastVal) {
      lastInput = document.createElement('input')
      lastInput.value = lastVal
    }
    
    btn.textContent = 'Выбрать значения'
    btn.onclick = () => {this.methods.chooseValue(firstInput.value, lastInput === undefined ? undefined : lastInput.value)}

    wrapper.append(`Если значение существует, оно будет выбрано`, btn, firstInput, lastInput ?? '')
    return wrapper
  }

  newRange(){
    const wrapper = document.createElement('div')
    const btn = document.createElement('button')
    const textArea = document.createElement('textarea')
    textArea.value = JSON.stringify(this.methods._model.initRange, null, 2)
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
    let generateValuesState = this.methods._model.state.generateValues
    btn.textContent = `${generateValuesState ? 'Выключить' : 'Включить'} генерацию`
    btn.onclick = () => {
      this.methods.generateValues(!generateValuesState)
      generateValuesState = !generateValuesState
      btn.textContent = `${generateValuesState ? 'Выключить' : 'Включить'} генерацию`
    }

    wrapper.append(`Слайдер может генерировать значения сам,
    если передать массив из двух аргументов одинакового типа
    в диапазон, пример: [-100, 100] ['A', 'z'] ['А', 'я']`, btn)
    return wrapper
  }

  // generateValues
  // changeStep
  // snapping
  // changeClass
  // selectRange
  // vertical
  // progressBar
  // showSelected
  // showScale
  // scaleStep
  // scaleHighlighting

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

