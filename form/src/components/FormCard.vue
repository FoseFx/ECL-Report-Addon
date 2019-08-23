<template>
 <v-card
    class="mx-auto"
    outlined
  >
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

    <v-tabs grow v-model="tab" color="warning">
      <v-tab key="minor">Minor</v-tab>
      <v-tab key="major">Major</v-tab>
    </v-tabs>


    <v-tabs-items v-model="tab">
      <v-tab-item key="minor">
        <v-card flat>
          <MinorForm></MinorForm>
        </v-card>
      </v-tab-item>

      <v-tab-item key="major">
        <v-card flat>
          <MajorForm v-on:submitted="onSubmit"></MajorForm>
        </v-card>
      </v-tab-item>
      
    </v-tabs-items>



    <v-card-actions>
      <v-btn outlined text>Cancel</v-btn>
    </v-card-actions>

    <iframe src="https://report.ecl.gg/" width="100%" height="170px"></iframe>

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
    @Prop() public division!: number;
    @Prop() public complaiantUUID!: string;
    @Prop() public complaiantName!: string;
    @Prop() public reportedUUID!: string;
    @Prop() public reportedName!: string;
    @Prop() public email!: string;

    private tab = 0;

    public onSubmit(event: Report) {
      const type = this.tab === 0 ? 'minor' : 'major';
      const report: Report = Object.assign({
        type,
        service: 'classical',
        complaiantName: this.complaiantName,
        complaiantUUID: this.complaiantUUID,
        email: this.email,
        emailPub: false,
        data: {
          division: this.division + '',
          matchroomLink: document.location.href,
        },
        reportedUUID: this.reportedUUID,
        reportedName: this.reportedName,
      }, event);
      console.log(report);
      document.dispatchEvent(new CustomEvent('ecl_report_addon_query_built', {detail: report}));
    }
}
</script>