<script lang="ts" module>
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import { ChevronRightIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';
	import NoteMenuItem from './NoteMenuItem.svelte';
	import { left_sidebar_data, type NavGroup } from './test-data';
	import DarkSwitchMenu from '$lib/components/ui/DarkSwitchMenu.svelte';

	type Props = { data?: { navMain: NavGroup[] } };

	let {
		data = left_sidebar_data,
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & Props = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<!-- <Header> -->
	<!-- 	<!-- <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} /> -->
	<!-- 	<!-- <SearchForm /> -->
	<!-- </Header> -->
	<Sidebar.Content>
		{#each data.navMain as group (group.title)}
			<Collapsible.Root title={group.title} open class="group/collapsible">
				<Sidebar.Group>
					{#if group.title != null}
						<Sidebar.GroupLabel>
							{#snippet child({ props })}
								<Collapsible.Trigger {...props}>
									{group.title}
									<ChevronRightIcon
										class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
									/>
								</Collapsible.Trigger>
							{/snippet}
						</Sidebar.GroupLabel>
					{/if}
					<Collapsible.Content>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each group.items as item (item.title)}
									<NoteMenuItem {item} />
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Collapsible.Content>
				</Sidebar.Group>
			</Collapsible.Root>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<DarkSwitchMenu />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
