'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import CreateNoteButton from './create-note-button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notes = useQuery(api.notes.getNotes);
  const { noteId } = useParams<{ noteId: Id<'notes'> }>();

  return (
    <main className='w-full space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>Notes</h1>
        <CreateNoteButton />
      </div>
      
      {children}
    </main>
  );
}
