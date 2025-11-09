import * as v from 'valibot';
import { eq, lt, gte, ne } from 'drizzle-orm';

import { command, query } from '$app/server';

import { db } from '$lib/db';
import { notesTable } from '$lib/db/schema';

export const getAllNotes = query(async () => {
	console.log('loading...');
	const result = await db.select().from(notesTable);
	console.log('loaded!', { result });
	return result;
});

export const getNoteById = query(v.string(), async (id: string) => {
	console.log('loading note...', { id });
	const result = await db.select().from(notesTable).where(eq(notesTable.id, id));
	console.log('loaded note!', { result });
	if (result.length === 0) return null;
	return result[0];
});

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const insertNote = command(v.string(), async (title: string) => {
	console.log('inserting...', { title });
	await db.insert(notesTable).values({ title });
	getAllNotes().refresh();
});
