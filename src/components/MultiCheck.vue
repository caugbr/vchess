<template>
    <span class="multi-check">
        <input type="radio" :name="name" v-bind="attrs">
        <em class="fa fa-check"></em>
    </span>
</template>

<script>
export default {
    name: 'MultiCheck',
    props: {
        name: {
            type: String,
            required: true
        },
        checked: {
            type: Boolean,
            default: false
        },
        id: String
    },
    data() {
        return {
            isChecked: this.checked
        };
    },
    watch: {
        checked(val) {
            this.isChecked = !!val;
        }
    },
    computed: {
        attrs() {
            let ret = this.isChecked ? {checked: true} : {};
            if (this.id) {
                ret.id = this.id;
            }
            return ret;
        }
    }
}
</script>

<style lang="scss">
.multi-check {
    input {
        display: none;
    }
    em.fa {
        color: #666666;
        font-size: 1rem;
        font-weight: 600;
        opacity: 0.5;
        display: inline-block;
    }
    input:checked + em.fa {
        color: rgb(131, 168, 131);
        opacity: 1;
    }
}
</style>