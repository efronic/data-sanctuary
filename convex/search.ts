import { v } from 'convex/values';
import { action } from './_generated/server';
import { embed } from '../lib/utils';
import { Doc } from './_generated/dataModel';
import { api } from './_generated/api';

export const searchAction = action({
  args: {
    search: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
 console.log('iiiii', userId);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const embedding = await embed(args.search);

    const noteResults = await ctx.vectorSearch('notes', 'by_embedding', {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq('tokenIdentifier', userId),
    });

    const documentResults = await ctx.vectorSearch(
      'documents',
      'by_embedding',
      {
        vector: embedding,
        limit: 5,
        filter: (q) => q.eq('tokenIdentifier', userId),
      }
    );

    const records: (
      | { type: 'notes'; score: number; record: Doc<'notes'> }
      | { type: 'documents'; score: number; record: Doc<'documents'> }
    )[] = [];

    await Promise.all([
      ...noteResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });
        if (!note) {
          return;
        }
        records.push({
          record: note,
          score: result._score,
          type: 'notes',
        });
      }),
      ...documentResults.map(async (result) => {
        const document = await ctx.runQuery(api.documents.getDocument, {
          documentId: result._id,
        });
        if (!document) {
          return;
        }
        records.push({
          record: document,
          score: result._score,
          type: 'documents',
        });
      }),
    ]);
    console.log('records:', records);
    return records.sort((a, b) => b.score - a.score);
  },
});
