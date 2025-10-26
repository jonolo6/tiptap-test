<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import { StarterKit } from '@tiptap/starter-kit';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import TiptapMenu from './TiptapMenu.svelte';

	let {
		content = `
        <h1>Hello Svelte! 🌍️ </h1>
        <p>This editor is running in Svelte.</p>
        <p>Select some text to see the bubble menu popping up.</p>
      `
	} = $props();

	let bubbleMenu = $state<HTMLDivElement>();
	let element = $state<HTMLDivElement>();
	let editor = $state<Editor>();

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				BubbleMenu.configure({
					element: bubbleMenu
				})
			],
			content,
			onTransaction: ({ editor: _editor }) => {
				// Increment the state signal to force a re-render
				editor = _editor;
			}
		});
	});
	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div style="position: relative" class="app">
	{#if editor}
		<TiptapMenu {editor} />
	{/if}

	<div bind:this={element}></div>
</div>

<style>
</style>
