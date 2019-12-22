import LazyLoad from 'vanilla-lazyload'
import Headroom from 'headroom.js'
import 'vanilla-ripplejs'
import 'zenscroll'
import './work.js'

new Headroom(document.querySelector('header')).init()
new LazyLoad({
    threshold: 1000,
})

document.querySelector('.copyright').innerHTML = "&copy; Jim Saari " + new Date().getFullYear()