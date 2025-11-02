<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, type Content } from '@tiptap/core';
	import Document from '@tiptap/extension-document';
	import Paragraph from '@tiptap/extension-paragraph';
	import HardBreak from '@tiptap/extension-hard-break';
	import Text from '@tiptap/extension-text';
	import Bold from '@tiptap/extension-bold';
	import Code from '@tiptap/extension-code';
	import Italic from '@tiptap/extension-italic';
	import Strike from '@tiptap/extension-strike';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import Placeholder from '@tiptap/extension-placeholder';
	import BubbleMenu from '@tiptap/extension-bubble-menu';
	import CharacterCount from '@tiptap/extension-character-count';

	type Props = {
		content: Content;
		output: string;
		limit: number;
		bold: boolean;
		italic: boolean;
		strike: boolean;
		underline: boolean;
		link: boolean;
		code: boolean;
		placeholder: string;
		editor: Editor;
	};

	let {
		content = '',
		output = $bindable(),
		limit = 100,

		bold = true,
		italic = true,
		strike = false,
		underline = false,
		link = false,
		code = false,
		placeholder = '',
		editor,
	}: Props = $props();

	let element = $state<HTMLElement>();
	let bmenu = $state<HTMLElement>();

	const CustomBold = Bold.extend({
		renderHTML({ HTMLAttributes }) {
			// Original:
			// return ['strong', HTMLAttributes, 0]
			return ['b', HTMLAttributes, 0];
		},
	});

	const setLink = () => {
		if (editor.isActive('link')) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		const previousUrl = editor.getAttributes('link').href;
		const url = window.prompt('URL', previousUrl);

		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		if (!/^https?:\/\//.test(url)) {
			window.alert('DIRECCIÓN INVÁLIDA!!');
			return;
		}

		// update link
		editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	};

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				Document,
				Paragraph,
				Text,
				//Bold,
				CustomBold,
				Code,
				Italic,
				Strike,
				Underline,
				Link.configure({
					validate: (href) => /^https?:\/\//.test(href),
					HTMLAttributes: { rel: null, target: null },
				}),
				BubbleMenu.configure({
					element: bmenu,
					tippyOptions: { duration: 100, theme: 'local', maxWidth: 450, appendTo: document.body },
				}),
				CharacterCount.configure({
					limit,
				}),
				HardBreak.extend({
					addKeyboardShortcuts() {
						return {
							Enter: () => this.editor.commands.setHardBreak(),
						};
					},
				}).configure({ keepMarks: false }),
				Placeholder.configure({ placeholder }),
			],
			content,
			editorProps: {
				attributes: {
					class: 'border border-gray-300 rounded p-3 outline-none text-base',
				},
			},
			onCreate({ editor }) {
				// The editor is ready.
				const html = editor.getHTML();
				// send the content to an API here
				output = html;
			},
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				// send the content to an API here
				output = html;
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={bmenu}>
	{#if editor}
		{#if bold}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('bold')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleBold().run();
				}}
			>
				Negrita
			</button>
		{/if}

		{#if italic}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('italic')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleItalic().run();
				}}
			>
				Cursiva
			</button>
		{/if}

		{#if strike}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('strike')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleStrike().run();
				}}
			>
				Tachado
			</button>
		{/if}

		{#if underline}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('underline')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleUnderline().run();
				}}
			>
				Subrayado
			</button>
		{/if}

		{#if code}
			<button
				class={[
					'mx-1 px-1 text-sm text-gray-300 hover:text-white',
					editor.isActive('code') ? 'rounded text-white ring ring-gray-100' : '',
				]}
				onclick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleCode().run();
				}}
			>
				Código
			</button>
		{/if}

		{#if link}
			<button
				class="mx-1 px-1 text-sm text-gray-300 hover:text-white {editor.isActive('link')
					? 'rounded text-white ring ring-gray-100'
					: ''}"
				onclick={(e) => {
					e.preventDefault();
					setLink();
				}}
			>
				Link
			</button>
		{/if}
	{/if}
</div>

<div bind:this={element}></div>

{#if editor}
	<div class="text-sm text-gray-500">
		{editor.storage.characterCount.characters({ mode: 'textSize' })}/{limit} caracteres
	</div>
{/if}
