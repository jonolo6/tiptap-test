<script lang="ts">
	import {
		EllipsisIcon,
		FileIcon,
		FileTextIcon,
		FolderIcon,
		FolderOpenIcon,
		PlusIcon,
		Trash2Icon
	} from '@lucide/svelte';

	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import {
		MenuAction,
		MenuButton,
		MenuItem,
		MenuSub,
		useSidebar
	} from '$lib/components/ui/sidebar';
	import NoteMenuItem from './NoteMenuItem.svelte';
	import type { NavItem } from './test-data';

	type Props = { item: NavItem; isMobile?: boolean };
	let { item, isMobile = useSidebar().isMobile }: Props = $props();

	const hasNoChildren = $derived((item.children?.length ?? 0) === 0);

	let isOpen = $state(false);
</script>

{#if hasNoChildren}
	<MenuItem>
		<DropdownMenu.Root>
			<MenuButton isActive={item.isActive} class={['group/menu-btn']}>
				<!-- {#snippet child({ props })} -->
				<FileTextIcon />
				<a href={item.url}>{item.title}</a>
				<!-- <a href={item.url} {...props}>{item.title}</a> -->
				<!-- {/snippet} -->
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<MenuAction
							{...props}
							class={[
								`opacity-0 group-hover/menu-btn:opacity-100 data-[state=open]:opacity-100 hover:dark:bg-slate-700`
							]}
						>
							<EllipsisIcon />
							<span class="sr-only">More</span>
						</MenuAction>
					{/snippet}
				</DropdownMenu.Trigger>
			</MenuButton>
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
			<DropdownMenu.Root>
				<Collapsible.Trigger class="w-full">
					<MenuButton isActive={item.isActive} class={['group/menu-btn']}>
						{#if isOpen}
							<FolderOpenIcon />
						{:else}
							<FolderIcon />
						{/if}
						<a href={item.url}>
							{item.title}
						</a>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<MenuAction
									{...props}
									class={[
										`opacity-0 group-hover/menu-btn:opacity-100 data-[state=open]:opacity-100 hover:dark:bg-slate-700`
									]}
								>
									<EllipsisIcon />
									<span class="sr-only">More</span>
								</MenuAction>
							{/snippet}
						</DropdownMenu.Trigger>
					</MenuButton>
				</Collapsible.Trigger>
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
				<Collapsible.Content>
					<MenuSub class="mr-0 pr-0">
						{#each item.children! as child (child.title)}
							<NoteMenuItem item={child} />
						{/each}
					</MenuSub>
				</Collapsible.Content>
			</DropdownMenu.Root>
		</Collapsible.Root>
	</MenuItem>
{/if}
