<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		open = $bindable(false),
	}: {
		children: Snippet<[{ toggle: () => void; open: boolean }]>;
		open?: boolean;
	} = $props();

	function toggle() {
		open = !open;
	}
</script>

{@render children({ toggle, open })}
<!-- {@render children?.()} -->
<!-- {@render trigger()} -->
<!---->
<!-- {#if showing} -->
<!-- 	{@render content()} -->
<!-- {/if} -->
