<template>
  <v-form v-model="valid" ref="form" @submit.prevent="onSubmit">
      <v-container fluid>
        <p>Offence/Reason</p>
        <v-radio-group v-model="why" :mandatory="true" :rules="[v => !!v || 'Item is required']">
            <v-radio color="warning" label="Toxicity" value="toxicity"></v-radio>
            <v-radio color="warning" label="Abusive kick" value="abusive-kick"></v-radio>
            <v-radio color="warning" label="Hacking" value="hacking"></v-radio>
            <v-radio color="warning" label="Griefing" value="griefing"></v-radio>
            <v-radio color="warning" label="Smurf" value="smurf"></v-radio>
            <v-radio color="warning" label="Boosting" value="boosting"></v-radio>
            <v-radio color="warning" label="Leaderboard abuse" value="leaderboard-abuse"></v-radio>
            <v-radio color="warning" label="Offensive language" value="offensive-language"></v-radio>
            <v-radio color="warning" label="Leaver" value="leaver"></v-radio>
            <v-radio color="warning" label="Throwing" value="throwing"></v-radio>
        </v-radio-group>

        <p>Subject</p>
        <v-textarea
          color="warning"
          outlined
          label="Subject"
          v-model="subject"
          required
          :rules="[v => v.length > 50 || 'Subject must be longer']"
          :mandatory="true"
        ></v-textarea>

        <p>Proof</p>
        <proof-component></proof-component>

        <v-switch color="warning" v-model="emailReport" label="Email me updates on this case"></v-switch>

        <v-btn outlined color="warning" class="save-btn" large v-bind:disabled="!valid" @click="onSubmit">
          Save
        </v-btn>
      </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ProofComponent from './Proof/Proof.vue';

@Component({
  components: {
    ProofComponent,
  },
})
export default class MajorForm extends Vue {
    public valid = false;
    private why = 'toxicity';
    private subject = '';
    private additionalLinksData = [{link: ''}];
    private emailReport = false;

    private onSubmit() {
      // @ts-ignore
      this.$refs.form.validate();
      if (!this.valid) {
        return;
      }
      this.$emit('submitted', {
        emailReport: this.emailReport,
        data: {
          why: this.why,
          subject: this.subject,
          additionalLinksData: this.additionalLinksData,
        },
      });
      // @ts-ignore
      this.$refs.form.reset();
    }
}
</script>

<style lang="scss" scoped>

</style>