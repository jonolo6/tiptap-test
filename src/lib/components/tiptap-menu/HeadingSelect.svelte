<script lang="ts">
	import {
		ChevronDown,
		Heading1Icon,
		Heading2Icon,
		Heading3Icon,
		HeadingIcon,
	} from '@lucide/svelte/icons';
	import { Select } from 'bits-ui';

	import type { BubbleMenuModel } from './BubbleMenuModel.svelte';

	type Props = {
		model: BubbleMenuModel;
	};

	const options = [
		{
			value: 'heading1',
			label: 'Heading One',
			Icon: Heading1Icon,
			act: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: () => editor.isActive('heading', { level: 1 }),
		},
		{
			value: 'heading2',
			label: 'Heading Two',
			Icon: Heading2Icon,
			act: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: () => editor.isActive('heading', { level: 2 }),
		},
		{
			value: 'heading3',
			label: 'Heading Three',
			Icon: Heading3Icon,
			act: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: () => editor.isActive('heading', { level: 3 }),
		},
	];

	let { model }: Props = $props();

	const editor = $derived(model.editor);
	const isDeselected = $derived(model.heading == 'none');
	const TriggerContent = $derived(options.find((f) => f.value === model.heading)?.Icon);
	const size = 'size-4';

	function setValue(newValue: string) {
		console.log({ newValue });
		switch (newValue) {
			case undefined:
			case null:
			case '':
				editor.chain().focus().setParagraph().run();
				break;
			default:
				const option = options.find((v) => v.value === newValue);
				if (option == null) throw new Error(`cannot handle '${newValue}'`);

				option.act();
		}
	}
</script>

<Select.Root
	type="single"
	name="paragraph"
	bind:open={
		() => model.openDropdown === 'heading', (open) => (model.openDropdown = open ? 'heading' : null)
	}
	bind:value={() => model.heading, setValue}
	allowDeselect
>
	<Select.Trigger
		class={[
			'm-0 flex items-center gap-0 rounded-sm border-0 p-1 hover:bg-muted',
			!isDeselected ? 'text-purple-500 dark:text-purple-400' : '',
		]}
		onmouseenter={() => (model.openDropdown = 'heading')}
		onmouseleave={() => (model.openDropdown = null)}
	>
		{#if isDeselected}
			<HeadingIcon class={[size]} />
		{:else}
			<TriggerContent class={[size]} />
		{/if}
		<ChevronDown class={['ml-0.5 size-2.5']} />
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			class={`focus-override z-50 rounded-lg border 
      border-border bg-background px-0.5 py-2
      shadow-md outline-hidden select-none data-[side=bottom]:translate-y-1
      data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 
      data-[side=left]:slide-in-from-right-2 data-[side=right]:translate-x-1 
      data-[side=right]:slide-in-from-left-2 data-[side=top]:-translate-y-1 
      data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out 
      data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in 
      data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:bg-slate-900`}
			align="start"
			onmouseenter={() => (model.openDropdown = 'heading')}
			onmouseleave={() => (model.openDropdown = null)}
		>
			<Select.Group>
				{#each options as heading (heading.value)}
					<Select.Item
						value={heading.value}
						label={heading.label}
						class={[
							`flex items-center gap-1.5 rounded-sm 
               px-2 py-0.5 text-sm capitalize outline-hidden select-none 
               data-disabled:opacity-50 data-highlighted:bg-muted
               data-selected:text-purple-500 dark:data-selected:text-purple-400 
               dark:data-[selected]:bg-secondary
               `,
							model.heading === heading.value ? 'is-active' : '',
						]}
					>
						<heading.Icon class={[size, 'shrink-0 grow-0']} />
						<span class="ml-1">{heading.label}</span>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Portal>
</Select.Root>
