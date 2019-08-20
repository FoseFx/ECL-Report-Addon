<template>
  <v-form v-model="valid">
      <v-container fluid>
        <p>Offence/Reason</p>
        <v-radio-group v-model="why" :mandatory="true" :rules="[v => !!v || 'Item is required']">
            <v-radio label="Toxicity" value="toxicity"></v-radio>
            <v-radio label="Abusive kick" value="abusive-kick"></v-radio>
            <v-radio label="Hacking" value="hacking"></v-radio>
            <v-radio label="Griefing" value="griefing"></v-radio>
            <v-radio label="Smurf" value="smurf"></v-radio>
            <v-radio label="Boosting" value="boosting"></v-radio>
            <v-radio label="Leaderboard abuse" value="leaderboard-abuse"></v-radio>
            <v-radio label="Offensive language" value="offensive-language"></v-radio>
            <v-radio label="Leaver" value="leaver"></v-radio>
            <v-radio label="Throwing" value="throwing"></v-radio>
        </v-radio-group>

        <p>Subject</p>
        <v-textarea
          outlined
          label="Subject"
          v-model="subject"
          required
          :mandatory="true"
        ></v-textarea>

        <p>Proof</p>
        <v-text-field
            v-for="(obj, index) in additionalLinksData"
            label="Link to trusted source"
            :mandatory="true"
            outlined
            v-model="additionalLinksData[index].link"
            required
            v-bind:key="index"
            ></v-text-field>
        <v-btn text @click="additionalLinksData.push({links: ''})">
            <v-icon left>mdi-plus</v-icon> add more
        </v-btn>
        <v-btn text v-if="additionalLinksData.length > 1" @click="additionalLinksData.pop()">
            <v-icon left>mdi-minus</v-icon> remove last
        </v-btn>
        
      </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class MajorForm extends Vue {
    public valid = false;
    private why = 'toxicity';
    private subject = '';
    private additionalLinksData = [{link: ''}];
}
</script>

<style lang="scss" scoped>

</style>