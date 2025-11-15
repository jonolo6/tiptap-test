<script lang="ts">
	import FlagIcon from '@lucide/svelte/icons/flag';

	let {
		flagged = $bindable(false),
		onclick,
	}: { flagged?: boolean; onclick?: (e: MouseEvent) => void } = $props();

	export function updateFlagged(value: boolean) {
		flagged = value;
	}
</script>

<!-- /* &.task-flag-button--flagged { */ -->
<!-- /* 	@apply text-blue-500 dark:text-blue-400; */ -->
<!-- /**/ -->

<button
	class={`task-flag-button flex cursor-pointer items-center justify-center 
  pr-0.5 text-slate-600 select-none dark:text-slate-400 [.flagged]:text-blue-500`}
	class:flagged
	contenteditable="false"
	title={flagged ? 'Remove flag' : 'Add flag'}
	aria-label={flagged ? 'Remove flag' : 'Add flag'}
	{onclick}
>
	<FlagIcon size={14} fill={flagged ? 'currentColor' : 'none'} />
</button>
