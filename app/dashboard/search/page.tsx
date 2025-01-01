'use client';
import { useState } from 'react';
import SearchForm from './search-form';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

export default function SearchPage() {
  const [results, setResults] = useState<
    typeof api.search.searchAction._returnType
  >([]);
  return (
    <div className='w-full flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>Search</h1>

      <SearchForm setResults={setResults} />

      <ul className='space-y-4'>
        {results?.map((result) => {
          if (result.type === 'notes') {
            return (
              <Link
                href={`/dashboard/notes/${result.record._id}`}
                key={result.record._id}
              >
                <div className='cursor-pointer hover:bg-slate-800 rounded-md p-4'>
                  <h1 className=''>Type: note</h1>
                  <li key={result.record._id}>
                    {result.record.text.substring(0, 500)}
                  </li>
                </div>
                1
              </Link>
            );
          } else if (result.type === 'documents') {
            return (
              <Link
                href={`/dashboard/documents/${result.record._id}`}
                key={result.record._id}
              >
                <div className='flex flex-col cursor-pointer hover:bg-slate-800 rounded-md p-4 gap-4 border border-gray-500'>
                  <h1 className='font-bold'>Type: document</h1>
                  <li key={result.record._id} className=''>
                    {result.record.title}
                    {result.record.description}...
                  </li>
                </div>
              </Link>
            );
          }
        })}
      </ul>
    </div>
  );
}
