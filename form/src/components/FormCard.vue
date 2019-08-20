<template>
 <v-card
    max-width="500px"
    class="mx-auto"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">Report</div>
        <v-list-item-title class="headline mb-1">Report player '{{reportedNickname}}'</v-list-item-title>
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

    <v-tabs grow v-model="tab">
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
          <MajorForm max-height="400px"></MajorForm>
        </v-card>
      </v-tab-item>
      
    </v-tabs-items>



    <v-card-actions>
      <v-btn outlined color="warning" text>
        <v-icon left>mdi-pencil</v-icon>Save
      </v-btn>
      <v-btn outlined text>Cancel</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import MinorForm from './MinorForm.vue';
import MajorForm from './MajorForm.vue';

@Component({
    components: {
        MinorForm,
        MajorForm,
    },
})
export default class FormCard extends Vue {
    @Prop() public reportedNickname!: string;
    @Prop() public division!: number;
    private tab = 0;
}
</script>