<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import favicon from '$lib/assets/favicon.svg';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import LeftSidebar from './(app-sidebar)/LeftSidebar.svelte';

	import '../app.css';
	import '../tiptap.css';

	let { children, data } = $props();

	$inspect({ data });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<Sidebar.Provider style="--sidebar-width: 12rem; --sidebar-width-mobile: 12rem;">
	<LeftSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<!-- <Separator orientation="vertical" class="mr-2 h-4" /> -->
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main class="mx-4">
			<!-- <div class="flex flex-1 flex-col gap-4 p-4"> -->
			<!-- 	<div class="grid auto-rows-min gap-4 md:grid-cols-3"> -->
			<!-- 		<div class="aspect-video rounded-xl bg-muted/50"></div> -->
			<!-- 		<div class="aspect-video rounded-xl bg-muted/50"></div> -->
			<!-- 		<div class="aspect-video rounded-xl bg-muted/50"></div> -->
			<!-- 	</div> -->
			<!-- <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"> -->
			<!-- <div class="min-h-[100vh] flex-1 rounded-xl md:min-h-min"> -->
			{@render children?.()}
			<!-- </div> -->
			<!-- </div> -->
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
