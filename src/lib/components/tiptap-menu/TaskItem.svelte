<script lang="ts">
	import FlagIcon from '@lucide/svelte/icons/flag';

	let {
		flagged = false,
		checked = false,
		onclick,
		onchecked,
	}: {
		flagged?: boolean;
		checked?: boolean;
		onclick?: (e: MouseEvent) => void;
		onchecked?: (checked: boolean) => void;
	} = $props();

	export function updateFlagged(value: boolean) {
		flagged = value;
	}
	export function updateChecked(value: boolean) {
		checked = value;
	}
</script>

<div class="flex items-center gap-x-1">
	<input
		class="mx-0.5 size-[11px] appearance-none rounded border border-slate-500 checked:border-blue-500 checked:bg-blue-500"
		type="checkbox"
		{checked}
		onchange={(e) => onchecked?.((e.target as HTMLInputElement).checked)}
	/>
	<button
		class="task-flag-button size-3.5"
		class:task-flag-button--flagged={flagged}
		contenteditable="false"
		title={flagged ? 'Remove flag' : 'Add flag'}
		aria-label={flagged ? 'Remove flag' : 'Add flag'}
		{onclick}
	>
		<FlagIcon fill={flagged ? 'currentColor' : 'none'} />
	</button>
	<div contenteditable></div>
</div>
