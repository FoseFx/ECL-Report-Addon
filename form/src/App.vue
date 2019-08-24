<template>
<div id="ecl_addon_popup_wrapper" v-bind:class="{'show': show }">
  <v-app >
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="7" 	lg="4" >
            <FormCard
              v-on:close="show = false"
              v-bind:division="division"
              v-bind:complaiant-u-u-i-d="complaiantUUID"
              v-bind:complaiant-name="complaiantName"
              v-bind:reported-u-u-i-d="reportedUUID"
              v-bind:reported-name="reportedName" 
              v-bind:email="email">
            </FormCard>
          </v-col>
      </v-row>
    </v-container>
  </v-content>
</v-app>

</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import FormCard from './components/FormCard.vue';

@Component({
  components: {
    FormCard,
  },
})
export default class App extends Vue {
  public division: number = -1;
  public complaiantUUID: string = '';
  public complaiantName: string = '';
  public reportedUUID: string = '';
  public reportedName: string = '';
  public email: string = '';
  public show = false;
}
</script>

<style>
#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  z-index: 1000;
  background: rgba(0,0,0,0.6);
}
#ecl_addon_popup_wrapper {
  display: none;
}
#ecl_addon_popup_wrapper.show {
  display: block!important;
}
</style>