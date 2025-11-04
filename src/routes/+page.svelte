<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

	import Tiptap from '$lib/components/tiptap-menu/Tiptap.svelte';
	import { Badge, badgeVariants } from '$lib/components/ui/badge';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';

	let content = $state<Content | null>();
	let hideNotes = $state(false);

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

<main class="px-4">
	{#if content != null}
		<div
			class={[
				'grid h-full grid-cols-1 grid-rows-[auto_auto_minmax(40px,1fr)_auto_minmax(0px,1fr)]',
				false && 'border border-green-500',
			]}
		>
			<div class="px-4 text-2xl font-bold">Heading...</div>
			<div class="mt-2 px-4 text-sm">
				<Badge variant="secondary" class="bg-blue-500 shadow dark:bg-blue-700 dark:text-blue-200">
					Project
				</Badge>
			</div>
			<!-- <Separator /> -->
			<div class={['mt-1', false && 'border border-red-500']}>
				<!-- <Toggle class="absolute top-0 right-0" size="sm" bind:pressed={hideNotes}> -->
				<!-- 	<ChevronDownIcon class={['transition-all', hideNotes ? '-rotate-90' : '']} /> -->
				<!-- </Toggle> -->
				{#if !hideNotes}
					<Tiptap
						class={['h-full', false && 'border border-red-500']}
						{content}
						onUpdate={(m) => saveContent(m.editor.getJSON())}
						showMenuBar={false}
					/>
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
