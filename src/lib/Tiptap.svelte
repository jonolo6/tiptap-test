<script lang="ts">
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import * as Item from '$lib/components/ui/item/index.js';
	import TiptapMenu from './TiptapMenu.svelte';
	import { Separator } from './components/ui/sidebar';
	import { TiptapViewModel } from './tiptap-menu/TipTapViewModel.svelte';
	import Button from './components/ui/button/button.svelte';

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

<Item.Root variant="muted">
	<Item.Content>
		<Item.Title>Debug info</Item.Title>
		<Item.Description class="flex flex-col">
			<pre>{JSON.stringify(model?.active)}</pre>
			<div>List: {model?.list}</div>
			<div>Heading: {model?.heading}</div>
		</Item.Description>
	</Item.Content>
	<Item.Actions>
		<Button variant="outline" size="sm">Open</Button>
	</Item.Actions>
</Item.Root>

<div class={['rounded-lg border border-border', 'mt-2']}>
	<div>
		{#if model != null}
			<TiptapMenu {model} class="" />
		{/if}

		<div bind:this={element} class="rounded px-4 py-4"></div>
	</div>
</div>

<style>
</style>
