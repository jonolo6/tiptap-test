<script lang="ts">
	import {
		EllipsisIcon,
		FileTextIcon,
		FolderIcon,
		FolderOpenIcon,
		Trash2Icon,
	} from '@lucide/svelte';

	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import NoteMenuItem from './NoteMenuItem.svelte';
	import type { NavItem } from './test-data';
	import MyCollapsible from '$lib/components/MyCollapsible.svelte';

	type Props = { item: NavItem; isMobile?: boolean };
	let { item, isMobile = useSidebar().isMobile }: Props = $props();

	const hasNoChildren = $derived((item.children?.length ?? 0) === 0);
</script>

{#if hasNoChildren}
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<Sidebar.MenuButton isActive={item.isActive} class={['group/menu-btn']}>
				<FileTextIcon /> <a href={item.url}>{item.title}</a>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuAction
							{...props}
							class={[
								`opacity-0 group-hover/menu-btn:opacity-100 data-[state=open]:opacity-100 hover:dark:bg-slate-700`,
							]}
						>
							<EllipsisIcon />
							<span class="sr-only">More</span>
						</Sidebar.MenuAction>
					{/snippet}
				</DropdownMenu.Trigger>
			</Sidebar.MenuButton>
			<DropdownMenu.Content
				class="w-48 rounded-lg"
				side={isMobile ? 'bottom' : 'right'}
				align={isMobile ? 'end' : 'start'}
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
	</Sidebar.MenuItem>
{:else}
	<Sidebar.MenuItem>
		<MyCollapsible>
			{#snippet children({ toggle, open })}
				<DropdownMenu.Root>
					<Sidebar.MenuButton isActive={item.isActive} class={['group/menu-btn']} onclick={toggle}>
						{#if open}
							<FolderOpenIcon />
						{:else}
							<FolderIcon />
						{/if}
						<a href={item.url} class="truncate whitespace-nowrap">
							{item.title}
						</a>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuAction
									{...props}
									class={[
										`opacity-0 group-hover/menu-btn:opacity-100 data-[state=open]:opacity-100 hover:dark:bg-slate-700`,
									]}
								>
									<EllipsisIcon />
									<span class="sr-only">More</span>
								</Sidebar.MenuAction>
							{/snippet}
						</DropdownMenu.Trigger>
					</Sidebar.MenuButton>
					<DropdownMenu.Content
						class="w-48 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align={isMobile ? 'end' : 'start'}
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
					{#if open}
						<Sidebar.MenuSub class="mr-0 pr-0">
							{#each item.children! as child (child.title)}
								<NoteMenuItem item={child} />
							{/each}
						</Sidebar.MenuSub>
					{/if}
				</DropdownMenu.Root>
			{/snippet}
		</MyCollapsible>
	</Sidebar.MenuItem>
{/if}
