<script setup>
import { ref } from 'vue';

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
});
const count = ref(props.count ?? 0);
</script>

<template>
  <div class="card bg-base-100 w-96 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">Vue Counter: {{ count }}</h2>
      <p>A simple Vue client island with an interactive counter.</p>
      <div class="card-actions">
        <button class="btn btn-outline" @click="count--">Decrement</button>
        <button class="btn btn-outline" @click="count++">Increment</button>
      </div>
    </div>
  </div>
</template>
