import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog';
  import { Button } from '@/components/ui/button';
  import { api } from '@/convex/_generated/api';
  import { Id } from '@/convex/_generated/dataModel';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
  import { useMutation } from 'convex/react';
  import { Trash } from 'lucide-react';
  import { useRouter } from 'next/navigation';
  import { useState } from 'react';
  
  export function DeleteDocumentButton({
    documentId,
  }: {
    documentId: Id<'documents'>;
  }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const deleteDocument = useMutation(api.documents.deleteDocument);
    const router = useRouter();
  
    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <AlertDialogTrigger asChild>
          <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='destructive'
                  className='flex items-center gap-2'
                >
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent className='border p-2 rounded-md bg-red-800 text-white'>
                <p>Delete Note</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This document will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              onClick={async () => {
                setIsLoading(true);
                await deleteDocument({ documentId });
                setIsLoading(false);
                setIsOpen(false);
                router.push('/dashboard/documents');
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }