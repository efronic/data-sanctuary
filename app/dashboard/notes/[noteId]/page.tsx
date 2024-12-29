'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

export default function NotesPage() {
  const { noteId } = useParams<{ noteId: Id<'notes'> }>();
  const note = useQuery(api.notes.getNote, { noteId });

  return (
    <div className='border border-gray-300 p-4 rounded-md max-w-full'>
      {note?.text.substring(0, 2500)}
    </div>
  );
}