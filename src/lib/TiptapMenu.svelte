<script lang="ts">
	import { Editor } from '@tiptap/core';
	// import HeadingOneIcon from '@lucide/svelte/icons/heading-1';
	import { Heading1 } from 'lucide-svelte';
	// import HeadingOneIcon from '@lucide/svelte/icons/heading-1';

	let { editor }: { editor: Editor } = $props();
</script>

<div class="fixed-menu">
	<button
		onclick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		<Heading1 size="18" />
	</button>
	<button
		onclick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		onclick={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
</div>

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
