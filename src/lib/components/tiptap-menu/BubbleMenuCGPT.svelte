<script lang="ts">
	// BubbleMenu.svelte — Svelte 5 rune variant
	import type { Editor } from '@tiptap/core';
	import type { PluginKey } from '@tiptap/pm/state';
	import type { Props as TippyProps } from 'tippy.js';
	import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
	import { onMount, untrack, type Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	/**
	 * Props (Svelte 5 runes)
	 * - editor: required tiptap Editor
	 * - pluginKey: string | PluginKey (default 'bubbleMenu')
	 * - shouldShow: predicate to control visibility (optional)
	 * - tippyOptions: forwarded to tippy instance (optional)
	 * - updateDelay: debounce for selection updates (optional; ms)
	 * - class / style: forwarded to the wrapper element
	 */
	const {
		editor,
		pluginKey = 'bubbleMenu',
		shouldShow = null as
			| ((args: {
					editor: Editor;
					view: any;
					state: any;
					oldState?: any;
					from: number;
					to: number;
			  }) => boolean)
			| null,
		tippyOptions = {} as Partial<TippyProps>,
		updateDelay = 0,
		class: className = '',
		style = '',
		children,
	} = $props<{
		editor: Editor | undefined;
		pluginKey?: string | PluginKey;
		shouldShow?: (args: {
			editor: Editor;
			view: any;
			state: any;
			oldState?: any;
			from: number;
			to: number;
		}) => boolean;
		tippyOptions?: Partial<TippyProps>;
		updateDelay?: number;
		class?: ClassValue;
		style?: string;
		children?: Snippet;
	}>();

	// The DOM element the plugin uses for the menu content
	let root = $state<HTMLDivElement | null>(null);

	// Track which editor instance currently owns our plugin,
	// so we can safely unregister if editor prop changes.
	let registeredWith: Editor | null = null;

	const ready = $derived(Boolean(editor && root));

	// (Re)register the PM plugin whenever editor/root or inputs change
	$effect(() => {
		if (!ready) return;
		console.log('tracking!', { ready });

		untrack(() => {
			console.log('1...');
			if (registeredWith && registeredWith !== editor) {
				try {
					registeredWith.unregisterPlugin(pluginKey as any);
				} catch {
					/* no-op */
				}
				registeredWith = null;
			}

			console.log('registering!');
			// Register on current editor
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

			// Cleanup when any dependency changes / component unmounts
			return () => {
				console.log('cleanup!');
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
	});
</script>

<!--
  We render the menu DOM in-place. The BubbleMenuPlugin detaches this element
  (moves it under tippy) but we keep it as the source of truth for slotted content.
-->
{#if editor != null}
	<div
		bind:this={root}
		class={[className]}
		{style}
		style:visibility="hidden"
		style:position="absolute"
		style:top="0"
		style:left="0"
	>
		<button onclick={() => editor.chain().focus().toggleBold().run()}> bold </button>
		<button onclick={() => editor.chain().focus().toggleItalic().run()}> italic </button>
	</div>
{/if}

<style>
	/* You control visuals. Hidden until the plugin attaches it to tippy. */
</style>
