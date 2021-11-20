<template>
    <div :class="['loading-overlay', this.waiting ? 'visible' : 'hidden'] ">
        <div class="center">
            <div class="image" v-html="spinner"></div>
            <div class="text">{{message}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        bgColor: {
            type: String,
            default: '#000000'
        },
        bgOpacity: {
            type: Number,
            default: 0.5
        },
        textColor: {
            type: String,
            default: '#FFFFFF'
        },
        message: {
            type: String,
            default: ''
        },
        spinner: {
            type: String,
            default: '<em class="fa fa-spinner"></em>'
        },
        rotateSpinner: {
            type: Number,
            default: 1
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            waiting: this.visible
        };
    },
    methods: {
        applyStyle() {
            Object.assign(document.querySelector('.loading-overlay').style, {
                backgroundColor: this.bgColor,
                opacity: this.bgOpacity
            });
            document.querySelector('.loading-overlay .text').style.color = this.textColor;
            if (this.rotateSpinner) {
                Object.assign(document.querySelector('.loading-overlay .image > *').style, {
                    animation: `spin ${this.rotateSpinner}s linear infinite`,
                    color: this.textColor
                });
            }
        }
    },
    mounted() {
        this.applyStyle();
    },
    watch: {
        visible(val) {
            this.waiting = Boolean(val);
        }
    }
}
</script>

<style lang="scss">
.loading-overlay {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: all;
    transition: opacity 200ms ease 0s;

    &.hidden {
        opacity: 0 !important;
        pointer-events: none;
    }

    .center {
        text-align: center;
    }

    .image {
        font-size: 42px;
        margin-bottom: 1.2rem;
    }

    .text {
        font-size: 16px;
        font-weight: 500;
    }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>