const standard = {
    amount: 1,
    price: 1100,
    category: 'Стандарт',
    name: 'Двохмісний номер з видом на гори',
    details: 'макс. 2 гостя · 1 спальня · 1 двухспальне ліжко · 1 санвузол · Wi-Fi · вихід на терассу · вид на гори',
    slider_photos: [
        require('../assets/img/rooms/standard/standard-one.jpeg').default,
        require('../assets/img/rooms/standard/standard-two.jpeg').default,
        require('../assets/img/rooms/standard/standard-three.jpeg').default,
        require('../assets/img/rooms/standard/standard-four.jpeg').default,
        require('../assets/img/rooms/standard/standard-five.jpeg').default,
    ],
    extra_cost: 0
}
const luxe = {
    amount: 2,
    price: 1300,
    category: 'Люкс',
    name: 'Двохмісний номер з видом на гори',
    details: '2-3 гостя · 1 спальня · 1 двоспальне ліжко · 1 санвузол · вихід на терассу · вид на гори',
    slider_photos: [
        require('../assets/img/rooms/luxe/luxe-one.jpeg').default,
        require('../assets/img/rooms/luxe/luxe-two.jpeg').default,
        require('../assets/img/rooms/luxe/luxe-four.jpeg').default,
        require('../assets/img/rooms/luxe/luxe-six.jpeg').default,
        require('../assets/img/rooms/luxe/luxe-seven.jpeg').default,
    ],
    extra_cost: 350
}
const deluxe = {
    amount: 3,
    price: 1500,
    category: 'Делюкс',
    name: 'Двохмісний номер  на другому поверсі з видом на гори',
    details: '2-3 гостя · 1 спальня · 1 двоспальне ліжко · 1 санвузол · вихід на терассу · вид на гори',
    slider_photos: [
        require('../assets/img/rooms/deluxe/deluxe-one.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-two.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-three.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-four.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-six.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-seven.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-nine.jpeg').default,
        require('../assets/img/rooms/deluxe/deluxe-ten.jpeg').default,
    ],
    extra_cost: 350
}

export default {
    standard,
    luxe,
    deluxe
}