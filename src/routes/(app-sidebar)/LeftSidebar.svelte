<script lang="ts" module>
	type NavGroup = { title?: string | null; items: NavItem[] };
	type NavItem = { title: string; url: string; isActive?: boolean };

	const data: { navMain: NavGroup[] } = $state({
		navMain: [
			{ items: [{ title: 'Home', url: '#', isActive: true }] },
			{
				title: 'Notes',
				items: [
					{ title: 'Routing', url: '#' },
					{ title: 'Data Fetching', url: '#' },
					{ title: 'Rendering', url: '#' }
				]
			}
		]
	});
</script>

<script lang="ts">
	import {
		Content,
		Group,
		GroupContent,
		GroupLabel,
		Header,
		Menu,
		MenuAction,
		MenuButton,
		MenuItem,
		Rail,
		Root,
		useSidebar
	} from '$lib/components/ui/sidebar';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	import type { ComponentProps } from 'svelte';
	import { ChevronRightIcon } from '@lucide/svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { EllipsisIcon } from '@lucide/svelte';
	import { FolderIcon } from '@lucide/svelte';
	import { ForwardIcon } from '@lucide/svelte';
	import { Trash2Icon } from '@lucide/svelte';
	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Root> = $props();

	const sidebar = useSidebar();
</script>

<Root {...restProps} bind:ref>
	<!-- <Header> -->
	<!-- 	<!-- <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} /> -->
	<!-- 	<!-- <SearchForm /> -->
	<!-- </Header> -->
	<Content>
		<!-- We create a Sidebar.Group for each parent. -->
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
									<MenuItem>
										<MenuButton isActive={item.isActive}>
											{#snippet child({ props })}
												<a href={item.url} {...props}>{item.title}</a>
											{/snippet}
										</MenuButton>
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												{#snippet child({ props })}
													<MenuAction showOnHover {...props}>
														<EllipsisIcon />
														<span class="sr-only">More</span>
													</MenuAction>
												{/snippet}
											</DropdownMenu.Trigger>
											<DropdownMenu.Content
												class="w-48 rounded-lg"
												side={sidebar.isMobile ? 'bottom' : 'right'}
												align={sidebar.isMobile ? 'end' : 'start'}
											>
												<DropdownMenu.Item>
													<FolderIcon class="text-muted-foreground" />
													<span>Rename Note</span>
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												<DropdownMenu.Item>
													<Trash2Icon class="text-muted-foreground" />
													<span>Delete Note</span>
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</MenuItem>
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
