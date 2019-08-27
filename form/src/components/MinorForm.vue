<template>
<v-form v-model="valid" ref="form" @submit.prevent="onSubmit">
    <v-container>
        <p>Where did the offence occur?</p>
        <v-radio-group v-model="where" :mandatory="true" :rules="[v => !!v || 'Item is required']">
            <v-radio color="warning" label="In-game" value="in-game"></v-radio>
            <v-radio color="warning" label="Matchroom chat" value="matchroom-chat"></v-radio>
            <v-radio color="warning" label="ECL Division chat" value="ecl-division-chat"></v-radio>
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
                            label="Description"
                            :mandatory="true"
                            outlined
                            v-model="additionalData[index].additionalDataDetail"
                            required
                            :rules="[v => !!v || 'Required']">
                        </v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-btn v-if="index !== 0" text height="65%" @click="additionalData.splice(index, 1)">
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
            <v-row v-for="(_, index) in proof" v-bind:key="index">
                <v-col cols="10">
                    <v-text-field color="warning" label="Link to trusted source" required :rules="urlRules">

                    </v-text-field>
                </v-col>
                <v-col cols="1">
                    <v-btn text v-if="index !== 0" height="65%" @click="proof.splice(index, 1)">
                        <v-icon >mdi-minus</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-btn text @click="proof.push({links: ''})" color="warning">
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

interface AdditionalDatum {
    additionalDataRound: string;
    additionalDataDetail: string;
}

@Component
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
    private proof: string[] = [''];

    private urlRules: Array<(s: string) => boolean|string> = [
        (v) => !!v || 'When added it must be filled out',
        (v) => URLREGEX.test(v) || 'Not a valid URL',
    ];

    private onSubmit(): boolean {
        this.evalCheckboxes();
        // @ts-ignore
        this.$refs.form.validate();
        if (!this.valid || this.offenceInvalid) {
            return false;
        }
        if (this.where === 'in-game') {
            return this.onSubmitInGame();
        } else if (this.where === 'matchroom-chat') {
            return this.onSubmitMatchroom();
        }
        return false;
    }

    private onSubmitInGame(): boolean {
        const offences = this.evalCheckboxes();
        const {proofLink, additionalLinksData} = this.evalLinks();
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

    private onSubmitMatchroom(): boolean {
        const offences = this.evalCheckboxes();
        const {proofLink, additionalLinksData} = this.evalLinks();
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

    private evalLinks() {
        const proofLink = this.proof.splice(0, 1)[0]; // take first of proof
        const additionalLinksData = [];
        for (const link of this.proof) {
            additionalLinksData.push({link});
        }
        return {proofLink, additionalLinksData};
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