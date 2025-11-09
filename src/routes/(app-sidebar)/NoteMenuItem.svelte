<script lang="ts">
	import {
		EllipsisIcon,
		FileTextIcon,
		FolderIcon,
		FolderOpenIcon,
		Trash2Icon,
	} from '@lucide/svelte';

	import MyCollapsible from '$lib/components/MyCollapsible.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { useSidebar } from '$lib/components/ui/sidebar';
	import type { notesTable } from '$lib/db/schema';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	type Props = { note: typeof notesTable.$inferSelect; isMobile?: boolean };
	let { note, isMobile = useSidebar().isMobile }: Props = $props();

	// const hasNoChildren = $derived((item.children?.length ?? 0) === 0);
	const hasNoChildren = $state(true);
	// TODO: Fix isActive on MenuButton
</script>

{#if hasNoChildren}
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<Sidebar.MenuButton
				isActive={false}
				class={['group/menu-btn']}
				onclick={() => goto(`/note/${note.id}`)}
			>
				<!-- TODO: make this link work! -->
				<FileTextIcon />
				<!-- <Button variant="ghost">test</Button> -->
				{note.title}:{note.id}
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
					<Sidebar.MenuButton isActive={false} class={['group/menu-btn']} onclick={toggle}>
						{#if open}
							<FolderOpenIcon />
						{:else}
							<FolderIcon />
						{/if}
						<a href={`${note.id}`} class="truncate whitespace-nowrap">
							{note.title}:{note.id}
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
							<!-- TODO: Fix -->
							<!-- {#each item.children! as child (child.title)} -->
							<!-- 	<NoteMenuItem item={child} /> -->
							<!-- {/each} -->
						</Sidebar.MenuSub>
					{/if}
				</DropdownMenu.Root>
			{/snippet}
		</MyCollapsible>
	</Sidebar.MenuItem>
{/if}
