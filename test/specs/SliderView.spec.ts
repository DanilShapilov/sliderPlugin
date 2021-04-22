import { defaultConfig } from '../../src/index'

import { SliderPlugin } from '../../src/slider_plugin/SliderPlugin'
import { SliderView } from '../../src/slider_plugin/SliderView';
import { SliderModel } from '../../src/slider_plugin/SliderModel';
import { SliderPresenter } from '../../src/slider_plugin/SliderPresenter';

import { expect, assert } from "chai";
import sinon from 'sinon';
import { generateRangeArr } from '../../src/slider_plugin/helpers';

describe("SliderView:", () => {
  let rootEl: HTMLDivElement;
  let instance: ISliderPlugin;
  let view: ISliderView
  let model: ISliderModel
  let presenter: ISliderPresenter

  beforeEach(async () => {
    rootEl = await document.createElement('div')
    rootEl.className = 'slider-wrapper';
    rootEl.style.width = '500px';
    rootEl.style.height = '500px';

    view = await new SliderView(rootEl, defaultConfig);

    model = await new SliderModel(defaultConfig);
    presenter = await new SliderPresenter(model, view);
    instance = await new SliderPlugin(rootEl, view, model, presenter)
    await $.data(
      rootEl,
      'sliderPlugin',
      instance
    )
    document.body.prepend(rootEl);
  })

  afterEach(async () => {
    await instance.destroy()
    await rootEl.remove()
  })

  function selectValuesMiddleToEnd() {
    const rangeLastIndex = instance.getState().range.length - 1;
    const rangeMiddleIndex = Math.round(rangeLastIndex / 2)
    instance.chooseValue(
      instance.getState().range[rangeMiddleIndex],
      instance.getState().range[rangeLastIndex]
    )
  }

  it("instance should be defined", () => {
    assert.instanceOf(instance, SliderPlugin)
  });

  describe('SliderView Methods:', () => {
    describe('init:', () => {
      it('should be defined', () => {
        expect(model.init).to.exist
      })
    })

    describe('getInitRange:', () => {
      it('should be defined', () => {
        expect(model.getInitRange).to.exist
      })
      it('should return copy of initialRange', () => {
        expect(model.getInitRange()).to.be.deep.equal(defaultConfig.range)
      })
      it('should be overridden with newRange', () => {
        const newInitRange = [500, 1000]
        model.newRange(newInitRange)
        expect(model.getInitRange()).to.be.deep.equal(newInitRange)
      })
    })

    
  })
});