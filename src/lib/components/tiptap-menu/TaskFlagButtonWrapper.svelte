<script lang="ts">
	import FlagIcon from '@lucide/svelte/icons/flag';

	let {
		initialFlagged = false,
		onclick,
	}: { initialFlagged?: boolean; onclick?: (e: MouseEvent) => void } = $props();

	let flagged = $state(initialFlagged);

	export function updateFlagged(value: boolean) {
		flagged = value;
	}
</script>

<button
	class="task-flag-button"
	class:task-flag-button--flagged={flagged}
	contenteditable="false"
	title={flagged ? 'Remove flag' : 'Add flag'}
	aria-label={flagged ? 'Remove flag' : 'Add flag'}
	{onclick}
>
	<FlagIcon size={16} fill={flagged ? 'currentColor' : 'none'} />
</button>
