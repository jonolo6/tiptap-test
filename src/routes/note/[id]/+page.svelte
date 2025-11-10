<script lang="ts">
	import { page } from '$app/state';
	import Tiptap from '$lib/components/tiptap-menu/Tiptap.svelte';
	import { getNoteById, updateNoteContent } from '$lib/db/remote/notes.remote';
	import { onMount, untrack, type Component } from 'svelte';
	import NoteMenuItem from '../../(app-sidebar)/NoteMenuItem.svelte';
	import type { Content } from '@tiptap/core';
	import NotePage from '$lib/components/NotePage.svelte';

	const id = $derived(page.params['id']);
	// const note = $derived(id ? await getNoteById(id) : null);
	// const content = $derived(note?.content as Content);

	// function saveContent(content: any) {
	// 	console.log('saveContent', { id, content });
	// 	if (id == null) throw new Error('need id!');
	// 	updateNoteContent({ id, content });
	// }
	//
	// onMount(() => {
	// 	console.log('mounting', { id });
	// });
	// $effect(() => {
	// 	const id = page.params['id'];
	// 	const _command = command;
	// 	console.log({ id });
	// 	untrack(() => {
	// 		model.editor.commands.setContent(_command);
	// 	});
	// });
</script>

{#key id}
	{#if id != null}
		<NotePage {id} />
	{/if}
{/key}
<!-- <div class="flex bg-blue-500"> -->
<!-- 	<span> note: </span> -->
<!-- 	<pre>{JSON.stringify(note)}</pre> -->
<!-- 	<pre>{JSON.stringify(content)}</pre> -->
<!-- </div> -->
<!---->
<!-- {#key id} -->
<!-- 	{#if note != null} -->
<!-- 		<Tiptap -->
<!-- 			class={['h-full', false && 'border border-red-500']} -->
<!-- 			{content} -->
<!-- 			onUpdate={(m) => saveContent(m.editor.getJSON())} -->
<!-- 			showMenuBar={false} -->
<!-- 		/> -->
<!-- 	{/if} -->
<!-- {/key} -->
