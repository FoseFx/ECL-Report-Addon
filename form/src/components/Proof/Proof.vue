<template>
<div class="imgur-wrapper" v-bind:class="{invalid: !valid() && dirty()}">
    <p class="legal">By using Imgur you agree <a href="https://imgur.com/tos" target="blank">to their Terms</a></p>
    <drop-component @valid="setImgurValid" @dirty="setImgurDirty"></drop-component>
    <div>
        <v-btn raised color="purple">Or use an URL</v-btn>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DropComponent from './Drop.vue';

@Component({
    components: {
        DropComponent,
    },
})
export default class ProofComponent extends Vue {
    public mode: 0|1 = 0; // 0 = Imgur, 1 = URL
    public imgurValid = false;
    public imgurDirty = false;

    public setImgurValid(bool: boolean) {
        this.imgurValid = bool;
    }
    public setImgurDirty(bool: boolean) {
        this.imgurDirty = bool;
    }

    public valid(): boolean {
        if (this.mode === 0) {
            return this.imgurValid;
        }
        return false; // @TODO
    }
    public dirty(): boolean {
        if (this.mode === 0) {
            return this.imgurDirty;
        }
        return false; // @TODO
    }
}
</script>

<style lang="scss" scoped>
.imgur-wrapper {
    position: relative;
    margin: 0 auto;
    width: 90%;
    height: 8rem;
    border-radius: 0.5rem;
    background: white;
    display: grid;
    grid-template: 1fr / 2fr 1fr;
    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &.invalid {
        border: solid red 0.3rem;
    }
}
.legal {
    position: absolute;
    bottom: 3px;
    left: 0;
    font-size: 0.8rem;
    padding: 0;
    margin: 0;
    padding-left: 3px;
}

</style>