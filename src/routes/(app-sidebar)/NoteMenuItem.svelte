<script lang="ts">
	import { EllipsisIcon, FileIcon, FolderIcon, FolderOpenIcon, Trash2Icon } from '@lucide/svelte';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		MenuAction,
		MenuButton,
		MenuItem,
		MenuSub,
		useSidebar
	} from '$lib/components/ui/sidebar';
	import type { NavItem } from './test-data';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import NoteMenuItem from './NoteMenuItem.svelte';

	type Props = { item: NavItem; isMobile?: boolean };
	let { item, isMobile = useSidebar().isMobile }: Props = $props();

	const hasNoChildren = $derived((item.children?.length ?? 0) === 0);

	let isOpen = $state(false);
</script>

{#if hasNoChildren}
	<MenuItem>
		<MenuButton isActive={item.isActive}>
			<!-- {#snippet child({ props })} -->
			<FileIcon />
			<a href={item.url}>{item.title}</a>
			<!-- <a href={item.url} {...props}>{item.title}</a> -->
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
		<Collapsible.Root bind:open={() => isOpen, (_v) => (isOpen = _v)}>
			<Collapsible.Trigger class="w-full">
				<MenuButton isActive={item.isActive}>
					<!-- {#snippet child({ props })} -->
					{#if isOpen}
						<FolderOpenIcon />
					{:else}
						<FolderIcon />
					{/if}
					<a href={item.url}>
						{item.title}
					</a>
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
			</Collapsible.Trigger>
			<Collapsible.Content>
				<MenuSub class="mr-0 pr-0">
					{#each item.children! as child (child.title)}
						<NoteMenuItem item={child} />
					{/each}
				</MenuSub>
			</Collapsible.Content>
		</Collapsible.Root>
	</MenuItem>
{/if}
