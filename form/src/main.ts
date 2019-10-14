import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

// @ts-ignore
window.Vue = Vue; // make available globaly on faceit.com
Vue.use(Vuetify);
Vue.config.productionTip = false;

// @ts-ignore
window.ecl_addon_vue_instance = new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#ecl_popup_mount');

// tslint-disable-next-line max-line-length
export const URLREGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

