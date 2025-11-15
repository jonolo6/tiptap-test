<script lang="ts">
	import { Flag } from '@lucide/svelte';

	import { getAppModel } from '$lib/AppModel.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

	const appModel = getAppModel();
	const allTodos = $derived(appModel.getAllTodos());
</script>

<div class={['mt-6 min-h-20 px-4']}>
	<h3 class="mb-2 flex justify-between text-lg font-semibold">
		<div>
			All Tasks ({allTodos.length})
		</div>
		<div class="text-sm font-normal">Sort</div>
	</h3>
	{#if allTodos.length > 0}
		<ul class="space-y-3">
			{#each allTodos as todo}
				<li class="grid grid-cols-[auto_auto_minmax(0,1fr)] items-start gap-2">
					<div class="flex items-start pt-0.5">
						<Checkbox
							checked={todo.checked}
							onCheckedChange={() => appModel.toggleTodoChecked(todo.id)}
							aria-label="Toggle task completion"
						/>
					</div>
					<div class="flex items-start pt-0.5">
						<button
							class={[
								'mx-0.5 inline-flex items-center justify-center transition-all hover:scale-110 active:scale-95',
								todo.flagged
									? ' class:text-blue-500 dark:text-blue-400'
									: 'text-slate-600 opacity-60 dark:text-slate-400',
							]}
							onclick={() => appModel.toggleTodoFlag(todo.id)}
							title={todo.flagged ? 'Remove flag' : 'Add flag'}
						>
							<Flag size={16} fill={todo.flagged ? 'currentColor' : 'none'} />
						</button>
					</div>
					<div>
						<div class="text-sm" class:line-through={todo.checked} class:opacity-60={todo.checked}>
							{todo.title}
						</div>
						<div class="flex gap-2 text-xs text-muted-foreground">
							<span>{appModel.getNoteTitle(todo.noteId) || `Note: ${todo.noteId}`}</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-muted-foreground">No tasks yet. Add a task list in the editor!</p>
	{/if}
</div>
