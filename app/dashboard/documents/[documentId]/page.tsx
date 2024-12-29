'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { use } from 'react';
import { ChatPanel } from './chat-panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { DeleteDocumentButton } from './delete-document-button';

export default function DocumentPage({
  params,
}: {
  params: Promise<{
    documentId: Id<'documents'>;
  }>;
}) {
  const unwrappedParams = use(params);
  const document = useQuery(api.documents.getDocument, {
    documentId: unwrappedParams.documentId,
  });

  return (
    <main className='p-24 space-y-8'>
      {document && (
        <div className='flex justify-between items-center'>
          <h1 className='text-4xl font-bold'>{document.title}</h1>
          <DeleteDocumentButton documentId={document._id} />
        </div>

      )}

      <div className='flex gap-12'>
        <ScrollArea className='bg-gray-900 rounded-md flex-1 border p-4 h-[80vh] [&_[data-radix-scroll-area-viewport]]:h-full [&_[data-radix-scroll-area-viewport]>div]:h-full [&_[data-radix-scroll-area-viewport]>div>div]:h-full'>
          {!document && (
            <div className='space-y-8'>
            <div>
              <Skeleton className='h-[40px] w-[500px]' />
            </div>
            <Skeleton className='h-[500px]' />
          </div>
          )}
          {document && document.documentUrl && (
            <iframe
              className='w-full h-full'
              src={document.documentUrl}
              title='Document Content'
            />
          )}
        </ScrollArea>

        {document && <ChatPanel documentId={document._id} />}
      </div>
    </main>
  );
}
