import * as v from 'valibot';

import { command, query } from '$app/server';

import { db } from '$lib/db';
import { notesTable } from '$lib/db/schema';

export const getAllNotes = query(async () => {
	console.log('loading...');
	const result = await db.select().from(notesTable);
	console.log('loaded!', { result });
	return result;
});

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const insertNote = command(v.string(), async (title: string) => {
	console.log('inserting...', { title });
	await db.insert(notesTable).values({ title });
	getAllNotes().refresh();
});
