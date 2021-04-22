import { defaultConfig } from '../../src/index'

import { SliderPlugin } from '../../src/slider_plugin/SliderPlugin'
import { SliderView } from '../../src/slider_plugin/SliderView';
import { SliderModel } from '../../src/slider_plugin/SliderModel';
import { SliderPresenter } from '../../src/slider_plugin/SliderPresenter';

import { expect, assert } from "chai";
import sinon from 'sinon';
import { generateRangeArr } from '../../src/slider_plugin/helpers';

describe("SliderModel:", () => {
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

  describe('SliderModel Methods:', () => {
    describe('init:', () => {
      it('should be defined', () => {
        expect(model.init).to.exist
      })
      it('should handle state.range by running generateRangeArr function', () =>{
        const testModel = new SliderModel(defaultConfig)
        const rangeBeforeInit = testModel.getState().range
        testModel.init(view.sliderLength)
        const rangeAfterInit = testModel.getState().range
        expect(rangeBeforeInit).to.be.not.deep.equal(rangeAfterInit)
      })
      it('should run generateRangeOfPixels method', () => {
        const testModel = new SliderModel(defaultConfig)
        const spyOn__generateRangeOfPixels = sinon.spy(testModel, <any>'generateRangeOfPixels')
        testModel.init(view.sliderLength)
        expect(spyOn__generateRangeOfPixels.called).to.be.true
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

    describe('subscribe:', () => {
      it('should be defined', () => {
        expect(model.subscribe).to.exist
      })
      it('should accept function and add it to state.subscribers', () => {
        const fn = () => { };
        model.subscribe(fn)
        const modelSubscribers = model.getState().subscribers;
        expect(modelSubscribers).to.contain(fn)
      })
      it("should accept only functions", () => {
        const notFn = '() => { }' as unknown as Function;
        const logSpy = sinon.spy(console, 'warn')
        model.subscribe(notFn)
        expect(logSpy.calledWith('subscribe method can only take functions')).to.be.true
        logSpy.restore()
      })
    })

    describe('unsubscribe:', () => {
      it('should be defined', () => {
        expect(model.unsubscribe).to.exist
      })
      it("should accept function and remove it, if it's there", () => {
        const fn = () => { };
        model.subscribe(fn)
        let modelSubscribers = model.getState().subscribers;
        expect(modelSubscribers).to.contain(fn)
        model.unsubscribe(fn)
        modelSubscribers = model.getState().subscribers;
        expect(modelSubscribers).to.not.contain(fn)
      })
      it("should accept only functions, and show warning", () => {
        const notFn = '() => { }' as unknown as Function;
        const logSpy = sinon.spy(console, 'warn')
        model.unsubscribe(notFn)
        expect(logSpy.calledWith('unsubscribe method can only take functions')).to.be.true
        logSpy.restore()
      })
      it("should show warning in console if it doesn't found this function", () => {
        const logSpy = sinon.spy(console, 'warn')
        model.unsubscribe(() => { })
        expect(logSpy.calledWith('there is no such function to unsubscribe')).to.be.true
        logSpy.restore()
      })
    })

    describe('callSubs:', () => {
      it('should be defined', () => {
        expect(model.callSubs).to.exist
      })
      it("should call subscribers", () => {
        const spySub1 = sinon.spy(() => { });
        const spySub2 = sinon.spy(() => { });
        const spySub3 = sinon.spy(() => { });
        model.subscribe(spySub1)
        model.subscribe(spySub2)
        model.subscribe(spySub3)
        model.callSubs()
        model.callSubs()
        model.callSubs()
        expect(spySub1.callCount).to.be.eq(3)
        expect(spySub2.callCount).to.be.eq(3)
        expect(spySub3.callCount).to.be.eq(3)
      })
    })

    describe('generateValues:', () => {
      it('should be defined', () => {
        expect(model.generateValues).to.exist
      })
      it('should change state.generateValues', () => {
        model.generateValues(false)
        expect(model.getState().generateValues).to.be.false
        model.generateValues(true)
        expect(model.getState().generateValues).to.be.true
      })
      it('if false provided, range should be equal to initRange', () => {
        // make sure range can be generated
        model.newRange([-100, 100])
        model.generateValues(false)
        const modelState = model.getState()
        const initRangeArrOfStrings = (model.getInitRange() as number[]).map(el => String(el))
        expect(modelState.range).to.be.deep.equal(initRangeArrOfStrings)
      })
      it('if true provided, range should be equal to generatedRange', () => {
        // make sure range can be generated
        model.newRange([-100, 100])
        model.generateValues(true)
        const modelState = model.getState()
        expect(modelState.range).to.be.deep.equal(
          generateRangeArr(
            [-100, 100],
            modelState.step,
            modelState.generateValues
          )
        )
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.generateValues(notBool)
        expect(logSpy.calledWith('generateValues method only takes boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.generateValues(true)
      })
    })

    describe('scaleHighlighting:', () => {
      it('should be defined', () => {
        expect(model.scaleHighlighting).to.exist
      })
      it('should change state.scaleHighlighting', () => {
        model.scaleHighlighting(false)
        expect(model.getState().scaleHighlighting).to.be.false
        model.scaleHighlighting(true)
        expect(model.getState().scaleHighlighting).to.be.true
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.scaleHighlighting(notBool)
        expect(logSpy.calledWith('scaleHighlighting option should take boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.scaleHighlighting(true)
      })
    })

    describe('scaleStep:', () => {
      it('should be defined', () => {
        expect(model.scaleStep).to.exist
      })
      it('should change state.scaleStep', () => {
        model.scaleStep(1)
        expect(model.getState().scaleStep).to.be.eq(1)
        model.scaleStep(3)
        expect(model.getState().scaleStep).to.be.eq(3)
      })
      it('should only accept number', () => {
        const notNumber = 'notNumberValue' as unknown as number;
        const logSpy = sinon.spy(console, 'warn')
        model.scaleStep(notNumber)
        expect(logSpy.calledWith('scaleStep should be more than 0 and an integer')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.scaleStep(1)
      })
    })

    describe('showScale:', () => {
      it('should be defined', () => {
        expect(model.showScale).to.exist
      })
      it('should change state.showScale', () => {
        model.showScale(false)
        expect(model.getState().showScale).to.be.false
        model.showScale(true)
        expect(model.getState().showScale).to.be.true
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.showScale(notBool)
        expect(logSpy.calledWith('showScale option should take boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.showScale(true)
      })
    })

    describe('showSelected:', () => {
      it('should be defined', () => {
        expect(model.showSelected).to.exist
      })
      it('should correctly accept: "always" | "hover" | "never" | boolean', () => {
        const showSelectedState = () => model.getState().showSelected
        model.showSelected(false)
        expect(showSelectedState()).to.be.equal('never')
        model.showSelected(true)
        expect(showSelectedState()).to.be.equal('always')

        model.showSelected('always')
        expect(showSelectedState()).to.be.equal('always')
        model.showSelected('hover')
        expect(showSelectedState()).to.be.equal('hover')
        model.showSelected('never')
        expect(showSelectedState()).to.be.equal('never')
      })
      it('should show warning if uncorrect argument passed', () => {
        const unCorrectVal = 'unCorrectVal' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.showSelected('unCorrectVal' as unknown as boolean)
        expect(logSpy.calledWith(`showSelected option can take:
        boolean: true or false,
        string: "always" | "hover" | "never"`)).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.showSelected(true)
      })
    })

    describe('progressBar:', () => {
      it('should be defined', () => {
        expect(model.progressBar).to.exist
      })
      it('should change state.progressBar', () => {
        model.progressBar(false)
        expect(model.getState().progressBar).to.be.false
        model.progressBar(true)
        expect(model.getState().progressBar).to.be.true
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.progressBar(notBool)
        expect(logSpy.calledWith('progressBar option should take boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.progressBar(true)
      })
    })

    describe('vertical:', () => {
      it('should be defined', () => {
        expect(model.vertical).to.exist
      })
      it('should change state.vertical', () => {
        model.vertical(false)
        expect(model.getState().vertical).to.be.false
        model.vertical(true)
        expect(model.getState().vertical).to.be.true
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.vertical(notBool)
        expect(logSpy.calledWith('vertical option should take boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.vertical(true)
      })
    })

    describe('selectRange:', () => {
      it('should be defined', () => {
        expect(model.selectRange).to.exist
      })
      it('should change state.selectRange', () => {
        model.selectRange(false)
        expect(model.getState().selectRange).to.be.false
        model.selectRange(true)
        expect(model.getState().selectRange).to.be.true
      })
      it('should reset state.current array, so only first control should be left', () => {
        model.selectRange(true)
        selectValuesMiddleToEnd()
        const oldCurrentState = model.getState().current
        model.selectRange(true)
        expect(model.getState().current).to.be.length(1)
        expect(model.getState().current[0]).to.be.equal(oldCurrentState[0])
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.selectRange(notBool)
        expect(logSpy.calledWith('selectRange option should take boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.selectRange(true)
      })
    })

    describe('changeClass:', () => {
      it('should be defined', () => {
        expect(model.changeClass).to.exist
      })
      it('should change state.class', () => {
        model.changeClass('test-class')
        expect(model.getState().class).to.be.eq('test-class')
      })
      it('should only accept string', () => {
        const notBool = true as unknown as string;
        const logSpy = sinon.spy(console, 'warn')
        model.changeClass(notBool)
        expect(logSpy.calledWith('changeClass option should take string')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.changeClass('class-name')
      })
    })

    describe('snapping:', () => {
      it('should be defined', () => {
        expect(model.snapping).to.exist
      })
      it('should change state.snapping', () => {
        model.snapping(false)
        expect(model.getState().snapping).to.be.false
        model.snapping(true)
        expect(model.getState().snapping).to.be.true
      })
      it('should only accept boolean', () => {
        const notBool = 'notBoolValue' as unknown as boolean;
        const logSpy = sinon.spy(console, 'warn')
        model.snapping(notBool)
        expect(logSpy.calledWith('Snapping option should take boolean: true or false')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.snapping(true)
      })
    })

    describe('changeStep:', () => {
      it('should be defined', () => {
        expect(model.changeStep).to.exist
      })
      it('should change state.step', () => {
        model.changeStep(1)
        expect(model.getState().step).to.be.eq(1)
        model.changeStep(3)
        expect(model.getState().step).to.be.eq(3)
      })
      it('should update state.range', () => {
        // make sure range can be generated
        model.newRange([-100, 100])
        model.changeStep(5)
        const modelState = model.getState()
        expect(modelState.range).to.be.deep.equal(
          generateRangeArr(
            [-100, 100],
            modelState.step,
            modelState.generateValues
          )
        )
      })
      it('should call model.generateRangeOfPixels', () => {
        // make sure range can be generated
        model.newRange([-100, 100])
        model.changeStep(1)
        const spyOn__generateRangeOfPixels = sinon.spy(model, <any>'generateRangeOfPixels')
        model.changeStep(5)
        expect(spyOn__generateRangeOfPixels.called).to.be.true
        spyOn__generateRangeOfPixels.restore()
      })
      it('should only accept number', () => {
        const notNumber = 'notNumberValue' as unknown as number;
        const logSpy = sinon.spy(console, 'warn')
        model.changeStep(notNumber)
        expect(logSpy.calledWith('Step should be more than 0 and an integer')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.changeStep(1)
      })
    })

    describe('newRange:', () => {
      it('should be defined', () => {
        expect(model.newRange).to.exist
      })
      it('should update state.range', () => {
        model.newRange([10, 50])
        let modelState = model.getState()
        expect(modelState.range).to.be.deep.equal(
          generateRangeArr(
            [10, 50],
            modelState.step,
            modelState.generateValues
          )
        )
        model.newRange([-100, 0])
        modelState = model.getState()
        expect(modelState.range).to.be.deep.equal(
          generateRangeArr(
            [-100, 0],
            modelState.step,
            modelState.generateValues
          )
        )
      })
      it('should update initRange', () => {
        const newRange = [400, 800]
        model.newRange(newRange)
        expect(model.getInitRange()).to.be.deep.equal(newRange)
      })
      it('should call model.generateRangeOfPixels', () => {
        const spyOn__generateRangeOfPixels = sinon.spy(model, <any>'generateRangeOfPixels')
        model.newRange([-100, 100])
        expect(spyOn__generateRangeOfPixels.called).to.be.true
        spyOn__generateRangeOfPixels.restore()
      })
      it('should accept only an array', () => {
        const notArray = 'notArray' as unknown as string[];
        const logSpy = sinon.spy(console, 'warn')
        model.newRange(notArray)
        expect(logSpy.calledWith('newRange should take an Array and arr.lenght >= 2')).to.be.true
        logSpy.restore()
      })
      it('should accept only an array with length >= 2', () => {
        const shortArray = [1];
        const logSpy = sinon.spy(console, 'warn')
        model.newRange(shortArray)
        expect(logSpy.calledWith('newRange should take an Array and arr.lenght >= 2')).to.be.true
        logSpy.restore()
      })
      it('if "generateValues=true" and you try to pass wrong types to generate a range array', () => {
        const shortArray = [1, '500'] as unknown as number[];
        const logSpy = sinon.spy(console, 'warn')
        model.newRange(shortArray)
        expect(logSpy.calledWith('newRange method says: Hey looks like you have provided array of two values, if you want to generate range out of two values your newRange should look like this [string, string] or [number, number]')).to.be.true
        logSpy.restore()
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.newRange([-100, 100])
      })
    })

    describe('chooseValue:', () => {
      it('should be defined', () => {
        expect(model.chooseValue).to.exist
      })
      it('should choose correct value for first control', () => {
        const newRange = [0, 1, 2, 3, 4, 5, 6]
        model.newRange(newRange)
        model.chooseValue(3)
        const firstControlSelectedIndex = model.getState().current[0]
        expect(model.getState().range[firstControlSelectedIndex])
          .to.be.equal(String(newRange[firstControlSelectedIndex]))
      })
      it('should choose correct value for both controls', () => {
        model.selectRange(true)
        const newRange = [0, 1, 2, 3, 4, 5, 6]
        model.newRange(newRange)
        model.chooseValue(3, 6)
        const firstControlSelectedIndex = model.getState().current[0]
        const secondControlSelectedIndex = model.getState().current[1]
        expect(model.getState().range[firstControlSelectedIndex])
          .to.be.equal(String(newRange[firstControlSelectedIndex]))
        expect(model.getState().range[secondControlSelectedIndex])
          .to.be.equal(String(newRange[secondControlSelectedIndex]))
      })
      it('should trigger "model:stateChanged"', (done) => {
        $(model).off('model:stateChanged')
        $(model).on('model:stateChanged', () => done())
        model.chooseValue(2)
      })
    })

    describe('deleteSelected:', () => {
      it('should be defined', () => {
        expect(model.deleteSelected).to.exist
      })
      it('should call model.generateRangeOfPixels', () => {
        const spyOn__generateRangeOfPixels = sinon.spy(model, <any>'generateRangeOfPixels')
        model.deleteSelected()
        expect(spyOn__generateRangeOfPixels.called).to.be.true
        spyOn__generateRangeOfPixels.restore()
      })

      it('should delete selected from state.range', () => {
        model.selectRange(true)
        selectValuesMiddleToEnd()
        const rangeStateBefore = model.getState().range
        const spy = sinon.spy(model, 'deleteSelected')
        const firstCall = model.deleteSelected()
        selectValuesMiddleToEnd()
        const secondCall = model.deleteSelected()
        selectValuesMiddleToEnd()
        const thirdCall = model.deleteSelected()

        const allDeletedValues = [
          ...spy.firstCall.returnValue,
          ...spy.secondCall.returnValue,
          ...spy.thirdCall.returnValue
        ]
        const rangeStateAfter = model.getState().range

        expect(rangeStateBefore).to.include.all.members(allDeletedValues)
        expect(rangeStateAfter).to.not.include.all.members(allDeletedValues)

        expect(spy.callCount).to.be.equal(3)
        spy.restore();
      })
      it('should return deleted values', () => {
        model.selectRange(true)
        selectValuesMiddleToEnd()
        const spy = sinon.spy(model, 'deleteSelected')
        const firstCallSelected = model.selectedValues()
        const firstCall = model.deleteSelected()
        selectValuesMiddleToEnd()
        const secondCallSelected = model.selectedValues()
        const secondCall = model.deleteSelected()
        selectValuesMiddleToEnd()
        const thirdCallSelected = model.selectedValues()
        const thirdCall = model.deleteSelected()

        expect(spy.firstCall.returnValue).to.be.deep.equal(firstCallSelected)
        expect(spy.secondCall.returnValue).to.be.deep.equal(secondCallSelected)
        expect(spy.thirdCall.returnValue).to.be.deep.equal(thirdCallSelected)
        expect(spy.callCount).to.be.equal(3)
        spy.restore();
      })
      it('if no values left, should replace state.range with ["null","null"]', () => {
        const rangeLength = model.getState().range.length + 2
        for (let i = 0; i < rangeLength; i++) {
          model.deleteSelected()
        }
        expect(model.getState().range).to.be.deep.equal(['null', 'null'])
      })
      it('if all values should be deleted, should replace state.range with ["null","null"]', () => {
        model.selectRange(true)
        model.chooseValue(
          model.getState().range[0],
          model.getState().range[model.getState().range.length - 1]
        )
        model.deleteSelected()
        expect(model.getState().range).to.be.deep.equal(['null', 'null'])
      })
      it('if only one value left, should replace state.range with [LeftValue,"null"]', () => {
        model.selectRange(true)
        model.chooseValue(
          model.getState().range[0],
          model.getState().range[model.getState().range.length - 2]
        )
        model.deleteSelected()
        expect(model.getState().range).to.be.deep.equal(
          [model.getState().range[0], 'null']
        )
      })
    })

    describe('allValues:', () => {
      it('should be defined', () => {
        expect(model.allValues).to.exist
      })
      it('should return state.range', () => {
        expect(model.allValues()).to.be.deep.equal(model.getState().range)
      })
    })

    describe('selectedValues:', () => {
      it('should be defined', () => {
        expect(model.selectedValues).to.exist
      })
      it('should return value of first control if there is only one control element', () => {
        model.selectRange(false)
        expect(model.selectedValues()).to.be.equal(model.currentValue(0))
      })
      it('should return array of selected values', () => {
        model.selectRange(true)
        selectValuesMiddleToEnd()
        const [firstControl, secondControl] = model.getState().current
        expect(model.selectedValues()).to.be.deep.equal(
          model.getState().range.slice(firstControl, secondControl + 1)
        )
      })
      it('should return correct value if first control is ahead of second one', () => {
        model.selectRange(true)
        const rangeLastIndex = instance.getState().range.length - 1;
        const rangeMiddleIndex = Math.round(rangeLastIndex / 2)
        instance.chooseValue(
          instance.getState().range[rangeLastIndex],
          instance.getState().range[rangeMiddleIndex]
        )
        let [firstControl, secondControl] = model.getState().current
        firstControl > secondControl
          ? [firstControl, secondControl] = [secondControl, firstControl]
          : null
        expect(model.selectedValues()).to.be.deep.equal(
          model.getState().range.slice(firstControl, secondControl + 1)
        )
      })
    })

    describe('updateStateCurrent:', () => {
      it('should be defined', () => {
        expect(model.updateStateCurrent).to.exist
      })
      it('should change state.current[controlIndex] to correct value', () => {
        model.newRange([0, 100])
        // should select middle value
        model.updateStateCurrent(0, view.sliderLength / 2)
        expect(model.currentValue(0)).to.be.equal('50')

      })
    })

    describe('getState:', () => {
      it('should be defined', () => {
        expect(model.getState).to.exist
      })
      it('should return copy of state', () => {
        const modelState = (model as any).state;
        const modelFromMethod = model.getState()

        expect(modelState).to.be.not.equal(modelFromMethod)
        expect(modelState).to.be.deep.equal(modelFromMethod)
        modelFromMethod.subscribers.push(() => { })
        expect(modelState.subscribers).to.be.not.equal(modelFromMethod.subscribers)
      })
    })

    describe('pixelOfCurrent:', () => {
      it('should be defined', () => {
        expect(model.pixelOfCurrent).to.exist
      })
      it('should return pixel of control by its index', () => {
        model.newRange([0, 100])
        model.chooseValue('50')
        expect(model.pixelOfCurrent(0)).to.be.equal(view.sliderLength / 2)
      })
    })

    describe('currentValue:', () => {
      it('should be defined', () => {
        expect(model.currentValue).to.exist
      })
      it('should return value of control by its index', () => {
        model.newRange([0, 100])
        model.chooseValue('50')
        expect(model.currentValue(0)).to.be.equal('50')
      })
    })

    describe('currentArr:', () => {
      it('should be defined', () => {
        expect(model.currentArr).to.exist
      })
      it('should return copy of current array (what values controls are selecting)', () => {
        expect(model.currentArr).to.be.deep.equal(model.getState().current)
        expect(model.currentArr).to.be.not.equal(model.getState().current)
      })
      it('should return array of two values when there are two controls', () => {
        model.selectRange(true)
        selectValuesMiddleToEnd()
        expect(model.currentArr).to.have.length(2)
        expect(model.currentArr).to.be.deep.equal(model.getState().current)
        expect(model.currentArr).to.be.not.equal(model.getState().current)
      })
    })
  })
});