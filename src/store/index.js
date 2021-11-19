import Vue from 'vue';
import Vuex from 'vuex';
import global from './modules/global.js';
import game from './modules/game.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        global,
        game
    }
});