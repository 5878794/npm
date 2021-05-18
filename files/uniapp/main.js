import Vue from 'vue'
import App from './App'
import vuePrototype from 'libs/vuePrototype.js'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}
Vue.prototype.$adpid = "1111111111"


//加载常用的全局方法
for(let [key,fn] of Object.entries(vuePrototype)){
	Vue.prototype[key] = fn;
}


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
