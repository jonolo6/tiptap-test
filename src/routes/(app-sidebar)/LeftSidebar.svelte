<script lang="ts" module>
</script>

<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar';

	import { ChevronRightIcon, PlusIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';
	import NoteMenuItem from './NoteMenuItem.svelte';
	import { left_sidebar_data, type NavGroup } from './test-data';
	import DarkSwitchMenu from '$lib/components/ui/DarkSwitchMenu.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

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
				<Sidebar.Group class="group/sidebargroup">
					{#if group.title != null}
						<Sidebar.GroupLabel>
							{#snippet child({ props })}
								<Collapsible.Trigger {...props}>
									<span class="grow-1 text-left">
										{group.title}
									</span>
									{#if group.add != null}
										<Button
											variant="ghost"
											size="sm"
											class={[
												'invisible h-5 w-6 p-0 transition-transform group-hover/sidebargroup:visible',
											]}
											onclick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												group.add!();
											}}
										>
											<PlusIcon />
										</Button>
									{/if}

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
					{/if}
					<Collapsible.Content>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each group.items as item (item.title)}
									<NoteMenuItem {item} />
								{/each}
								<!-- <Sidebar.MenuButton -->
								<!-- 	onclick={() => { -->
								<!-- 		console.log({ clicked }); -->
								<!-- 	}} -->
								<!-- > -->
								<!-- 	test -->
								<!-- </Sidebar.MenuButton> -->
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
