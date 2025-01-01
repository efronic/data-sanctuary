import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { api, internal } from './_generated/api';
import OpenAI from 'openai';
import { Id } from './_generated/dataModel';
import { embed } from '../lib/utils';

const openai = new OpenAI({
  apiKey: process.env.DATA_SANCTUARY_OPENAI_KEY,
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<'documents'>
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return undefined;
  }

  const document = await ctx.db.get(documentId);

  if (!document) {
    return null;
  }

  if (document.tokenIdentifier !== userId) {
    return null;
  }
  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query('documents')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
      .collect();
  },
});
export const getDocument = query({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);
    if (!accessObj) {
      return null;
    }

    return {
      ...accessObj.document,
      documentUrl: await ctx.storage.getUrl(accessObj.document.fileId),
    };
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id('_storage'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Not authenticated');
    }
    const documentId = await ctx.db.insert('documents', {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
    });
    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDocumentDescription,
      { fileId: args.fileId, documentId: documentId }
    );
  },
});

export const generateDocumentDescription = internalAction({
  args: {
    fileId: v.id('_storage'),
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const file = await ctx.storage.get(args.fileId);

    if (!file) {
      throw new ConvexError('File not found');
    }

    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Here is a text file: ${text}`,
          },
          {
            role: 'user',
            content: `please generate 1 sentence description for this document, don't include quotes in the returned response.`,
          },
        ],
        model: 'gpt-3.5-turbo',
      });
    const description =
      chatCompletion.choices[0].message.content ??
      'could not figure out the description for this document';
      const embedding = await embed(description);
    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: description,
      embedding: embedding,
    });
  },
});
export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id('documents'),
    description: v.string(),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
      embedding: args.embedding,
    });
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      { documentId: args.documentId }
    );

    if (!accessObj) {
      throw new ConvexError('You do not have access to this document');
    }

    const file = await ctx.storage.get(accessObj.document.fileId);

    if (!file) {
      throw new ConvexError('File not found');
    }

    const text = await file.text();

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Here is a text file: ${text}`,
          },
          {
            role: 'user',
            content: `Please answer this question, return the answer in well-formed HTML with proper Tailwind CSS classes for styling, the page uses shadcn for theming, make the response follow the active theme in place: ${args.question}`,
          },
        ],
        model: 'gpt-3.5-turbo',
      });
    console.log('chatCompletion', chatCompletion);

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: accessObj.userId,
    });

    const response =
      chatCompletion.choices[0].message.content ?? 'No response from AI';

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: response,
      isHuman: false,
      tokenIdentifier: accessObj.userId,
    });
    return response;
  },
});
export const deleteDocument = mutation({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      { documentId: args.documentId }
    );

    if (!accessObj) {
      throw new ConvexError('You do not have access to this document');
    }
    await ctx.storage.delete(accessObj.document.fileId);
    await ctx.db.delete(args.documentId);
  },
});
export const setDocumentEmbedding = internalMutation({
  args: {
    documentId: v.id('documents'),
    embedding: v.array(v.number()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      embedding: args.embedding,
    });
  },
});

export const createDocumentEmbedding = internalAction({
  args: {
    documentId: v.id('documents'),
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new Error('Unauthorized');
    }
    const embedding = await embed(args.text);
    await ctx.runMutation(internal.documents.setDocumentEmbedding, {
      documentId: args.documentId,
      embedding,
    });
  },
});