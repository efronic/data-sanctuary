'use client';

import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import UploadDocumentButton from './upload-document-button';
import { DocumentCard } from './document-card';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function Home() {
  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);
console.log('documents', documents);
  return (
    <main className='p-24 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl font-bold'>My Documents</h1>
        <UploadDocumentButton />
      </div>
      {!documents && (
        <div className='grid grid-cols-3 gap-8'>
          {new Array(8).fill('').map((_, i) => (
            <Card className='h-[200px] p-6 flex flex-col justify-between' key={i}>
              <Skeleton className='h-[20px] rounded' />
              <Skeleton className='h-[20px] rounded' />
              <Skeleton className='h-[20px] rounded' />
              <Skeleton className='w-[80px] h-[40px] rounded' />
            </Card>
          ))}
        </div>
      )}
      {documents && documents.length === 0 && (
        <div className='py-12 flex flex-col justify-center items-center space-y-4'>
          <Image
            src='/add_document.svg'
            className='w-32 h-32'
            width={200}
            height={200}
            alt='a picture of a girl holding a document'
          />
          <h2 className='text-2xl'>No documents found</h2>
          <UploadDocumentButton />
        </div>
      )}
      {documents && documents.length > 0 && (
        <div className='grid grid-cols-4 gap-8'>
          {documents?.map((doc) => (
            <DocumentCard document={doc} key={doc._id} />
          ))}
        </div>
      )}
    </main>
  );
}
