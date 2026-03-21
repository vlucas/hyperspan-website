<script lang="ts">
  let { count = 0 } = $props<{ count?: number }>();
</script>

<div class="card bg-base-100 w-96 shadow-sm">
  <div class="card-body">
    <h2 class="card-title">Svelte Counter: {count}</h2>
    <p>A simple Svelte client island with an interactive counter.</p>
    <div class="card-actions">
      <button class="btn btn-outline" onclick={() => count--}>Decrement</button>
      <button class="btn btn-outline" onclick={() => count++}>Increment</button>
    </div>
  </div>
</div>
