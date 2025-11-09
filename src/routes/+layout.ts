import type { LayoutLoad } from './$types';
import { left_sidebar_data } from './(app-sidebar)/test-data';

export const prerender = true;
export const ssr = false;

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTree() {
	await sleep(2000);
	return left_sidebar_data;
}

export const load: LayoutLoad = ({ params }) => {
	return {
		tree: getTree,
	};
};
