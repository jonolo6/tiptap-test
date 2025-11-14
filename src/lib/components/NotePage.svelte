<script lang="ts">
	import type { Content } from '@tiptap/core';
	import type { ClassValue } from 'svelte/elements';

	import Tiptap from '$lib/components/tiptap-menu/Tiptap.svelte';
	import { Badge, badgeVariants } from '$lib/components/ui/badge';
	import { getNoteById, updateNoteContent, updateNoteTitle } from '$lib/db/remote/notes.remote';
	import { page } from '$app/state';
	import { getAppModel } from '$lib/AppModel.svelte';
	import TaskList from './TaskList.svelte';

	let { id, class: className = '' }: { id: string; class?: ClassValue } = $props();

	const appModel = getAppModel();
	const note = $derived(getNoteById(id));
	const newLineRegex = /^[\n\r]$/;

	// Update note title in AppModel when it changes
	$effect(() => {
		if (note != null) {
			note.then((n) => {
				if (n?.title) {
					appModel.setNoteTitle(id, n.title);
				}
			});
		}
	});

	let hideNotes = $state(false);

	function saveContent(content: any) {
		if (id == null) throw new Error('need id!');
		updateNoteContent({ id, content });
	}

	function setTitle(newTitle: string) {
		updateNoteTitle({ id, title: newTitle });
		title = newTitle; // optimistic updating...
	}

	function clearNewlineForPlaceholder(e: InputEvent) {
		const target = e.target as HTMLElement;
		if (newLineRegex.test(target.innerText)) {
			target.innerText = '';
		}
	}

	let title = $derived(note != null ? (await note).title : '');
</script>

<main class={['p2-4 px-4', className]}>
	<div
		class={[
			'grid h-full grid-cols-1 grid-rows-[auto_auto_minmax(40px,1fr)_auto_minmax(0px,1fr)]',
			false && 'border border-green-500',
		]}
	>
		<div
			class="px-4 text-2xl font-bold focus:outline-none"
			contenteditable
			data-placeholder="Title..."
			oninput={clearNewlineForPlaceholder}
			bind:innerText={
				() => {
					// on first view - updates handled by onInput...
					if (newLineRegex.test(title)) {
						return '';
					}
					return title;
				},
				(_v) => setTitle(_v)
			}
		></div>
		<div class="mt-2 px-4 text-sm">
			<Badge
				variant="secondary"
				class="rounded- bg-fuchsia-200 px-1.5 py-[1px] text-fuchsia-950 shadow dark:bg-fuchsia-600 dark:text-fuchsia-100"
			>
				Project
			</Badge>
		</div>
		<!-- <Separator /> -->
		<div class={['mt-1', false && 'border border-red-500']}>
			<!-- <Toggle class="absolute top-0 right-0" size="sm" bind:pressed={hideNotes}> -->
			<!-- 	<ChevronDownIcon class={['transition-all', hideNotes ? '-rotate-90' : '']} /> -->
			<!-- </Toggle> -->
			{#if !hideNotes}
				{#key id}
					{#await note then note}
						{#if note != null}
							<Tiptap
								class={['h-full', false && 'border border-red-500']}
								content={note.content as Content}
								onUpdate={(m) => saveContent(m.editor.getJSON())}
								showMenuBar={false}
								{appModel}
								noteId={id}
							/>
						{/if}
					{/await}
				{/key}
			{/if}
		</div>
		<div class="px-4">
			<Badge>All</Badge>
			<a href="/dashboard" class={badgeVariants({ variant: 'secondary' })}>Main</a>
			<Badge variant="outline">...</Badge>
		</div>
		<TaskList />
		<!-- <div> -->
		<!-- 	<pre class="text-sm">{JSON.stringify(page, null, 2)}</pre> -->
		<!-- </div> -->
	</div>
</main>

<style>
	@reference 'tailwindcss';

	[data-placeholder]:empty::before {
		content: attr(data-placeholder);
		color: var(--color-slate-500);
		pointer-events: none; /* Prevents the placeholder from being selectable */
		display: block; /* Ensures proper display */
	}
</style>
