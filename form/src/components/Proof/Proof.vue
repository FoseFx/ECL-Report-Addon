<template>
<div class="imgur-wrapper" v-bind:class="{invalid: !valid() && dirty(), url: mode === 1}">
    <!-- Imgur -->
    <p v-if="mode === 0" class="legal">By using Imgur you agree <a href="https://imgur.com/tos" target="blank">to their Terms</a></p>
    <drop-component v-if="mode === 0" @valid="setImgurValid" @dirty="setImgurDirty"></drop-component>
    <div v-if="mode === 0">
        <v-btn raised color="purple" @click="mode = 1">Or use an URL</v-btn>
    </div>


    <!-- URL -->
    <div v-if="mode === 1" style="background: white; border-radius: 0.5rem">
        <v-btn raised color="purple" @click="mode = 0">Or use Imgur</v-btn>
    </div>
    <div v-if="mode === 1" style="padding: 1rem">
         <v-text-field
            @change="urldirty = true"
            v-model="urlValue"
            style="transform: translateY(15px)"
            color="warning"
            label="Link to trusted source"
            :mandatory="true"
            outlined
            required
            :rules="proofRules">
        </v-text-field>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DropComponent from './Drop.vue';
import { URLREGEX } from '../../main';

@Component({
    components: {
        DropComponent,
    },
})
export default class ProofComponent extends Vue {
    public mode: 0|1 = 0; // 0 = Imgur, 1 = URL
    public imgurValid = false;
    public imgurDirty = false;
    public urldirty = false;
    public urlValue = '';

    private proofRules: Array<(s: string) => boolean|string> = [
      (v) => !!v || 'Proof required',
      (v) => URLREGEX.test(v) || 'Not a valid URL',
    ];

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
        for (const fn of this.proofRules) {
            if (typeof fn(this.urlValue) === 'string') {
                return false;
            }
        }
        return true;
    }
    public dirty(): boolean {
        if (this.mode === 0) {
            return this.imgurDirty;
        }
        return this.urldirty;
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
    &.url {
        grid-template: 1fr / 1fr 2fr;
        background: #444455;
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