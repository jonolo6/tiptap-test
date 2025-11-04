<script lang="ts">
	import { BoldIcon, ItalicIcon, StrikethroughIcon } from '@lucide/svelte';
	import type { Editor } from '@tiptap/core';
	import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
	import type { PluginKey } from '@tiptap/pm/state';
	import { onMount, type Component } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import HeadingSelect from './HeadingSelect.svelte';
	import ListSelect from './ListSelect.svelte';
	import { type TiptapViewModel } from './TipTapViewModel.svelte';

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
		// style?: string;
		// children?: Snippet;
	};

	let {
		model,
		pluginKey = 'bubbleMenu',
		shouldShow,
		// tippyOptions = {} as Partial<TippyProps>,
		updateDelay = 0,
		class: className = '',
		// style = '',
		// children,
	}: Props = $props();

	const editor = $derived(model.editor);

	let element = $state<HTMLDivElement>();
	let registeredWith: Editor | null = null;
	let boundary = $derived(element?.parentElement);

	onMount(() => {
		if (registeredWith && registeredWith !== editor) {
			try {
				registeredWith.unregisterPlugin(pluginKey as any);
			} catch {
				/* no-op */
			}
			registeredWith = null;
		}

		if (element == null) throw new Error('element null!');
		if (boundary == null) throw new Error('boundary null!');
		editor.registerPlugin(
			BubbleMenuPlugin({
				pluginKey: pluginKey as any,
				editor,
				element,
				options: {
					flip: { boundary },
					shift: { boundary, padding: 2 },
				},
				// tippyOptions,
				// options: {
				// 	autoPlacement: { alignment: 'start' },
				// },
				updateDelay,
				shouldShow,
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
</script>

{#snippet FormatToggle({
	Icon,
	class: classValue,
	format,
	toggle,
}: {
	class?: ClassValue;
	Icon: Component;
	format: string;
	toggle: () => void;
})}
	<Toggle
		size="sm"
		variant="default"
		bind:pressed={() => model.active[format] ?? false, () => toggle()}
	>
		{#snippet child({ pressed, props })}
			<Icon {...props} class={[classValue, 'm-1 size-4', pressed && 'text-purple-500']} />
		{/snippet}
	</Toggle>
{/snippet}

<div
	bind:this={element}
	class={[
		`flex items-center rounded-lg border-2 border-border bg-background p-1 
       text-sm shadow shadow-popover`,
		className,
	]}
	style:visibility="hidden"
	style:position="absolute"
>
	<HeadingSelect {model} />
	<ListSelect {model} />

	<Separator orientation="vertical" class="mx-1.5 py-2.5" />
	{@render FormatToggle({
		// class: 'ml-4',
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

<style>
	@reference "tailwindcss";

	.selected {
		@apply text-purple-500;
	}
</style>
