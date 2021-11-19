<template>
    <div :class="`sidebar bshadow-m menu-${menuVisible ? 'visible' : 'hidden'}`">
        <a href="#" class="toggle-menu" @click.prevent="toggleMenu">
            <em class="fa fa-bars"></em>
            <em class="fa fa-chevron-left"></em>
        </a>
        <nav class="main-menu">
            <ul>
                <li>
                    <router-link to="/">
                        <em class="fa fa-home"></em>
                        <span>Home</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/game">
                        <em class="fa fa-trophy"></em>
                        <span>Game</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/games">
                        <em class="fa fa-list"></em>
                        <span>Games List</span>
                    </router-link>
                </li>
                <li :class="`has-submenu ${getSubmenuClass('langs')}`">
                    <a href="#" @click.prevent="toggleSubmenu('langs');">
                        <em class="fa fa-globe"></em>
                        <span>{{t('Languages')}}</span>
                    </a>
                    <ul class="submenu">
                        <li v-for="lng in i18n.getLangs()" :key="lng">
                            <a href="#" @click.prevent="setLang(lng);">
                                <multi-check name="language" :checked="lang === lng"></multi-check>
                                {{i18n.langName(lng)}}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import store from '@/store';
import { mapGetters, mapMutations } from "vuex";
import MultiCheck from "./MultiCheck.vue";

export default {
    name: 'Sidebar',
    store,
    components: {
        MultiCheck
    },
    data() {
        return {
            opened: [],
            submenuVisible: []
        };
    },
    computed: {
        ...mapGetters(['menuVisible', 'lang'])
    },
    methods: {
        ...mapMutations(['toggleMenuVisible', 'setLang']),
        getSubmenuClass(id) {
            return this.opened.includes(id) ? 'open' : '';
        },
        toggleSubmenu(id) {
            if (this.opened.includes(id)) {
                const idx = this.opened.indexOf(id);
                this.opened.splice(idx, 1);
            } else {
                this.opened.push(id);
                if (!this.menuVisible) {
                    this.toggleMenuVisible();
                }
            }
        },
        toggleMenu() {
            this.toggleMenuVisible();
            if (!this.menuVisible) {
                this.opened = [];
            }
        },
        t(str) {
            return this.i18n.tl(str, this.lang);
        }
    }
}
</script>

<style lang="scss">
.sidebar {
    background-color: #666666;
    min-height: 100%;
    padding-top: 46px;
    position: relative;
    left: 0;
    width: 220px;
    transition: left 250ms ease-out 0s !important;

    &+.stage {
        transition: margin-left 250ms ease-out 0s !important;
    }

    &.menu-hidden {
        left: -160px;
        
        li {
            a {
                text-align: right;
            }
            span {
                display: none;
            }
        }

        &+.stage {
            margin-left: -130px !important;
        }
        .toggle-menu {
            left: 166px;
            &:hover {
                opacity: 1;
            }
            .fa-chevron-left {
                display: none;
            }
            .fa-bars {
                display: inline-block;
            }
        }
    }

    .toggle-menu {
        background-color: #666666;
        color: #FFFFFF;
        padding: 0.8rem;
        position: absolute;
        top: 4px;
        left: 4px;
        display: inline-block;
        width: auto;
        transition: all 250ms ease-out 0s;
        -webkit-border-bottom-right-radius: 10px;
        -moz-border-radius-bottomright: 10px;
        border-bottom-right-radius: 10px;

        .fa-bars {
            display: none;
        }
    }
    .main-menu {
        padding: 0;
        margin: 0;

        ul {
            padding: 0;
            margin: 0;
            list-style: none;
            li {
                padding: 0;
                margin: 0;
                a {
                    display: block;
                    padding: 1rem;
                    list-style: none;
                    color: white;

                    .fa {
                        margin-right: 0.6rem;
                    }
                    &:hover {
                        background-color: #555555;
                        color: #CCC
                    }
                }
            }
        }

        .submenu {
            display: none;

            li a {
                padding-left: 1.6rem;
            }
        }

        li.has-submenu.open {
            .submenu {
                display: block;
            }
        }
    }
}
</style>