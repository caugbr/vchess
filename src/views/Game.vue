<template>
    <div class="game">
        <h1>{{t('Game')}}</h1>
        <board :key="reloadBoard" @changed="reRender"></board>
    </div>
</template>

<script>
import Board from "@/components/Board";
import store from '@/store';
import { mapGetters } from 'vuex';

export default {
    name: 'Game',
    store,
    data() {
        return {
            reloadBoard: 0
        }
    },
    components: {
        Board
    },
    computed: {
        ...mapGetters(['lang'])
    },
    methods: {
        t(str) {
            return this.i18n.tl(str, this.lang);
        },
        reRender() {
            this.reloadBoard += 1;
        }
    }
}
</script>

<style lang="scss">
.game {
    
}
</style>