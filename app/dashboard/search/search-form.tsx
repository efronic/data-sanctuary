'use client';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingButton } from '@/components/loading-button';

const formSchema = z.object({
  text: z.string().min(1).max(5000),
});

export default function SearchForm({
  setResults,
}: {
  setResults: (result: typeof api.search.searchAction._returnType) => void;
}) {
  const searchAction = useAction(api.search.searchAction);
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await searchAction({
        search: values.text,
    }).then((res) => {
        setResults(res);
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-full space-x-2 space-y-8'>
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel>Search for anything across all the documents and notes</FormLabel>
              <FormControl>
                <Input placeholder='Search' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText='Search...'
        >
          Search
        </LoadingButton>
      </form>
    </Form>
  );
}
