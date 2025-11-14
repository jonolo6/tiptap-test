<script lang="ts">
	import { getAppModel } from '$lib/AppModel.svelte';

	const appModel = getAppModel();
	const allTodos = $derived(appModel.getAllTodos());
</script>

<div class={['mt-6 min-h-20 px-4']}>
	<h3 class="mb-2 text-lg font-semibold">All Tasks ({allTodos.length})</h3>
	{#if allTodos.length > 0}
		<ul class="space-y-3">
			{#each allTodos as todo}
				<li class="flex items-start gap-2">
					<button class="mt-0.5" onclick={() => appModel.toggleTodoFlag(todo.id)}>
						{todo.flagged ? '🚩' : '⚪'}
					</button>
					<div class="flex-1">
						<div class="text-sm">{todo.title}</div>
						<div class="flex gap-2 text-xs text-muted-foreground">
							<span>{appModel.getNoteTitle(todo.noteId) || `Note: ${todo.noteId}`}</span>
							<span>•</span>
							<span>Line {todo.lineNumber}</span>
							<span>•</span>
							<span>Id {todo.id}</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-muted-foreground">No tasks yet. Add a task list in the editor!</p>
	{/if}
</div>
