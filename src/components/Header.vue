<template>
    <div class="header bshadow-p">
        <div class="col-left">
            <h1>{{appName}}</h1>
        </div>
        <div class="col-right">
            <span class="lang-name">[{{i18n.langName(lang)}}]</span>
        </div>
    </div>
</template>

<script>
import store from '@/store';
import { mapGetters } from "vuex";

export default {
    name: 'Header',
    store,
    computed: {
        ...mapGetters(['appName', 'lang']),
    }
}
</script>

<style lang="scss">
.header {
    display: flex;
    flex-direction: row;

    .col-left {
        width: 60%;
    }
    .col-right {
        width: 40%;
        text-align: right;
    }
}
</style>