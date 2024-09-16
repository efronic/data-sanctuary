'use client';

import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import CreateDocumentButton from './create-document-button';
import { DocumentCard } from './document-card';

export default function Home() {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);

  return (
    <main className="p-24 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <CreateDocumentButton />
      </div>

      <div className="grid grid-cols-4 gap-8">
        {documents?.map((doc) => <DocumentCard document={doc} key={doc._id} />)}
      </div>
    </main>
  );
}
