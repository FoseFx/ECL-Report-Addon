<template>
 <v-card
    class="mx-auto"
    outlined
  >
    <div v-if="!done && division !== 'legends'">
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">Report</div>
            <v-list-item-title class="headline mb-1">Report player '{{reportedName}}'</v-list-item-title>
            <p>Division: {{division}}</p>
          </v-list-item-content>

          <v-list-item-avatar
            tile
            size="80"
            color="grey"
           ></v-list-item-avatar>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
        </v-list-item-content>
      </v-list-item>

      <v-tabs grow v-model="tab" color="warning" v-if="!stageTwo">
        <v-tab key="minor">Minor</v-tab>
        <v-tab key="major">Major</v-tab>
      </v-tabs>


      <v-tabs-items v-model="tab" v-if="!stageTwo">
        <v-tab-item key="minor">
          <v-card flat>
            <MinorForm v-on:submitted="onSubmit"></MinorForm>
          </v-card>
        </v-tab-item>

        <v-tab-item key="major" v-if="!stageTwo">
          <v-card flat>
            <MajorForm v-on:submitted="onSubmit"></MajorForm>
          </v-card>
        </v-tab-item>
        
      </v-tabs-items>
    
      <iframe 
        ref="eclframe" 
        v-bind:class="{'zero-opacity': !stageTwo}" 
        src="https://report.ecl.gg/"
        width="100%"
        v-if="showIframe"
        v-bind:height="stageTwo ? '500px' : '1px'">
      </iframe>

    </div>

    <v-card-title v-if="division === 'legends'">This addon does not support the Legends Division</v-card-title>


    <v-card-title v-if="done">Done</v-card-title>
    <v-card-text v-if="done && error">An error occured making the request... {{error}}</v-card-text>

    
    <v-card-actions>
      <v-btn @click="close" outlined text>Close</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MinorForm from './MinorForm.vue';
import MajorForm from './MajorForm.vue';
import { Report } from '../types';

@Component({
    components: {
        MinorForm,
        MajorForm,
    },
})
export default class FormCard extends Vue {
    @Prop() public division!: string;
    @Prop() public complaiantUUID!: string;
    @Prop() public complaiantName!: string;
    @Prop() public reportedUUID!: string;
    @Prop() public reportedName!: string;
    @Prop() public email!: string;

    private stageTwo = false;
    private done = false;
    private error = '';
    private showIframe = true;
    private tab = 0;

    public onSubmit(event: Report) {
      const type = this.tab === 0 ? 'minor' : 'major';
      const report: Report = Object.assign({
        type,
        service: 'classical',
        complaiantName: this.complaiantName,
        complaiantUUID: this.complaiantUUID,
        email: this.email,
        data: {
          division: this.division,
          matchroomLink: document.location.href,
        },
        reportedUUID: this.reportedUUID,
        reportedName: this.reportedName,
      }, event);
      if (type === 'major') {
        report.emailPub = false;
      }
      this.stageTwo = true;
      document.dispatchEvent(new CustomEvent('ecl_report_addon_query_built', {detail: report}));
      this.addListeners();
    }

    private addListeners() {
      const fne = (e: CustomEvent) => {
        this.done = true;
        this.error = e.detail;
        // @ts-ignore
        document.removeEventListener('ecl_report_addon_fetch_failed', fne);
        // @ts-ignore
        document.removeEventListener('ecl_report_addon_fetch_success', fns);
      };
      const fns = (e: CustomEvent) => {
        this.done = true;
        this.error = '';
        // @ts-ignore
        document.removeEventListener('ecl_report_addon_fetch_failed', fne);
        // @ts-ignore
        document.removeEventListener('ecl_report_addon_fetch_success', fns);
      };
      // @ts-ignore
      document.addEventListener('ecl_report_addon_fetch_failed', fne);
      // @ts-ignore
      document.addEventListener('ecl_report_addon_fetch_success', fns);
    }

    private close() {
      this.$emit('close');
      this.stageTwo = false;
      this.done = false;
      this.error = '';
      this.tab = 0;
      this.showIframe = false;
      setTimeout(() => { this.showIframe = true; }, 500);
    }
}
</script>

<style scoped>
.zero-opacity {
  opacity: 0;
}
</style>