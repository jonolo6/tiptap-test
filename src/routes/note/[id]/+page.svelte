<script lang="ts">
	import { page } from '$app/state';
	import { getNoteById } from '$lib/db/remote/notes.remote';
	import NoteMenuItem from '../../(app-sidebar)/NoteMenuItem.svelte';

	const id = $derived(page.params['id']);
	const note = $derived(id ? await getNoteById(id) : null);
</script>

Note!
<div>{id}</div>

<div class="flex">
	<span> note: </span>
	<pre>{JSON.stringify(note)}</pre>
</div>

{#if note != null}
	<NoteMenuItem {note} />
{/if}
