import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    tokenIdentifier: v.string(),
    fileId: v.id('_storage'),
    embedding: v.optional(v.array(v.float64())),
  })
    .index('by_tokenIdentifier', ['tokenIdentifier'])
    .vectorIndex('by_embedding', {
      vectorField: 'embedding',
      dimensions: 1536,
      filterFields: ['tokenIdentifier'],
    }),
  notes: defineTable({
    text: v.string(),
    tokenIdentifier: v.string(),
    embedding: v.optional(v.array(v.float64())),
  })
    .index('by_tokenIdentifier', ['tokenIdentifier'])
    .vectorIndex('by_embedding', {
      vectorField: 'embedding',
      dimensions: 1536,
      filterFields: ['tokenIdentifier'],
    }),
  chats: defineTable({
    documentId: v.id('documents'),
    text: v.string(),
    isHuman: v.boolean(),
    tokenIdentifier: v.string(),
  }).index('by_documentId_tokenIdentifier', ['documentId', 'tokenIdentifier']),
});
