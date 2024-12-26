'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Id } from '@/convex/_generated/dataModel';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState, useRef, useEffect, use } from 'react';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { LoadingButton } from '@/components/loading-button';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  question: z.string().min(2, {
    message: 'Please ask a valid question.',
  }),
});

export function ChatPanel({ documentId }: { documentId: Id<'documents'> }) {
  const askQuestion = useAction(api.documents.askQuestion);
  const chats = useQuery(api.chats.getChatsForDocument, { documentId });

  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage = { type: 'user', text: values.question };
    const response = await askQuestion({
      question: values.question,
      documentId,
    });

    console.log('response', response);
    form.reset();
  }

  // Close the chat if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chats]);
  // Scroll to the bottom when the chat panel is opened
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [isOpen]);
  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className='rounded-full p-4 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90'
        >
          Chat
        </Button>
      )}
      {isOpen && (
        <div
          ref={chatRef}
          className={`w-[800px] h-[800px] bg-background shadow-xl rounded-lg p-4 flex flex-col border border-border`}
        >
          <div className='flex justify-between items-center border-b pb-2'>
            <h2 className='text-lg font-bold'>Chat</h2>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
            >
              <X className='h-5 w-5' />
            </Button>
          </div>
          <div
            ref={chatContainerRef}
            className='flex-grow overflow-auto p-2 space-y-2'
          >
            {chats &&
              chats.map((chat, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg ${chat.isHuman ? 'bg-slate-700 text-muted-foreground self-end inline-block' : 'bg-slate-800 text-muted-foreground self-start inline-block'}`}
                  dangerouslySetInnerHTML={{ __html: chat.text }}
                />
              ))}
          </div>
          <div className='p-2 border-t'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='question'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ask question</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Ask a question'
                          {...field}
                          disabled={form.formState.isSubmitting}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <LoadingButton
                  isLoading={form.formState.isSubmitting}
                  loadingText='Thinking...'
                >
                  Ask
                </LoadingButton>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
