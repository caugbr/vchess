import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home.vue';
import Game from './views/Game.vue';
import GamesList from './views/GamesList.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/game/:gid?',
    name: 'Game',
    component: Game
  },
  {
    path: '/games',
    name: 'Games',
    component: GamesList
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;
