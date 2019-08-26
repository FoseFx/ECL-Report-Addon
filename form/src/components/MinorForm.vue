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

    <!-- In Game -->
    <v-container v-if="where === 'in-game'">
        <p>Offences/Reason</p>
        <p style="color: red">Please select at least one</p>
        <v-container fluid>
            <v-checkbox v-model="offences['rage']" color="warning" label="Rage"></v-checkbox>
            <v-checkbox v-model="offences['flaming']" color="warning" label="Flaming"></v-checkbox>
            <v-checkbox v-model="offences['not-communicating']" color="warning" label="Not communicating"></v-checkbox>
            <v-checkbox v-model="offences['afk-ing']" color="warning" label="AFK-ing"></v-checkbox>
            <v-checkbox v-model="offences['muting-all-teammates']" color="warning" label="Muting all teammates"></v-checkbox>
            <v-checkbox v-model="offences['force-buying']" color="warning" label="Force-buy"></v-checkbox>
            <v-checkbox v-model="offences['not-listening-to-strats']" color="warning" label="Not listening to stats"></v-checkbox>
            <v-checkbox v-model="offences['playing-alone-not-as-a-team']" color="warning" label="Playing alone, not as a team"></v-checkbox>
        </v-container>

        <v-container fluid>
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
            <v-btn text @click="additionalData.push({additionalDataDetail: '', additionalDataRound: ''})">
                <v-icon left>mdi-plus</v-icon> add more
            </v-btn>
        </v-container>

        <!-- TODO Proof -->

    </v-container>
</v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

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
    };
    private additionalData: AdditionalDatum[] = [{additionalDataRound: '', additionalDataDetail: ''}];

    private onSubmit() {

    }
}
</script>

<style lang="scss" scoped>

</style>