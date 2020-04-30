<template>
  <div class="app">
    <h1>Vue Template</h1>
    <p>{{ time }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  time: Date = new Date();

  handler = 0;

  mounted() {
    if (!this.handler) {
      this.handler = setInterval(() => (this.time = new Date()), 1000);
    }

    // eslint-disable-next-line
    console.log('hello vue');
  }
}
</script>
