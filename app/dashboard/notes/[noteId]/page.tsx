'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

export default function NotesPage() {
  const { noteId } = useParams<{ noteId: Id<'notes'> }>();
  const note = useQuery(api.notes.getNote, { noteId });

  return (
    <>
      {!note && (
        <ScrollArea className='bg-gray-900 rounded-md flex-1 border p-4 h-[80vh] w-[600px]'>
          <div className='space-y-8'>
            <Skeleton className='h-[500px]' />
          </div>
        </ScrollArea>
      )}
      {note && (
        <div className='border border-gray-300 p-4 rounded-md flex-1 whitespace-pre-wrap'>
          {note?.text.substring(0, 5000)}
        </div>
      )}
    </>
  );
}
