<script lang="ts">
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

	import TiptapMenu from '$lib/components/tiptap-menu/TiptapMenu.svelte';
	import { TiptapViewModel } from '$lib/components/tiptap-menu/TipTapViewModel.svelte';
	import type { ClassValue } from 'svelte/elements';
	import BubbleMenu from './BubbleMenu.svelte';
	import BubbleMenuCgpt from './BubbleMenuCGPT.svelte';

	let {
		content = `
        <h1>Hello Svelte! 🌍️ </h1>
        <p>This editor is running in Svelte.</p>
        <p>Select some text to see the bubble menu popping up.</p>
      `,
		onUpdate,
		class: classValue,
	}: {
		content: Content;
		onUpdate: (model: TiptapViewModel) => void;
		class?: ClassValue;
	} = $props();

	let element = $state<HTMLDivElement>();
	let bubbleEl = $state<HTMLDivElement>();

	let model = $state<TiptapViewModel>();
	onMount(() => {
		model = new TiptapViewModel(element!, content, onUpdate);
		return () => {
			model?.destroy();
		};
	});

	// let outputHTML = $state('');
	// const editor = $derived(model?.editor);
</script>

<!-- <Item.Root variant="muted"> -->
<!-- 	<Item.Content> -->
<!-- 		<Item.Title>Debug info</Item.Title> -->
<!-- 		<Item.Description class="flex flex-col"> -->
<!-- 			<pre>{JSON.stringify(model?.active)}</pre> -->
<!-- 			<div>List: {model?.list}</div> -->
<!-- 			<div>Heading: {model?.heading}</div> -->
<!-- 		</Item.Description> -->
<!-- 	</Item.Content> -->
<!-- 	<Item.Actions> -->
<!-- 		<Button variant="outline" size="sm">Open</Button> -->
<!-- 	</Item.Actions> -->
<!-- </Item.Root> -->

{#if model != null}
	<BubbleMenuCgpt
		{model}
		shouldShow={({ editor }) => editor.state.selection.from !== editor.state.selection.to}
	/>
{/if}
<!-- </div> -->
<div class={[classValue ?? '']}>
	{#if model != null}
		<TiptapMenu {model} class="" />
	{/if}

	<div bind:this={element} class="rounded px-4 py-4"></div>
</div>

<style>
</style>
