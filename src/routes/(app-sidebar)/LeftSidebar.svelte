<script lang="ts" module>
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import DarkSwitchMenu from '$lib/components/ui/DarkSwitchMenu.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getAllNotes, insertNote } from '$lib/db/remote/notes.remote';
	import { ChevronRightIcon, HouseIcon, PlusIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';
	import NoteMenuItem from './NoteMenuItem.svelte';

	type Props = {};

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> & Props =
		$props();

	let notes = $derived(getAllNotes());

	function onClickInsertNote(e: MouseEvent) {
		console.log('Insert Note clicked', { e });
		e.preventDefault();
		e.stopPropagation();

		insertNote('')
			.then((result) => {
				console.log({ result });
			})
			.catch((e) => {
				console.error(e);
			});
	}
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Content>
		<Sidebar.Group class="group/sidebargroup">
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton isActive={true} class={['group/menu-btn']}>
							<HouseIcon /> <a href={'#'}>Home</a>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>

		<Collapsible.Root title={'Notes'} open class="group/collapsible">
			<Sidebar.Group class="group/sidebargroup">
				<Sidebar.GroupLabel>
					{#snippet child({ props })}
						<Collapsible.Trigger {...props}>
							<span class="grow-1 text-left">Notes</span>
							<Button
								variant="ghost"
								size="sm"
								class="invisible h-5 w-6 p-0 transition-transform group-hover/sidebargroup:visible"
								onclick={(e) => onClickInsertNote(e)}
							>
								<PlusIcon />
							</Button>

							<Button variant="ghost" size="sm" class="h-5 w-6 p-0 ">
								<ChevronRightIcon
									class={`invisible ml-auto transition-transform group-hover/sidebargroup:visible 
                      group-data-[state=closed]/collapsible:visible 
                      group-data-[state=open]/collapsible:rotate-90`}
								/>
							</Button>
						</Collapsible.Trigger>
					{/snippet}
				</Sidebar.GroupLabel>
				<Collapsible.Content>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#await notes then notes}
								{#each notes as note (note.id)}
									<NoteMenuItem {note} />
								{/each}
							{/await}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Collapsible.Content>
			</Sidebar.Group>
		</Collapsible.Root>
		<!-- {/each} -->
	</Sidebar.Content>
	<Sidebar.Footer>
		<DarkSwitchMenu />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
