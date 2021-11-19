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
    </div>
</template>

<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";

export default {
    name: "App",
    components: {
        Header,
        Footer,
        Sidebar,
    },
};
</script>
