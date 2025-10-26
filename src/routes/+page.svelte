<script lang="ts">
	import Tiptap from '$lib/Tiptap.svelte';
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

	let content = $state<Content | null>();

	onMount(() => {
		const temp = localStorage.getItem('tiptapContent');
		content = temp ? JSON.parse(temp) : '';
		console.log({ content });
	});

	function saveContent(content: any) {
		console.log('saving', { content });
		localStorage.setItem('tiptapContent', JSON.stringify(content));
	}
</script>

<main>
	{#if content != null}
		<Tiptap {content} onUpdate={(m) => saveContent(m.editor.getJSON())} />
	{/if}
</main>
