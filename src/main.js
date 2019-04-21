import Vue from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css";
import moment from 'moment';

Vue.prototype.$moment = moment;
Vue.prototype.$moment.locale('pt-br');
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
