<script lang="ts">
	// import { Toggle } from 'bits-ui';
	import type { ClassValue } from 'svelte/elements';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import {
		BoldIcon,
		Heading1Icon,
		Heading2Icon,
		ItalicIcon,
		StrikethroughIcon
	} from '@lucide/svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import type { TiptapViewModel } from './TipTapViewModel.svelte';
	import HeadingMenu from './HeadingMenu.svelte';
	import ListMenu from './ListMenu.svelte';

	let { model, class: classValue }: { model: TiptapViewModel; class?: ClassValue } = $props();

	const editor = $derived(model.editor);

	// TODO: Fix the headings here...
	const headings = [
		{
			Icon: Heading1Icon,
			key: 'heading-1',
			can: () => editor.can().toggleHeading({ level: 1 }),
			active: () => editor.isActive('heading', { level: 1 }),
			do: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
		},
		{
			Icon: Heading2Icon,
			key: 'heading-2',
			can: () => editor.can().toggleHeading({ level: 2 }),
			active: () => editor.isActive('heading', { level: 2 }),
			do: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
		}
	];
	let _state = $state({}) as Record<string, { active: boolean; can: boolean }>;
</script>

<Menubar.Root class={[classValue]}>
	<HeadingMenu {model} />
	<ListMenu {model} />
	<!-- <Separator orientation="vertical" class="mx-2" /> -->
	<Toggle
		size="sm"
		class="ml-4 p-0"
		bind:pressed={
			() => model.active['bold'] ?? false, () => editor.chain().focus().toggleBold().run()
		}
	>
		<BoldIcon class="size-4" />
	</Toggle>

	<Toggle
		size="sm"
		class="p-0"
		bind:pressed={
			() => model.active['italic'] ?? false, () => editor.chain().focus().toggleItalic().run()
		}
	>
		<ItalicIcon class="size-4" />
	</Toggle>
	<Toggle
		size="sm"
		class="p-0"
		bind:pressed={
			() => model.active['strike'] ?? false, () => editor.chain().focus().toggleStrike().run()
		}
	>
		<StrikethroughIcon class="size-4" />
	</Toggle>

	<!-- <Menubar.Menu> -->
	<!-- 	<Menubar.Trigger>Edit</Menubar.Trigger> -->
	<!-- 	<Menubar.Content> -->
	<!-- 		<Menubar.Item> -->
	<!-- 			Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut> -->
	<!-- 		</Menubar.Item> -->
	<!-- 		<Menubar.Item> -->
	<!-- 			Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut> -->
	<!-- 		</Menubar.Item> -->
	<!-- 		<Menubar.Separator /> -->
	<!-- 		<Menubar.Sub> -->
	<!-- 			<Menubar.SubTrigger>Find</Menubar.SubTrigger> -->
	<!-- 			<Menubar.SubContent> -->
	<!-- 				<Menubar.Item>Search the web</Menubar.Item> -->
	<!-- 				<Menubar.Separator /> -->
	<!-- 				<Menubar.Item>Find...</Menubar.Item> -->
	<!-- 				<Menubar.Item>Find Next</Menubar.Item> -->
	<!-- 				<Menubar.Item>Find Previous</Menubar.Item> -->
	<!-- 			</Menubar.SubContent> -->
	<!-- 		</Menubar.Sub> -->
	<!-- 		<Menubar.Separator /> -->
	<!-- 		<Menubar.Item>Cut</Menubar.Item> -->
	<!-- 		<Menubar.Item>Copy</Menubar.Item> -->
	<!-- 		<Menubar.Item>Paste</Menubar.Item> -->
	<!-- 	</Menubar.Content> -->
	<!-- </Menubar.Menu> -->
</Menubar.Root>

<!-- 		<Toggle -->
<!-- 			size="sm" -->
<!-- 			class="p-0" -->
<!-- 			bind:pressed={ -->
<!-- 				() => model.active['strike'] ?? false, -->
<!-- 				() => { -->
<!-- 					editor.chain().focus().toggleStrike().run(); -->
<!-- 				} -->
<!-- 			} -->
<!-- 		> -->
<!-- 			<StrikethroughIcon class="size-4" /> -->
<!-- 		</Toggle> -->
<!-- 	</div> -->
<!-- </div> -->

<style>
	@reference "tailwindcss";
</style>
