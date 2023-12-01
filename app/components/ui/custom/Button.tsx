import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function Button({ label, ...props }: ButtonProps) {
  return (
    <button
      className='text-white bg-primary focus:ring-4 focus:outline-none focus:ring-secondary-200 dark:focus:ring-blue-800 font-medium rounded-full px-12 py-2.5 text-center'
      {...props}
    >
      {label}
    </button>
  );
}
