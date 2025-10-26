<script lang="ts">
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

	import TiptapMenu from './TiptapMenu.svelte';
	import { TiptapViewModel } from './tiptap-menu/TipTapViewModel.svelte';
	import { Separator } from './components/ui/sidebar';

	let {
		content = `
        <h1>Hello Svelte! 🌍️ </h1>
        <p>This editor is running in Svelte.</p>
        <p>Select some text to see the bubble menu popping up.</p>
      `,
		onUpdate
	}: { content: Content; onUpdate: (model: TiptapViewModel) => void } = $props();

	let element = $state<HTMLDivElement>();

	let model = $state<TiptapViewModel>();
	onMount(() => {
		model = new TiptapViewModel(element!, content, onUpdate);
		return () => {
			model?.destroy();
		};
	});
</script>

<div class="rounded border border-blue-200 bg-blue-100 px-2 py-1 text-sm shadow">
	<pre>{JSON.stringify(model?.active)}</pre>
	<div>List: {model?.list}</div>
</div>

<Separator class="mt-2" />

<div style="position: relative" class="app">
	{#if model != null}
		<TiptapMenu {model} class="mx-2 my-2" />
	{/if}

	<div bind:this={element} class="px-4 py-4"></div>
</div>

<style>
</style>
