import * as React from 'react';

import { cn } from '~/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  sublabel?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, name, label, sublabel, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={name} className='font-bold mb-4 block'>
            {label}
          </label>
        )}
        {sublabel && (
          <label htmlFor={name} className='text-sm mb-2.5 block'>
            {sublabel}
          </label>
        )}

        <textarea
          id={name}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input focus:border-input-focus hover:border-input-hover bg-secondary-50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
FormTextarea.displayName = 'Textarea';

export { FormTextarea };
