<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let { class: className = '' }: { class?: ClassValue } = $props();
</script>

<main class={['p2-4 px-4', className]}>Select or create note...</main>
