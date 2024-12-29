'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotesPage() {
  const notes = useQuery(api.notes.getNotes);
    const { noteId } = useParams<{ noteId: Id<'notes'> }>();
  return (
    <div className='flex gap-12'>
        <ul className='space-y-4 w-[300px]'>
          {notes?.map((note) => (
            <li
              key={note._id}
              className={cn(
                'text-base p-2 rounded-md cursor-pointer border border-4 border-gray-400',
                { 'bg-cyan-100 text-cyan-900': note._id === noteId },
                'hover:bg-cyan-200 hover:text-cyan-900'
              )}
            >
              <Link href={`/dashboard/notes/${note._id}`}>{note.text.substring(0,100
              )}...</Link>
            </li>
          ))}
        </ul>
      </div>
  )
}
