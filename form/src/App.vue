<template>
  <div id="ecl_addon_popup_wrapper" v-bind:class="{'show': show }">
    <v-app >
      <v-content>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="10" md="8" lg="6">
              <FormCard
                v-on:close="show = false"
                v-bind:division="division"
                v-bind:avatar="avatarUrl"
                v-bind:complainant-u-u-i-d="complainantUUID"
                v-bind:complainant-name="complainantName"
                v-bind:reported-u-u-i-d="reportedUUID"
                v-bind:reported-name="reportedName"
                v-bind:email="email"
                v-bind:visible="show">
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
        public division: string = '';
        public complainantUUID: string = '';
        public complainantName: string = '';
        public reportedUUID: string = '';
        public reportedName: string = '';
        public avatarUrl: string = '';
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

  .v-input--selection-controls.v-input--checkbox > .v-input__control > .v-messages {
    display: none!important;
  }
</style>
