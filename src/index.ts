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
    showSelected: 'hover'
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
    current: [5],
    selectRange: true
})

$(".sliderPlugin4").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6],
    step: 2,
    snapping: true
})

$(".sliderPlugin5").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6],
    current: [0],
    step: 2
})