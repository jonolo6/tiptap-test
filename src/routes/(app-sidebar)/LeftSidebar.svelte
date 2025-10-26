<script lang="ts" module>
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import {
		Content,
		Group,
		GroupContent,
		GroupLabel,
		Menu,
		Rail,
		Root
	} from '$lib/components/ui/sidebar';

	import { ChevronRightIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';
	import NoteMenuItem from './NoteMenuItem.svelte';
	import { left_sidebar_data, type NavGroup } from './test-data';

	type Props = { data?: { navMain: NavGroup[] } };

	let {
		data = left_sidebar_data,
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Root> & Props = $props();
</script>

<Root {...restProps} bind:ref>
	<!-- <Header> -->
	<!-- 	<!-- <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} /> -->
	<!-- 	<!-- <SearchForm /> -->
	<!-- </Header> -->
	<Content>
		{#each data.navMain as group (group.title)}
			<Collapsible.Root title={group.title} open class="group/collapsible">
				<Group>
					{#if group.title != null}
						<GroupLabel>
							{#snippet child({ props })}
								<Collapsible.Trigger {...props}>
									{group.title}
									<ChevronRightIcon
										class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
									/>
								</Collapsible.Trigger>
							{/snippet}
						</GroupLabel>
					{/if}
					<Collapsible.Content>
						<GroupContent>
							<Menu>
								{#each group.items as item (item.title)}
									<NoteMenuItem {item} />
								{/each}
							</Menu>
						</GroupContent>
					</Collapsible.Content>
				</Group>
			</Collapsible.Root>
		{/each}
	</Content>
	<Rail />
</Root>
