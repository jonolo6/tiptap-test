<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte';
	import type { Content } from '@tiptap/core';
	import { onMount } from 'svelte';

	import Tiptap from '$lib/components/tiptap-menu/Tiptap.svelte';
	import { Badge } from '$lib/components/ui/badge';
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
				'grid h-full grid-cols-1 grid-rows-[auto_auto_auto_auto_minmax(40px,1fr)_auto_minmax(40px,1fr)] gap-y-1.5',
				false && 'border border-green-500'
			]}
		>
			<div class="text-lg font-semibold">Heading...</div>
			<Separator />
			<div class="text-sm">Properties</div>
			<Separator />
			<div class={['relative', false && 'my-2 border border-red-500']}>
				<Toggle class="absolute top-0 right-0" size="sm" bind:pressed={hideNotes}>
					<ChevronDownIcon class={['transition-all', hideNotes ? '-rotate-90' : '']} />
				</Toggle>
				{#if !hideNotes}
					<!-- <span class="text-sm text-gray-500"> Notes </span> -->
					<Tiptap {content} onUpdate={(m) => saveContent(m.editor.getJSON())} />
				{/if}
			</div>
			<div>
				<Badge variant="secondary">all</Badge>
			</div>
			<div class={['min-h-20']}>Tasks...</div>
		</div>
	{/if}
</main>
