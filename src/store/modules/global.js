export default {
    state: {
        appName: 'VChess',
        appVersion: '0.0.1',
        lang: 'pt-br',
        menuVisible: true,
        waiting: false
    },
    mutations: {
        setLang(state, value) {
            state.lang = value;
        },
        toggleMenuVisible(state) {
            state.menuVisible = !state.menuVisible;
        },
        isWaiting(state, val) {
            state.waiting = Boolean(val);
        }
    },
    actions: {
    },
    getters: {
        appName: state => state.appName,
        appVersion: state => state.appVersion,
        lang: state => state.lang,
        menuVisible: state => state.menuVisible,
        waiting: state => state.waiting
    }
};