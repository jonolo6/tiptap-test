export type NavGroup = { title?: string | null; items: NavItem[] };
export type NavItem = { title: string; url: string; isActive?: boolean; children?: NavItem[] };

export const left_sidebar_data: { navMain: NavGroup[] } = {
	navMain: [
		{ items: [{ title: 'Home', url: '#', isActive: true }] },
		{
			title: 'Notes',
			items: [
				{ title: 'Routing', url: '#', children: [{ title: 'child', url: '#' }] },
				{ title: 'Data Fetching', url: '#' },
				{ title: 'Rendering', url: '#' }
			]
		}
	]
};
