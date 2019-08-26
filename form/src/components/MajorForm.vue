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
          outlined
          label="Subject"
          v-model="subject"
          required
          :rules="[v => v.length > 50 || 'Subject must be longer']"
          :mandatory="true"
        ></v-textarea>

        <p>Proof</p>
        <v-row
          no-gutters
          v-for="(obj, index) in additionalLinksData" 
          v-bind:key="index">
          <v-col cols="11">
            <v-text-field  
              label="Link to trusted source"
              :mandatory="true"
              outlined
              v-model="additionalLinksData[index].link"
              required
              :rules="proofRules">
            </v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn v-if="index !== 0" text height="65%" @click="additionalLinksData.splice(index, 1)">
              <v-icon >mdi-minus</v-icon>
            </v-btn>
          </v-col>
          
        </v-row>
        
        <v-btn text @click="additionalLinksData.push({links: ''})">
            <v-icon left>mdi-plus</v-icon> add more
        </v-btn>

        <v-switch color="warning" v-model="emailReport" label="Email me updates on this case"></v-switch>

        <v-btn outlined color="warning" class="save-btn" large v-bind:disabled="!valid" @click="onSubmit">
          Save
        </v-btn>
      </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { URLREGEX } from '../main';

@Component
export default class MajorForm extends Vue {
    public valid = false;
    private why = 'toxicity';
    private subject = '';
    private additionalLinksData = [{link: ''}];
    private emailReport = false;

    private proofRules: Array<(s: string) => boolean|string> = [
      (v) => !!v || 'Proof required',
      (v) => URLREGEX.test(v) || 'Not a valid URL',
    ];

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