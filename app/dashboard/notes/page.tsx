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
    <div></div>
  )
}
