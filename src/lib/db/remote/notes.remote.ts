import { eq } from 'drizzle-orm';
import * as v from 'valibot';

import { command, query } from '$app/server';
import { db } from '$lib/db';
import { notesTable } from '$lib/db/schema';

export const getAllNotes = query(async () => {
	const result = await db.select().from(notesTable);
	return result;
});

export const getNoteById = query(v.string(), async (id: string) => {
	const result = await db.select().from(notesTable).where(eq(notesTable.id, id));
	if (result.length === 0) return null;
	return result[0];
});

export const insertNote = command(v.string(), async (title: string) => {
	await db.insert(notesTable).values({ title });
	getAllNotes().refresh();
});

export const updateNoteContent = command(
	v.object({ id: v.string(), content: v.any() }),
	async ({ id, content }) => {
		await db.update(notesTable).set({ content }).where(eq(notesTable.id, id));
	}
);

export const updateNoteTitle = command(
	v.object({ id: v.string(), title: v.string() }),
	async ({ id, title }) => {
		await db.update(notesTable).set({ title }).where(eq(notesTable.id, id));
		getAllNotes().refresh();
	}
);

// Private...

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
