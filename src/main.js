import Vue from 'vue';
import App from './App.vue';
import router from './router.js';

// import Chess from '../node_modules/chess.js/chess.js';
// const ChessPlugin = {
//   install(Vue) {
//     Vue.prototype.$chess = Chess;
//   }
// };
// Vue.use(ChessPlugin);

import I18n from "./I18n";
Vue.use(I18n);

Vue.config.productionTip = false;

import './assets/scss/app.scss';

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});