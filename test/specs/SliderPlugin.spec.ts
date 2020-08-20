import { defaultConfig } from '../../src/index'

import { SliderPlugin } from '../../src/slider_plugin/SliderPlugin'
import { SliderView } from '../../src/slider_plugin/SliderView';
import { SliderModel } from '../../src/slider_plugin/SliderModel';
import { SliderPresenter } from '../../src/slider_plugin/SliderPresenter';

import { expect, assert } from "chai";
import sinon from 'sinon';

describe("SliderPlugin:", () => {
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

  describe('SliderPlugin Methods:', () => {
    describe('resized:', () => {
      it('should be defined', () => {
        expect(instance.resized).to.exist
      })
      it('should fire (view:resized) event on resize', (done) => {
        const spyFn = sinon.spy()
        // Overwriting default event contained in Presenter
        $(view).off('view:resized')
        $(view).on('view:resized', spyFn)
        // Changing container size
        rootEl.style.width = '400px';
        rootEl.style.height = '400px';
        // Wait a bit
        setTimeout(() => {
          expect(spyFn.callCount).to.be.eq(1)
          done()
        }, 200);
      })
    })

    describe('selectedValues:', () => {
      it('should be defined', () => {
        expect(instance.selectedValues).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'selectedValues')
        instance.selectedValues()
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return the same value as model method', () => {
        const returnedBySpliderPlugin = instance.selectedValues()
        const returnedBySpliderModel = model.selectedValues()
        expect(returnedBySpliderPlugin).to.be.deep.equal(returnedBySpliderModel)
      })
    })

    describe('allValues:', () => {
      it('should be defined', () => {
        expect(instance.allValues).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'allValues')
        instance.allValues()
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return the same value as model method', () => {
        const returnedBySpliderPlugin = instance.allValues()
        const returnedBySpliderModel = model.allValues()
        expect(returnedBySpliderPlugin).to.be.deep.equal(returnedBySpliderModel)
      })
    })

    describe('deleteSelected:', () => {
      it('should be defined', () => {
        expect(instance.deleteSelected).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'deleteSelected')
        instance.deleteSelected()
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return the same value as model method with single control', () => {
        instance.selectRange(false)
        const spy = sinon.spy(model, 'deleteSelected')
        const firstCall = instance.deleteSelected()
        const secondCall = instance.deleteSelected()
        const thirdCall = instance.deleteSelected()

        expect(spy.firstCall.returnValue).to.be.deep.equal(firstCall)
        expect(spy.secondCall.returnValue).to.be.deep.equal(secondCall)
        expect(spy.thirdCall.returnValue).to.be.deep.equal(thirdCall)
        expect(spy.callCount).to.be.equal(3)
        spy.restore();
      })
      it('should return the same value as model method, with two controls', (done) => {
        instance.selectRange(true)
        setTimeout(() => {
          const spy = sinon.spy(model, 'deleteSelected')
          selectValuesMiddleToEnd()
          const firstCall = instance.deleteSelected()
          selectValuesMiddleToEnd()
          const secondCall = instance.deleteSelected()
          selectValuesMiddleToEnd()
          const thirdCall = instance.deleteSelected()

          expect(spy.firstCall.returnValue).to.be.deep.equal(firstCall)
          expect(spy.secondCall.returnValue).to.be.deep.equal(secondCall)
          expect(spy.thirdCall.returnValue).to.be.deep.equal(thirdCall)

          expect(spy.callCount).to.be.equal(3)
          spy.restore();
          done()
        }, 100);
      })
    })

    describe('currentValue:', () => {
      it('should be defined', () => {
        expect(instance.currentValue).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'currentValue')
        instance.currentValue(0)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return correct value of requested control by its index', (done) => {
        instance.selectRange(true)
        setTimeout(() => {
          selectValuesMiddleToEnd()
          const spy = sinon.spy(model, 'currentValue')
          const firstCall = instance.currentValue(0)
          const secondCall = instance.currentValue(1)
          const thirdCall = instance.currentValue(2)

          expect(spy.firstCall.returnValue).to.be.deep.equal(firstCall)
          expect(spy.secondCall.returnValue).to.be.deep.equal(secondCall)
          expect(spy.thirdCall.returnValue).to.be.deep.equal(thirdCall)
          expect(spy.callCount).to.be.equal(3)
          spy.restore();
          done()
        }, 100);

      })
    })

    describe('getInitRange:', () => {
      it('should be defined', () => {
        expect(instance.getInitRange).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'getInitRange')
        instance.getInitRange()
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return the same value as model method', () => {
        const returnedBySpliderPlugin = instance.getInitRange()
        const returnedBySpliderModel = model.getInitRange()
        expect(returnedBySpliderPlugin).to.be.deep.equal(returnedBySpliderModel)
      })
    })

    describe('getState:', () => {
      it('should be defined', () => {
        expect(instance.getState).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'getState')
        instance.getState()
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return the same value as model method', () => {
        const returnedBySpliderPlugin = instance.getState()
        const returnedBySpliderModel = model.getState()
        expect(returnedBySpliderPlugin).to.be.deep.equal(returnedBySpliderModel)
      })
    })

    describe('chooseValue:', () => {
      it('should be defined', () => {
        expect(instance.chooseValue).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'chooseValue')
        instance.chooseValue('4')
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.chooseValue('4')).to.be.equal(instance)
      })
    })

    describe('newRange:', () => {
      it('should be defined', () => {
        expect(instance.newRange).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'newRange')
        instance.newRange([400,-100])
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.newRange([400,-100])).to.be.equal(instance)
      })
    })

    describe('generateValues:', () => {
      it('should be defined', () => {
        expect(instance.generateValues).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'generateValues')
        instance.generateValues(false)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.generateValues(false)).to.be.equal(instance)
      })
    })

    describe('changeStep:', () => {
      it('should be defined', () => {
        expect(instance.changeStep).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'changeStep')
        instance.changeStep(2)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.changeStep(2)).to.be.equal(instance)
      })
    })

    describe('snapping:', () => {
      it('should be defined', () => {
        expect(instance.snapping).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'snapping')
        instance.snapping(false)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.snapping(false)).to.be.equal(instance)
      })
    })

    describe('changeClass:', () => {
      it('should be defined', () => {
        expect(instance.changeClass).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'changeClass')
        instance.changeClass('qwe-class')
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.changeClass('qwe-class')).to.be.equal(instance)
      })
    })

    describe('selectRange:', () => {
      it('should be defined', () => {
        expect(instance.selectRange).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'selectRange')
        instance.selectRange(true)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.selectRange(true)).to.be.equal(instance)
      })
    })

    describe('vertical:', () => {
      it('should be defined', () => {
        expect(instance.vertical).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'vertical')
        instance.vertical(true)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.vertical(true)).to.be.equal(instance)
      })
    })

    describe('progressBar:', () => {
      it('should be defined', () => {
        expect(instance.progressBar).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'progressBar')
        instance.progressBar(false)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.progressBar(false)).to.be.equal(instance)
      })
    })

    describe('showSelected:', () => {
      it('should be defined', () => {
        expect(instance.showSelected).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'showSelected')
        instance.showSelected('hover')
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.showSelected(false)).to.be.equal(instance)
      })
    })

    describe('showScale:', () => {
      it('should be defined', () => {
        expect(instance.showScale).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'showScale')
        instance.showScale(true)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.showScale(true)).to.be.equal(instance)
      })
    })

    describe('scaleStep:', () => {
      it('should be defined', () => {
        expect(instance.scaleStep).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'scaleStep')
        instance.scaleStep(2)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.scaleStep(2)).to.be.equal(instance)
      })
    })

    describe('scaleHighlighting:', () => {
      it('should be defined', () => {
        expect(instance.scaleHighlighting).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'scaleHighlighting')
        instance.scaleHighlighting(false)
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.scaleHighlighting(false)).to.be.equal(instance)
      })
    })

    describe('subscribe:', () => {
      it('should be defined', () => {
        expect(instance.subscribe).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'subscribe')
        instance.subscribe(()=>{})
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.subscribe(()=>{})).to.be.equal(instance)
      })
    })

    describe('unsubscribe:', () => {
      it('should be defined', () => {
        expect(instance.unsubscribe).to.exist
      })
      it('should call method from model', () => {
        const spy = sinon.spy(model, 'unsubscribe')
        instance.unsubscribe(()=>{})
        expect(spy.called).to.be.true
        spy.restore();
      })
      it('should return its SliderPlugin instance', () => {
        expect(instance.unsubscribe(()=>{})).to.be.equal(instance)
      })
    })
  })
});