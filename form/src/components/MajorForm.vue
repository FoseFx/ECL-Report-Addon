<template>
  <v-form v-model="valid" ref="form" @submit.prevent="onSubmit" v-bind:disabled="blockEverything">
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
         <v-row
          no-gutters
          v-for="(_, index) in proofs"
          v-bind:key="index">
            <v-col cols="11">
              <proof-component ref="proofs"></proof-component>
              <br>
            </v-col>
            <v-col cols="1" style="display: flex;align-items: center">
              <v-btn v-if="proofs.length > 1" text @click="proofs.splice(index, 1)">
                <v-icon >mdi-minus</v-icon>
              </v-btn>
            </v-col>
         </v-row>

        <v-btn text @click="proofs.push(proofs[proofs.length - 1] + 1)">
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
import ProofComponent from './Proof/Proof.vue';
import DropComponent from './Proof/Drop.vue';

@Component({
  components: {
    ProofComponent,
  },
})
export default class MajorForm extends Vue {
    public valid = false;
    private blockEverything = false;
    private why = 'toxicity';
    private subject = '';
    private emailReport = false;
    private proofs = [0];

    private async onSubmit() {
      // @ts-ignore
      this.$refs.form.validate(); // ask vuetify to validate form once again
      if (!this.valid) { // return if not valid, this wont include the Proof Components in mode = 0
        return;
      }

      //
      // Validate Proof Components
      //
      const proofs = this.$refs.proofs as ProofComponent[]; // all referenced proof components
      for (const proof of proofs) {
        if (!proof.valid()) {
          return;
        }
      }

      let additionalLinksData: Array<{links: string}> = [];

      for (const proof of proofs) {
        if (proof.mode === 1) {
          additionalLinksData.push({links: proof.urlValue});
        } else {
          const drop = proof.$refs.drop as DropComponent;
          const resp = await this.uploadToImgur(drop.stagingFiles as FileList);
          const toConcat = resp.map((s: string) => ({links: s}));
          additionalLinksData = additionalLinksData.concat(toConcat);
        }
      }

      //
      // tell parent to show captcha by passing the data to it
      //
      this.$emit('submitted', {
        emailReport: this.emailReport,
        data: {
          why: this.why,
          subject: this.subject,
          additionalLinksData,
        },
      });

      //
      // Reset UI for next use
      //

      // @ts-ignore
      this.$refs.form.reset();
    }

    private async uploadToImgur(files: FileList): Promise<string[]> {
      const array: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append('image', file);
        body.append('type', 'file');
        body.append('name', file.name);
        body.append('title', 'Image uploaded by the ECL-Report-Addon');

        const res = await fetch('https://api.imgur.com/v3/upload', {
          // We bypass CORS by requesting permission for imgur.com in manifest.json
          method: 'POST',
          headers: {
            Authorization: 'Client-ID 5d7cf2731f6b345',
          },
          body,
        });
        const json = await res.json();
        array.push(json.link);
      }
      return array;
    }
}
</script>

<style lang="scss" scoped>

</style>