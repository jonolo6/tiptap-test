<script lang="ts">
	import { Toggle, ToggleGroup } from 'bits-ui';
	import {
		BoldIcon,
		Heading1Icon,
		Heading2Icon,
		ItalicIcon,
		StrikethroughIcon
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ListSelect from './tiptap-menu/ListSelect.svelte';
	import type { TiptapViewModel } from './tiptap-menu/TipTapViewModel.svelte';
	import HeadingSelect from './tiptap-menu/HeadingSelect.svelte';

	let { model, class: classValue }: { model: TiptapViewModel; class?: ClassValue } = $props();

	const editor = $derived(model.editor);

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

	onMount(() => {
		editor.on('update', onEditorUpdate);
		return () => {
			editor.off('update', onEditorUpdate);
		};
	});

	function onEditorUpdate() {
		headings.forEach((heading) => {
			_state[heading.key] = { active: heading.active() ?? false, can: heading.can() ?? false };
		});
	}
</script>

<div class={['fixed-menu flex items-center rounded-lg border px-2 py-0.5', classValue]}>
	<HeadingSelect {editor} />

	<Separator orientation="vertical" class="mx-3 py-2.5" />

	<ListSelect {model} />

	<Separator orientation="vertical" class="mx-3 py-2.5" />

	<div class="flex items-center">
		<Toggle.Root
			aria-label="toggle bold"
			value="bold"
			bind:pressed={
				() => model.active['bold'] ?? false,
				() => {
					editor.chain().focus().toggleBold().run();
				}
			}
			class={[
				`bg-background-alt active:bg-dark-10 data-[state=off]:text-foreground-alt 
active:data-[state=on]:bg-dark-10 inline-flex size-7 items-center justify-center rounded 
          transition-all hover:bg-muted active:scale-[0.98] 
          data-[state=on]:bg-muted data-[state=on]:text-foreground`
			]}
		>
			<BoldIcon class="size-4" />
		</Toggle.Root>
		<Toggle.Root
			aria-label="toggle italic"
			value="italic"
			bind:pressed={
				() => model.active['italic'] ?? false,
				() => {
					editor.chain().focus().toggleItalic().run();
				}
			}
			class={`bg-background-alt active:bg-dark-10 data-[state=off]:text-foreground-alt 
active:data-[state=on]:bg-dark-10 inline-flex size-7 items-center justify-center rounded 
transition-all hover:bg-muted active:scale-[0.98] 
data-[state=on]:bg-muted data-[state=on]:text-foreground`}
		>
			<ItalicIcon class="size-4" />
		</Toggle.Root>
		<Toggle.Root
			aria-label="toggle strikethrough"
			value="strikethrough"
			bind:pressed={
				() => model.active['strike'] ?? false,
				() => {
					editor.chain().focus().toggleStrike().run();
				}
			}
			class={`bg-background-alt active:bg-dark-10 data-[state=off]:text-foreground-alt 
active:data-[state=on]:bg-dark-10 inline-flex size-7 items-center justify-center rounded 
transition-all hover:bg-muted active:scale-[0.98] 
data-[state=on]:bg-muted data-[state=on]:text-foreground`}
		>
			<StrikethroughIcon class="size-4" />
		</Toggle.Root>
	</div>
</div>

<style>
	@reference "tailwindcss";
</style>
