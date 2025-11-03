<script lang="ts">
	// BubbleMenu.svelte — Svelte 5 rune variant
	import { BoldIcon, ItalicIcon, StrikethroughIcon } from '@lucide/svelte';
	import type { Editor } from '@tiptap/core';
	import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
	import type { PluginKey } from '@tiptap/pm/state';
	import { onMount, type Component } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import { FORMAT_STATES, type TiptapViewModel } from './TipTapViewModel.svelte';

	type Props = {
		model: TiptapViewModel;
		pluginKey?: string | PluginKey;
		shouldShow?: (args: {
			editor: Editor;
			view: any;
			state: any;
			oldState?: any;
			from: number;
			to: number;
		}) => boolean;
		// tippyOptions?: Partial<TippyProps>;
		updateDelay?: number;
		class?: ClassValue;
		style?: string;
		// children?: Snippet;
	};

	let {
		model,
		pluginKey = 'bubbleMenu',
		shouldShow,
		// tippyOptions = {} as Partial<TippyProps>,
		updateDelay = 0,
		class: className = '',
		style = '',
		// children,
	}: Props = $props();

	const editor = $derived(model.editor);

	let root = $state<HTMLDivElement | null>(null);
	let registeredWith: Editor | null = null;

	onMount(() => {
		if (registeredWith && registeredWith !== editor) {
			try {
				registeredWith.unregisterPlugin(pluginKey as any);
			} catch {
				/* no-op */
			}
			registeredWith = null;
		}

		editor.registerPlugin(
			BubbleMenuPlugin({
				pluginKey: pluginKey as any,
				editor,
				element: root as HTMLElement,
				// tippyOptions,
				updateDelay,
				shouldShow: shouldShow ?? undefined,
			})
		);
		registeredWith = editor;

		return () => {
			try {
				editor.unregisterPlugin(pluginKey as any);
			} catch {
				/* no-op */
			}
			if (registeredWith === editor) {
				registeredWith = null;
			}
		};
	});

	// const values = $derived(
	// 	Object.entries(model.active)
	// 		.filter(([_, value]) => value)
	// 		.map(([key]) => key)
	// );
	// function setValues(newValues: string[]) {
	// 	console.log({ newValues });
	//
	// 	const toSet = newValues.filter((newVal) => !values.includes(newVal));
	// 	const toUnset = values.filter((oldVal) => !newValues.includes(oldVal));
	// 	toSet.forEach((val) => {
	// 		FORMAT_STATES.find(({ key }) => val === key)!.toggle(editor);
	// 	});
	// 	toUnset.forEach((val) => {
	// 		FORMAT_STATES.find(({ key }) => val === key)!.toggle(editor);
	// 	});
	// }
</script>

{#snippet FormatToggle({
	Icon,
	format,
	toggle,
}: {
	Icon: Component;
	format: string;
	toggle: () => void;
})}
	<Toggle
		size="sm"
		variant="default"
		class="p-0"
		bind:pressed={() => model.active[format] ?? false, () => toggle()}
	>
		<Icon class="size-3.5" />
	</Toggle>
{/snippet}

{#if editor != null}
	<div
		bind:this={root}
		class={['flex rounded-lg bg-slate-900 text-sm shadow', true && 'p-1', className]}
		{style}
		style:visibility="hidden"
		style:position="absolute"
		style:top="0"
		style:left="0"
	>
		<!-- <ToggleGroup.Root variant="outline" type="multiple" bind:value={() => values, setValues}> -->
		<!-- 	<ToggleGroup.Item value="bold" aria-label="Toggle Bold"> -->
		<!-- 		<BoldIcon class="size-3.5" /> -->
		<!-- 	</ToggleGroup.Item> -->
		<!-- 	<ToggleGroup.Item value="italic" aria-label="Toggle Italic"> -->
		<!-- 		<ItalicIcon class="size-3.5" /> -->
		<!-- 	</ToggleGroup.Item> -->
		<!-- 	<ToggleGroup.Item value="strike" aria-label="Toggle Strike"> -->
		<!-- 		<StrikethroughIcon class="size-3.5" /> -->
		<!-- 	</ToggleGroup.Item> -->
		<!-- </ToggleGroup.Root> -->
		<!---->
		{@render FormatToggle({
			Icon: BoldIcon,
			format: 'bold',
			toggle: () => editor.chain().focus().toggleBold().run(),
		})}
		{@render FormatToggle({
			Icon: ItalicIcon,
			format: 'italic',
			toggle: () => editor.chain().focus().toggleItalic().run(),
		})}
		{@render FormatToggle({
			Icon: StrikethroughIcon,
			format: 'strike',
			toggle: () => editor.chain().focus().toggleStrike().run(),
		})}
	</div>
{/if}

<style>
	@reference "tailwindcss";

	.selected {
		@apply text-purple-500;
	}
</style>
