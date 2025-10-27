<script lang="ts">
	import { EllipsisIcon, FolderIcon, NotebookIcon, Trash2Icon } from '@lucide/svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { MenuAction, MenuButton, MenuItem, useSidebar } from '$lib/components/ui/sidebar';
	import type { NavItem } from './test-data';

	type Props = { item: NavItem; isMobile?: boolean };
	let { item, isMobile = useSidebar().isMobile }: Props = $props();

	const hasNoChildren = $derived((item.children?.length ?? 0) === 0);
	const hasChildren = $derived(!hasNoChildren);
</script>

{#if hasChildren}
	<MenuItem>
		<MenuButton isActive={item.isActive}>
			<NotebookIcon />
			<a href={item.url}>{item.title} ({item.children!.length})</a>
			<!-- {#snippet child({ props })} -->
			<!-- 	<NotebookIcon /> -->
			<!-- 	<a href={item.url} {...props}>{item.title} ({item.children!.length})</a> -->
			<!-- {/snippet} -->
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
	</MenuItem>
{:else}
	<MenuItem>
		<MenuButton isActive={item.isActive}>
			{#snippet child({ props })}
				<a href={item.url} {...props}>{item.title} </a>
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
	</MenuItem>
{/if}
