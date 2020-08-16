import { defaultConfig } from '../../src/index'
import { SliderPlugin } from '../../src/slider_plugin/SliderPlugin'
import { expect, assert } from "chai";


describe("SliderPlugin", () => {
  let rootEl = document.createElement("div");
  let instance = new SliderPlugin(rootEl, defaultConfig);
  beforeEach(() => {
    rootEl = document.createElement("div");
    instance = new SliderPlugin(rootEl, defaultConfig);
  })
  it("instance should be defined", () => {
    assert.instanceOf(instance, SliderPlugin)
  });
});