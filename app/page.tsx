'use client';

import { api } from '@/convex/_generated/api';
import { createDocument } from '@/convex/documents';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react';

export default function Home() {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { createDocument({ title: 'Hello World!' }) }}> Click Me </button>
        <ul>
          {documents?.map((document) => (
            <li key={document._id}>{document.title}</li>
          ))}
        </ul>
      </Authenticated>
    </main>
  );
}
