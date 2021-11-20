<template>
    <div id="app">
        <Header></Header>
        <div class="content">
            <Sidebar></Sidebar>
            <div class="stage">
                <router-view></router-view>
            </div>
        </div>
        <Footer></Footer>
        <Loading :visible="waiting"></Loading>
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";
import Loading from "./components/Loading.vue";
import store from '@/store';
import { mapGetters } from 'vuex';

export default {
    name: "App",
    store,
    components: {
        Header,
        Footer,
        Sidebar,
        Loading
    },
    computed: {
        ...mapGetters(['waiting'])
    }
};
</script>
