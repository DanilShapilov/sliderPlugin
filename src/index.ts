import './index.scss';
import './slider_plugin/SliderPlugin'



$(".sliderPlugin1").sliderPlugin({
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

$(".sliderPlugin2").sliderPlugin({
    range: ['А', 'я'],
    current: [7, 42],
    snapping: true,
    selectRange: true,
    vertical: true
})

$(".sliderPlugin3").sliderPlugin({
    range: ['A', 'z'],
    snapping: true,
    current: [0,6],
    selectRange: true,
    showScale: true,
    scaleStep: 3
})

$(".sliderPlugin4").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    current: [2, 5],
    selectRange: true,
    showScale: true,
    step: 10
})

$(".sliderPlugin5").sliderPlugin({
    range: [-100, 100],
    snapping: true,
    current: [2, 5],
    selectRange: true,
    showScale: true,
    scaleHighlighting: false,
    step: 10
})

$(".sliderPlugin6").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6, 7],
    current: [0],
    snapping: true,
    showScale: true,
    scaleStep: 0
})