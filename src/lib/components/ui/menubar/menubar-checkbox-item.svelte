<script lang="ts">
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import CheckIcon from '@lucide/svelte/icons/check';
	import MinusIcon from '@lucide/svelte/icons/minus';
	import { type WithoutChildrenOrChild } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		checked = $bindable(false),
		indeterminate = $bindable(false),
		children: childrenProp,
		child,
		...restProps
	}: WithoutChildrenOrChild<MenubarPrimitive.CheckboxItemProps> & {
		children?: Snippet;
		child?: Snippet<[{ checked: boolean; indeterminate: boolean }]>;
	} = $props();
</script>

{#snippet internalChild({ checked, indeterminate }: { checked: boolean; indeterminate: boolean })}
	{#if child != null}
		<div class="h-full w-full items-center justify-center">
			{@render child({ checked, indeterminate })}
		</div>
	{:else}
		<span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
			{#if indeterminate}
				<MinusIcon class="size-4" />
			{:else}
				<CheckIcon class={['size-4', !checked && 'text-transparent']} />
			{/if}
		</span>
		{@render childrenProp?.()}
	{/if}
{/snippet}

<MenubarPrimitive.CheckboxItem
	bind:ref
	bind:checked
	bind:indeterminate
	data-slot="menubar-checkbox-item"
	class={[
		"relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className,
		child != null ? 'pl-2' : 'pl-8'
	]}
	{...restProps}
>
	{#snippet children({ checked, indeterminate })}
		{@render internalChild({ checked, indeterminate })}
	{/snippet}
</MenubarPrimitive.CheckboxItem>
