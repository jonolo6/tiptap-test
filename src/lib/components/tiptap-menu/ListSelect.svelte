<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import { Select } from 'bits-ui';

	import type { BubbleMenuModel } from './BubbleMenuModel.svelte';

	type Props = {
		model: BubbleMenuModel;
	};

	let { model }: Props = $props();

	const key = 'list';
	const editor = $derived(model.editor);
	const options = [
		{
			value: 'bulletList',
			label: 'Bullet List',
			toggle: () => editor.chain().focus().toggleBulletList().run(),
			Icon: List,
			isActive: () => editor.isActive('bulletList'),
		},
		{
			value: 'orderedList',
			label: 'Ordered List',
			toggle: () => editor.chain().focus().toggleOrderedList().run(),
			Icon: ListOrdered,
			isActive: () => editor.isActive('orderedList'),
		},
		{
			value: 'taskList',
			label: 'Todo List',
			toggle: () => editor.chain().focus().toggleTaskList().run(),
			Icon: ListTodo,
			isActive: () => editor.isActive('taskList'),
		},
	];

	const isDeselected = $derived(model.list == 'none' || model.list == null);
	const TriggerContent = $derived(options.find((f) => f.value === model.list)?.Icon ?? List);
	const size = 'size-4';

	function setValue(newValue: string) {
		console.log({ newValue });
		switch (newValue) {
			case undefined:
			case 'none':
			case null:
			case '': {
				editor.chain().focus().setParagraph().run();
				break;
			}
			default: {
				const value = options.find(({ value }) => value === newValue);
				if (!value) throw new Error(`cannot handle '${newValue}'`);
				value.toggle();
			}
		}
	}
</script>

<Select.Root
	type="single"
	name="paragraph"
	bind:open={() => model.openDropdown === key, (open) => (model.openDropdown = open ? key : null)}
	bind:value={() => model.list, setValue}
	allowDeselect
>
	<Select.Trigger
		class={[
			'm-0 flex items-center gap-0 rounded-sm border-0 p-1 hover:bg-muted',
			!isDeselected ? 'text-purple-500 dark:text-purple-400' : '',
		]}
		onmouseenter={() => (model.openDropdown = 'list')}
		onmouseleave={() => (model.openDropdown = null)}
	>
		{#if isDeselected}
			<List class={[size]} />
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
			onmouseenter={() => (model.openDropdown = 'list')}
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
							model.list === heading.value ? 'is-active' : '',
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
