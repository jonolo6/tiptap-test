<script lang="ts">
	import {
		ChevronDown,
		Heading1Icon,
		Heading2Icon,
		Heading3Icon,
		HeadingIcon,
	} from '@lucide/svelte/icons';

	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import type { TiptapViewModel } from './TipTapViewModel.svelte';

	type Type = 'none' | 'heading1' | 'heading2';
	type Props = {
		model: TiptapViewModel;
	};

	let { model }: Props = $props();

	const headingOptions = [
		{
			value: 'heading1',
			label: 'Heading One',
			Icon: Heading1Icon,
		},
		{
			value: 'heading2',
			label: 'Heading Two',
			Icon: Heading2Icon,
		},
		{
			value: 'heading3',
			label: 'Heading Three',
			Icon: Heading3Icon,
		},
	];

	let type = $derived<Type>(model.heading as Type);

	const isDeselected = $derived(type == 'none');
	const isSelected = $derived(!isDeselected);
	const TriggerContent = $derived(headingOptions.find((f) => f.value === type)?.Icon);
</script>

<Menubar.Menu>
	<Menubar.Trigger class={[isSelected && 'bg-accent']}>
		{#if isDeselected}
			<HeadingIcon class="size-4.5" />
		{:else}
			<TriggerContent class={'size-4.5 '} />
		{/if}
		<ChevronDown class={['ml-1 size-2.5 text-muted-foreground']} />
	</Menubar.Trigger>
	<Menubar.Content>
		{#each headingOptions as option (option.value)}
			<Menubar.CheckboxItem
				class={[type === option.value && 'bg-accent']}
				bind:checked={
					() => type === (option.value as Type), (_newValue) => model.setHeading(option.value)
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
