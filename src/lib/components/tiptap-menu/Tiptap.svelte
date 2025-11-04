<script lang="ts">
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import TiptapMenu from '$lib/components/tiptap-menu/TiptapMenu.svelte';
	import { TiptapViewModel } from '$lib/components/tiptap-menu/TipTapViewModel.svelte';
	import BubbleMenuCgpt from './BubbleMenuCGPT.svelte';

	let {
		content = `
        <h1>Hello Svelte! 🌍️ </h1>
        <p>This editor is running in Svelte.</p>
        <p>Select some text to see the bubble menu popping up.</p>
      `,
		onUpdate,
		showMenuBar = true,
		class: classValue,
	}: {
		content: Content;
		onUpdate: (model: TiptapViewModel) => void;
		showMenuBar?: boolean;
		class?: ClassValue;
	} = $props();

	let element = $state<HTMLDivElement>();

	let model = $state<TiptapViewModel>();

	onMount(() => {
		model = new TiptapViewModel(element!, content, onUpdate);
		return () => {
			model?.destroy();
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={[classValue]} onclick={() => model!.editor.commands.focus()}>
	{#if model != null}
		{#if showMenuBar}
			<TiptapMenu {model} class="" />
		{/if}
		<BubbleMenuCgpt
			{model}
			shouldShow={({ editor }) => editor.state.selection.from !== editor.state.selection.to}
		/>
	{/if}

	<div bind:this={element} class="h-full px-4 pt-4 pb-8"></div>
</div>

<style>
</style>
