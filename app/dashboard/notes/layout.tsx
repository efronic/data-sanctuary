'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import CreateNoteButton from './create-note-button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DeleteNoteButton } from './[noteId]/delete-note-button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<'notes'> }>();
  const router = useRouter();
  const hasNotes = notes && notes.length > 0;
  const [isLoading, setIsLoading] = useState(true);

  const [lastClickedNoteId, setLastClickedNoteId] =
    useState<Id<'notes'> | null>(null);

  const handleNoteClick = (id: Id<'notes'>) => {
    if (lastClickedNoteId === id) {
      router.push('/dashboard/notes');
      setLastClickedNoteId(null); // Reset the last clicked note ID
    } else {
      setLastClickedNoteId(id);
      router.push(`/dashboard/notes/${id}`);
    }
  };
  useEffect(() => {
    if (notes !== undefined) {
      setIsLoading(false);
    }
    else if (notes === undefined) {
      setIsLoading(true);
    }
  }, [notes]);

  if (isLoading) {
    return (
      <div className='grid grid-rows-3 gap-8'>
        {new Array(8).fill('').map((_, i) => (
          <Card className=' w-[400px] h-[50px] p-2 flex' key={i}>
            <Skeleton className='h-[20px] rounded w-full' />
          </Card>
        ))}
      </div>
    );
  } else {
    return (
      <main className='w-full space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-4xl font-bold'>Notes</h1>
          <CreateNoteButton />
        </div>
        <div className='w-full flex gap-12 justify-center'>
          {!hasNotes && (
            <div className='py-12 flex flex-col justify-center items-center space-y-4'>
              <Image
                src='/add_document.svg'
                className='w-32 h-32'
                width={200}
                height={200}
                alt='a picture of a girl holding a note'
              />
              <h2 className='text-2xl'>No notes found</h2>
              <CreateNoteButton />
            </div>
          )}
          {hasNotes && (
            <ul className='space-y-4 flex-1'>
              {notes?.map((note) => (
                <li
                  key={note._id}
                  className={cn(
                    'text-base p-2 rounded-md cursor-pointer border border-4 border-gray-400 flex justify-between items-center',
                    { 'bg-cyan-100 text-cyan-900': note._id === noteId },
                    'hover:bg-cyan-200 hover:text-cyan-900'
                  )}
                  onClick={() => handleNoteClick(note._id)}
                >
                  <Link href={`/dashboard/notes/${note._id}`}>
                    {note.text.substring(0, 100)}...
                  </Link>
                  <DeleteNoteButton noteId={note._id} />
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>
      </main>
    );
  }
}
