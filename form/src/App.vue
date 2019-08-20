<template>
<v-app>
  <FormCard division="3" reported-nickname="Uncle Bens"></FormCard>
</v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormCard from './components/FormCard.vue';

@Component({
  components: {
    FormCard,
  },
})
export default class App extends Vue {}
</script>