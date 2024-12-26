import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MouseEvent } from 'react';

export function LoadingButton({
  isLoading,
  children,
  loadingText,
  onClick,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText: string;
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}) {
  return (
    <Button
      type='submit'
      className='flex items-center gap-1'
      disabled={isLoading}
      onClick={(e) => {
        onClick?.(e);
      }}
    >
      {isLoading && <Loader2 className='animate-spin' />}
      {isLoading ? loadingText : children}
    </Button>
  );
}
