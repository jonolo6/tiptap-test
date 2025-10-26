<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import { Editor } from '@tiptap/core';
	import { Select } from 'bits-ui';
	import { onMount } from 'svelte';

	type Type = 'none' | 'bullet' | 'ordered' | 'todos';
	type Props = {
		editor: Editor;
	};

	const options = [
		{
			value: 'bullet',
			label: 'Bullet List',
			Icon: List,
			isActive: () => editor.isActive('bulletList')
		},
		{
			value: 'ordered',
			label: 'Ordered List',
			Icon: ListOrdered,
			isActive: () => editor.isActive('orderedList')
		},
		{
			value: 'todos',
			label: 'Todo List',
			Icon: ListTodo,
			isActive: () => editor.isActive('todosList')
		}
	];

	let { editor }: Props = $props();

	let type = $state<Type>('none');
	let open = $state(false);

	onMount(() => {
		editor.on('selectionUpdate', onEditorUpdate);
		editor.on('update', onEditorUpdate);
		editor.on('transaction', onEditorUpdate);

		return () => {
			editor.off('selectionUpdate', onEditorUpdate);
			editor.off('update', onEditorUpdate);
			editor.off('transaction', onEditorUpdate);
		};
	});

	function onEditorUpdate() {
		type = 'none';
		options.forEach((h) => {
			if (h.isActive()) {
				type = h.value as Type;
			}
		});
	}

	function setValue(newValue: string) {
		switch (newValue) {
			case undefined:
			case null: {
				editor.chain().focus().toggleBulletList().run();
				break;
			}
			case '':
				open = false;
				editor.chain().focus().toggleBulletList().run();
				editor.chain().focus().toggleBulletList().run();
				break;
			case 'bullet': {
				editor.chain().focus().toggleBulletList().run();
				break;
			}
			case 'todos': {
				editor.chain().focus().toggleTaskList().run();
				break;
			}
			case 'ordered': {
				editor.chain().focus().toggleOrderedList().run();
				break;
			}
			default:
				throw new Error(`cannot handle '${type}'`);
		}
	}

	const isDeselected = $derived(type == 'none');
	const TriggerContent = $derived(options.find((f) => f.value === type)?.Icon);
</script>

<Select.Root
	type="single"
	name="paragraph"
	bind:open={() => open, (_open) => (open = _open)}
	bind:value={() => type, setValue}
	allowDeselect
>
	<Select.Trigger
		class={[
			'm-0 flex h-5.5 items-center gap-0 rounded-sm border-0 p-1',
			!isDeselected ? 'text-purple-500' : 'text-slate-500'
		]}
	>
		{#if isDeselected}
			<List class={[' size-4.5']} />
		{:else}
			<TriggerContent class={['size-4.5 ']} />
		{/if}
		<ChevronDown class={['ml-0.5 size-2.5']} />
	</Select.Trigger>

	<Select.Portal>
		<Select.Content
			class={`focus-override z-50 rounded-xl border 
      border-slate-100  bg-background px-0.5 py-2
      shadow-popover outline-hidden select-none data-[side=bottom]:translate-y-1
      data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 
      data-[side=left]:slide-in-from-right-2 data-[side=right]:translate-x-1 
      data-[side=right]:slide-in-from-left-2 data-[side=top]:-translate-y-1 
      data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out 
      data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in 
      data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:bg-slate-900`}
			align="start"
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
               dark:data-selected:text-purple-400 dark:data-[selected]:bg-secondary
               `,
							type === heading.value ? 'is-active' : ''
						]}
					>
						<heading.Icon class="size-5 shrink-0 grow-0" />
						{heading.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Portal>
</Select.Root>
