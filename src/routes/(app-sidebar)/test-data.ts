export type NavGroup = { title?: string | null; items: NavItem[] };
export type Folder = { title: string; url?: string; isActive?: boolean; children: NavItem[] };
export type Note = { title: string; url?: string; isActive?: boolean };
export type NavItem = Folder | Note;

export const left_sidebar_data: { navMain: NavGroup[] } = {
	navMain: [
		{ items: [{ title: 'Home', url: '/', isActive: true }] },
		{
			title: 'Notes',
			items: [
				{
					title: 'Routing',
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
