import './index.scss';
import './slider_plugin/SliderPlugin'



$(".sliderPlugin1").sliderPlugin({
    range: [-100, 100],
    current: 50,
    snapping: true
})

$(".sliderPlugin2").sliderPlugin({
    range: ['А', 'я'],
    snapping: true
})

$(".sliderPlugin3").sliderPlugin({
    range: ['A', 'z'],
    snapping: true
})

$(".sliderPlugin4").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6],
    current: 3,
    snapping: true
})

$(".sliderPlugin5").sliderPlugin({
    range: [1, 2, 3, 4, 5, 6],
    current: 0,
    // step: 2
})