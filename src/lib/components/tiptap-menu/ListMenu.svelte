<script lang="ts">
	import { ChevronDown, ListIcon, ListOrderedIcon, ListTodoIcon } from '@lucide/svelte/icons';

	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import type { TiptapViewModel } from './TipTapViewModel.svelte';

	type Type = 'none' | 'heading1' | 'heading2';
	type Props = {
		model: TiptapViewModel;
	};

	let { model }: Props = $props();

	const listOptions = [
		{
			value: 'bulletList',
			label: 'Bullet List',
			Icon: ListIcon
		},
		{
			value: 'orderedList',
			label: 'Ordered List',
			Icon: ListOrderedIcon
		},
		{
			value: 'taskList',
			label: 'Todo List',
			Icon: ListTodoIcon
		}
	];

	let type = $derived<Type>(model.list as Type);

	const isDeselected = $derived(type == 'none');
	const isSelected = $derived(!isDeselected);
	const TriggerContent = $derived(listOptions.find((f) => f.value === type)?.Icon);
</script>

<Menubar.Menu>
	<Menubar.Trigger class={[isSelected && 'bg-accent']}>
		{#if isDeselected}
			<ListIcon class="size-4.5" />
		{:else}
			<TriggerContent class={'size-4.5 '} />
		{/if}
		<ChevronDown class={['ml-1.5 size-2.5 text-muted-foreground']} />
	</Menubar.Trigger>
	<Menubar.Content>
		{#each listOptions as option (option.value)}
			<Menubar.CheckboxItem
				class={[type === option.value && 'bg-accent']}
				bind:checked={
					() => {
						return type === (option.value as Type);
					},
					(_newValue) => {
						model.setList(option.value);
					}
				}
			>
				{#snippet child({ checked })}
					<div class={['flex items-center', false && 'text-foreground/50']}>
						<option.Icon />
						<span class="ml-1.5">
							{option.label}
						</span>
					</div>
				{/snippet}
			</Menubar.CheckboxItem>
		{/each}
	</Menubar.Content>
</Menubar.Menu>
