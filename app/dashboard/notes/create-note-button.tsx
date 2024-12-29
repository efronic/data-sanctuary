'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import CreateNoteForm from './create-note-form';
import { PlusIcon, Upload } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useToast } from '@/hooks/use-toast';
import { btnIconStyles, btnStyles } from '@/styles/styles';

export default function CreateNoteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  if (!isSignedIn) return null;

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className={btnStyles}>
          <PlusIcon className={btnIconStyles} />
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Note</DialogTitle>
          <DialogDescription>
            Create a note for you to reference in the future.
          </DialogDescription>

          <CreateNoteForm
            onUpload={() => {
              setIsOpen(false);
              toast({
                title: 'Note created',
                description: 'Your note has been created successfuly.',
              });
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
