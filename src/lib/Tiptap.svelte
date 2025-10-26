<script lang="ts">
	import { onMount } from 'svelte';
	import TiptapMenu from './TiptapMenu.svelte';
	import { TiptapViewModel } from './tiptap-menu/TipTapViewModel.svelte';

	let {
		content = `
        <h1>Hello Svelte! 🌍️ </h1>
        <p>This editor is running in Svelte.</p>
        <p>Select some text to see the bubble menu popping up.</p>
      `
	} = $props();

	let element = $state<HTMLDivElement>();

	let model = $state<TiptapViewModel>();
	onMount(() => {
		model = new TiptapViewModel(element!, content);
		return () => {
			model?.destroy();
		};
	});
</script>

<div class="bg-blue-200">
	<pre>{JSON.stringify(model?.active)}</pre>
</div>
<div style="position: relative" class="app">
	{#if model != null}
		<TiptapMenu {model} class="mx-2 my-2" />
	{/if}

	<div bind:this={element}></div>
</div>

<style>
</style>
