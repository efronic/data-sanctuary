import { v } from 'convex/values';
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { embed } from '../lib/utils';
import { internal } from './_generated/api';

export const getNote = query({
  args: {
    noteId: v.id('notes'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error('Note not found');
    }
    if (note.tokenIdentifier !== userId) {
      return null;
    }
    return note;
  },
});

export const getNotes = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return null;
    }
    const notes = await ctx.db
      .query('notes')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
      .order('desc')
      .collect();

    return notes;
  },
});

export const createNote = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new Error('You must be logged in to create a note');
    }
    const note = await ctx.db.insert('notes', {
      text: args.text,
      tokenIdentifier: userId,
    });
    return note;
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id('notes'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new Error('Note not found');
    }
    if (note.tokenIdentifier !== userId) {
      throw new Error('Unauthorized');
    }
    await ctx.db.delete(args.noteId);
  },
});

export const setNoteEmbedding = internalMutation({
  args: {
    noteId: v.id('notes'),
    embedding: v.array(v.number()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.noteId, {
      embedding: args.embedding,
    });
  },
});

export const createNoteEmbedding = internalAction({
  args: {
    noteId: v.id('notes'),
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    const embedding = await embed(args.text);
    await ctx.runMutation(internal.notes.setNoteEmbedding, {
      noteId: args.noteId,
      embedding,
    });
  },
});
