<template>
<v-form v-model="valid" ref="form" @submit.prevent="onSubmit">
    <v-container>
        <p>Where did the offence occur?</p>
        <v-radio-group v-model="where" :mandatory="true" :rules="[v => !!v || 'Item is required']">
            <v-radio color="warning" label="In-game" value="in-game"></v-radio>
            <v-radio color="warning" label="Matchroom chat" value="matchroom-chat"></v-radio>
        </v-radio-group>
    </v-container>

    <v-container v-if="where !== ''">
        <p>Offences/Reason</p>
        <p style="color: red" v-if="offenceInvalid">Please select at least one</p>
        <v-container @click="evalCheckboxes()">
            <v-checkbox v-model="offences['rage']" color="warning" label="Rage"></v-checkbox>
            <v-checkbox v-model="offences['flaming']" color="warning" label="Flaming"></v-checkbox>

            <!-- In game -->
            <v-checkbox v-if="where === 'in-game'" v-model="offences['not-communicating']" color="warning" label="Not communicating"></v-checkbox>
            <v-checkbox v-if="where === 'in-game'" v-model="offences['afk-ing']" color="warning" label="AFK-ing"></v-checkbox>
            <v-checkbox v-if="where === 'in-game'" v-model="offences['muting-all-teammates']" color="warning" label="Muting all teammates"></v-checkbox>
            <v-checkbox v-if="where === 'in-game'" v-model="offences['force-buying']" color="warning" label="Force-buy"></v-checkbox>
            <v-checkbox v-if="where === 'in-game'" v-model="offences['not-listening-to-strats']" color="warning" label="Not listening to stats"></v-checkbox>
            <v-checkbox v-if="where === 'in-game'" v-model="offences['playing-alone-not-as-a-team']" color="warning" label="Playing alone, not as a team"></v-checkbox>
            <!-- matchoom -->
            <v-checkbox v-if="where === 'matchroom-chat'" v-model="offences['spamming']" color="warning" label="Spamming"></v-checkbox>
            <v-checkbox v-if="where === 'matchroom-chat'" v-model="offences['offensive-language']" color="warning" label="Offensive language"></v-checkbox>
        </v-container>

        <v-container v-if="where === 'in-game'">
            <p>Additional Info</p>
            <v-row v-for="(obj, index) in additionalData" v-bind:key="index">
                <v-row>
                    <v-col cols="3">
                        <v-text-field
                            color="warning"
                            label="Round"
                            :mandatory="true"
                            outlined
                            v-model="additionalData[index].additionalDataRound"
                            required
                            :rules="[v => !!v || 'Required', v => /^\d+$/.test(v) || 'Number required']">
                        </v-text-field>
                    </v-col>
                    <v-col cols="7">
                        <v-text-field
                            color="warning"
                            label="Description"
                            :mandatory="true"
                            outlined
                            v-model="additionalData[index].additionalDataDetail"
                            required
                            :rules="[v => !!v || 'Required']">
                        </v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn v-if="additionalData.length > 1" text height="65%" @click="additionalData.splice(index, 1)">
                            <v-icon >mdi-minus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-row>
            <v-btn color="warning" text @click="additionalData.push({additionalDataDetail: '', additionalDataRound: ''})">
                <v-icon left>mdi-plus</v-icon> add more
            </v-btn>
        </v-container>

        <v-container>
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
        </v-container>


    </v-container>

    <v-container>
        <v-btn v-bind:disabled="!valid || offenceInvalid" @click="onSubmit" large outlined color="warning">
            Submit
        </v-btn>
    </v-container>

</v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { URLREGEX } from '../main';
import {uploadToImgur} from '../imgur';
import ProofComponent from './Proof/Proof.vue';
import DropComponent from '@/components/Proof/Drop.vue';
import {AdditionalLinksData} from "@/types";

interface AdditionalDatum {
    additionalDataRound: string;
    additionalDataDetail: string;
}

@Component({
  components: {
    ProofComponent,
  },
})
export default class MinorForm extends Vue {

    private valid = false;
    private where = '';
    private offences = {
        'rage': false,
        'flaming': false,
        'not-communicating': false,
        'afk-ing': false,
        'muting-all-teammates': false,
        'force-buying': false,
        'not-listening-to-strats': false,
        'playing-alone-not-as-a-team': false,
        'spamming': false,
        'offensive-language': false,
    };
    private offenceInvalid = false;
    private additionalData: AdditionalDatum[] = [{additionalDataRound: '', additionalDataDetail: ''}];
    private proofs = [0];

    private async onSubmit(): Promise<boolean> {
        this.evalCheckboxes();
        // @ts-ignore
        this.$refs.form.validate();
        if (!this.valid || this.offenceInvalid) {
            return false;
        }
        const proofs = this.$refs.proofs as ProofComponent[]; // all referenced proof components
        for (const proof of proofs) {
          if (!proof.valid()) {
            return false;
          }
        }
        if (this.where === 'in-game') {
            return await this.onSubmitInGame();
        } else if (this.where === 'matchroom-chat') {
            return await this.onSubmitMatchroom();
        }
        return false;
    }

    private async onSubmitInGame(): Promise<boolean> {
        const offences = this.evalCheckboxes();
        const evalRes = await this.evalLinks();
        if (evalRes === null) {
            return false;
        }
        const {proofLink, additionalLinksData} = evalRes;
        const additionalData = this.evalAdditionalData();
        const pl = {
            data: {
                where: this.where,
                offences,
                proofLink,
                additionalLinksData,
                additionalData,
            },
        };
        this.$emit('submitted', pl);
        // @ts-ignore
        this.$refs.form.reset();
        return true;
    }

    private async onSubmitMatchroom(): Promise<boolean> {
        const offences = this.evalCheckboxes();
        const evalRes = await this.evalLinks();
        if (evalRes === null) {
            return false;
        }
        const {proofLink, additionalLinksData} = evalRes;
        const pl = {
            data: {
                where: this.where,
                offences,
                proofLink,
                additionalLinksData,
            },
        };
        this.$emit('submitted', pl);
        // @ts-ignore
        this.$refs.form.reset();
        return true;
    }

    private async evalLinks(): Promise<null|{proofLink: string, additionalLinksData: AdditionalLinksData}> {
        let additionalLinksData: Array<{link: string}> = [];
        const proofs = this.$refs.proofs as ProofComponent[]; // all referenced proof components
        try {
            for (const proof of proofs) {
                if (proof.mode === 1) {
                    additionalLinksData.push({link: proof.urlValue});
                } else {
                    const drop = proof.$refs.drop as DropComponent;
                    const resp = await uploadToImgur(drop.stagingFiles as FileList);
                    const toConcat = resp.map((s: string) => ({link: s}));
                    additionalLinksData = additionalLinksData.concat(toConcat);
                }
            }
            let proofLink = additionalLinksData.splice(0, 1)[0].link;  // take first of proof
            return {proofLink, additionalLinksData};
        } catch(error) {
            console.error('Uploading to imgur failed', error);
            return null;
        }
    }

    private evalAdditionalData() {
        const additionalData: Array<{round: number, description: string}> = [];
        for (const obj of this.additionalData) {
            additionalData.push({
                round: +obj.additionalDataRound,
                description: obj.additionalDataDetail,
            });
        }
        return additionalData;
    }

    private evalCheckboxes(): string[] {
        const arr: string[] = [];
        for (const key in this.offences) {
            if (this.offences.hasOwnProperty(key)) {
                // @ts-ignore
                if (this.offences[key] === true) {
                    arr.push(key);
                }
            }
        }
        this.offenceInvalid = arr.length === 0;
        return arr;
    }
}
</script>

<style lang="scss" scoped>
.v-input--checkbox {
    margin-top: 0!important;
}
</style>
