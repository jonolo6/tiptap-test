import { eq } from 'drizzle-orm';
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

export const getNoteById = query(v.string(), async (id: string) => {
	console.log('loading note...', { id });
	const result = await db.select().from(notesTable).where(eq(notesTable.id, id));
	console.log('loaded note!', { result });
	if (result.length === 0) return null;
	return result[0];
});

export const insertNote = command(v.string(), async (title: string) => {
	console.log('inserting...', { title });
	await db.insert(notesTable).values({ title });
	getAllNotes().refresh();
});

export const updateNoteContent = command(
	v.object({ id: v.string(), content: v.any() }),
	async ({ id, content }) => {
		console.log('updating...', { id });
		await db.update(notesTable).set({ content }).where(eq(notesTable.id, id));
		console.log('updating', { id });
		getNoteById(id).refresh();
		console.log('updated!', { id });
	}
);

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
