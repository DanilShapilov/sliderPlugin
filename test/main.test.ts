import { defaultConfig } from './../src/index'
import { SliderPlugin } from './../src/slider_plugin/SliderPlugin'

describe('SliderPlugin:', function () {
  const rootEl = document.createElement('div')
  rootEl.setAttribute('style', 'width: 500px; height: 500px')
  const instance = new SliderPlugin(rootEl, defaultConfig)

  it('instance should be defined', () => {
    expect(instance).toBeDefined()
    expect(instance.resized).toBeDefined()
  })
});