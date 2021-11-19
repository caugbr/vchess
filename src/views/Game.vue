<template>
    <div class="game">
        <h1>{{t('Game')}}</h1>
        <board></board>
    </div>
</template>

<script>
import Board from "@/components/Board";
import store from '@/store';
import { mapGetters } from 'vuex';

export default {
    name: 'Game',
    store,
    components: {
        Board
    },
    computed: {
        ...mapGetters(['lang'])
    },
    methods: {
        t(str) {
            return this.i18n.tl(str, this.lang);
        }
    }
}
</script>

<style lang="scss">
.game {
    
}
</style>