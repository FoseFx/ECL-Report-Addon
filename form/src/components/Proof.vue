<template>
<div class="imgur-wrapper">
    <p class="legal">By using the Imgur uploader you agree <a href="https://imgur.com/tos" target="blank">to their Terms</a></p>
    <div 
        class="imgur-drop"
        v-bind:class="{isdraging: isDraging, hasselected: hasSelected}"
        @drag="preventDefaultAndBubbling"
        @dragstart="preventDefaultAndBubbling"
        @dragend="removeDraging"
        @dragover="setDraging"
        @dragenter="setDraging"
        @dragleave="removeDraging"
        @drop="drop">
        <label>
            {{hasSelected ? filename : 'Drop/select image(s) here'}}
            <input type="file" @change="inputSelected" multiple="multiple" accept="image/*">
        </label>
    </div>
    <div>
        <v-btn raised color="purple">Or use a URL</v-btn>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ProofComponent extends Vue {
    public isDraging = false;
    public hasSelected = false;
    public filename = '';
    public stagingFiles: FileList|null = null;

    public preventDefaultAndBubbling(e: Event) {
        e.preventDefault();
        e.stopPropagation();
    }
    public setDraging(e: Event) {
        this.preventDefaultAndBubbling(e);
        this.isDraging = true;
    }
    public removeDraging(e: Event) {
        this.preventDefaultAndBubbling(e);
        this.isDraging = false;
    }
    public inputSelected(e: Event) {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        this.afterSelect(files);
    }
    public drop(e: DragEvent) {
        const transfer = e.dataTransfer;
        if (transfer === null) {
            return;
        }
        const files = transfer.files;
        this.preventDefaultAndBubbling(e);
        this.afterSelect(files);
    }
    public afterSelect(files: FileList|null) {
        if (files === null || files.length === 0) {
            return;
        }
        this.hasSelected = true;
        if (files.length === 1) {
            this.filename = files[0].name;
        } else {
            this.filename = `${files.length} items`;
        }
        this.stagingFiles = files as FileList;        
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
}
.imgur-drop {
    border-radius: 0.5rem;
    background: rgb(232,183,69);
    background: -moz-linear-gradient(45deg, rgba(232,183,69,1) 30%, rgba(175,102,221,1) 100%);
    background: -webkit-linear-gradient(45deg, rgba(232,183,69,1) 30%,rgba(175,102,221,1) 100%);
    background: linear-gradient(45deg, rgba(232,183,69,1) 30%,rgba(175,102,221,1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#e8b745', endColorstr='#af66dd',GradientType=1 );
    & > label {
        cursor: pointer;
        padding: 0.6rem;
        border: medium dashed rgba(234, 234, 234, 0.5);
        border-radius: 0.3rem;
        transition: padding 0.2s ease-out, border 0.1s linear;
    }
    &.isdraging {
        & > label {
            padding: 0.8rem;
            border: medium dashed rgba(234, 234, 234, 0.8);
        }
    }
    &.hasselected {
        & > label {
            padding: 0.8rem;
            border: none;
        }
    }
    input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0.01;
    }
}
.legal {
    position: absolute;
    bottom: 3px;
    left: 0;
    font-size: 0.7rem;
    padding: 0;
    margin: 0;
    padding-left: 3px;
}

</style>