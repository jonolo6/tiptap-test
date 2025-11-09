<script lang="ts">
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import Tiptap from '$lib/components/tiptap-menu/Tiptap.svelte';
	import { Badge, badgeVariants } from '$lib/components/ui/badge';
	import { page } from '$app/state';
	import { getNoteById, updateNoteContent } from '$lib/db/remote/notes.remote';

	let { id, class: className = '' }: { id: string; class?: ClassValue } = $props();

	// const id = $derived(page.params['id']);
	const note = $derived(id ? await getNoteById(id) : null);
	const content = $derived(note?.content as Content);
	const title = $derived(note?.title as string);

	const hasNoTitle = $derived(title == null || title.length === 0);
	const niceTitle = $derived(hasNoTitle ? 'N/A' : title);

	// let content = $state<Content | null>();
	let hideNotes = $state(false);

	function saveContent(content: any) {
		console.log('saveContent', { id, content });
		if (id == null) throw new Error('need id!');
		updateNoteContent({ id, content });
	}

	function setTitle(newTitle: string) {
		console.log({ newTitle });
		//TODO: Save new title...
	}
</script>

<main class={['p2-4 px-4', className]}>
	{#if content != null}
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
				bind:innerText={() => title, (_v) => setTitle(_v)}
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
						<Tiptap
							class={['h-full', false && 'border border-red-500']}
							{content}
							onUpdate={(m) => saveContent(m.editor.getJSON())}
							showMenuBar={false}
						/>
					{/key}
				{/if}
			</div>
			<div class="px-4">
				<Badge>All</Badge>
				<a href="/dashboard" class={badgeVariants({ variant: 'secondary' })}>Main</a>
				<Badge variant="outline">...</Badge>
			</div>
			<div class={['mt-6 min-h-20 px-4']}>Tasks...</div>
		</div>
	{/if}
</main>

<style>
	@reference 'tailwindcss';

	div[contenteditable]:empty::before {
		content: attr(data-placeholder);
		color: var(--color-slate-500);
		pointer-events: none; /* Prevents the placeholder from being selectable */
		display: block; /* Ensures proper display */
	}
</style>
