import LazyLoad from 'vanilla-lazyload'
import Headroom from 'headroom.js'
import 'vanilla-ripplejs'
import 'zenscroll'
import './work.js'

const headroom = new Headroom(document.querySelector('header')).init()
const lazyLoad = new LazyLoad({
    threshold: 1000,
})

document.querySelector('.copyright').innerHTML = "&copy; Jim Saari " + new Date().getFullYear()