export type NavGroup = { title?: string | null; items: NavItem[] };
export type NavItem = { title: string; url: string; isActive?: boolean; children?: NavItem[] };

export const left_sidebar_data: { navMain: NavGroup[] } = {
	navMain: [
		{ items: [{ title: 'Home', url: '#', isActive: true }] },
		{
			title: 'Notes',
			items: [
				{
					title: 'Routing',
					url: '#',
					children: [
						{ title: 'child', url: '#' },
						{ title: 'child 2', url: '#' },
					],
				},
				{ title: 'Data Fetching', url: '#' },
				{ title: 'Rendering', url: '#' },
				{
					title: 'GrandParent Note',
					url: '#',
					children: [
						{
							title: 'Parent Note 1',
							url: '#',
							children: [
								{ title: 'Note 1', url: '#' },
								{ title: 'Note 2', url: '#' },
							],
						},
						{ title: 'Parnet Note 2', url: '#' },
					],
				},
			],
		},
	],
};
