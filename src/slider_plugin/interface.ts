interface JQuery {
  sliderPlugin(options?: object): JQuery
}

interface PluginConfig {
  from: number
  to: number
  step: number
  current: number
}