'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { use } from 'react';
import { ChatPanel } from './chat-panel';
import { ScrollArea } from "@/components/ui/scroll-area"


export default function DocumentPage({
    params,
  }: {
    params: Promise<{
        documentId: Id<"documents">;
      }>;
  }) {
    const unwrappedParams = use(params);
    const document = useQuery(api.documents.getDocument, {documentId: unwrappedParams.documentId});
    if (!document) {
        return <div>You don't have access to view this document.</div>;
    }
	return (
        <main className="p-24 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">{document.title}</h1>
          </div>
          <div className="flex gap-12">
          <ScrollArea className="bg-gray-900 rounded-md flex-1 border p-4 h-[80vh] [&_[data-radix-scroll-area-viewport]]:h-full [&_[data-radix-scroll-area-viewport]>div]:h-full [&_[data-radix-scroll-area-viewport]>div>div]:h-full">
            {document.documentUrl && (
              <iframe className="w-full h-full" src={document.documentUrl} title="Document Content" />
            )}
          </ScrollArea>


            <ChatPanel documentId={document._id} />
          </div>
        </main>
      );
}
