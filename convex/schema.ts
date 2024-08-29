import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        tokenIdentifer: v.string(),

    }).index('by_tokenIdentifer', ['tokenIdentifer'])
});