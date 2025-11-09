import { query } from '$app/server';

import { db } from '$lib/db';
import { notesTable } from '$lib/db/schema';

export const getAllNotes = query(async () => {
	const result = await db.select().from(notesTable);
	console.log('loading...');
	await sleep(1000);

	console.log('loaded!', { result });
	return result;
});

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
