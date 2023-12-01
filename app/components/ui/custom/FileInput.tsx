import type { InputHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: React.ReactNode;
}

export function FileInput({ name, label, ...rest }: InputProps) {
  const { error, getInputProps } = useField(name);
  return (
    <div className='flex items-center justify-center w-full'>
      <label
        htmlFor={name}
        className='flex flex-col items-center justify-center w-full py-8 px-4 border-2 
        border-secondary-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 
        dark:bg-gray-700 hover:bg-secondary-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
      >
        <div className='flex flex-col items-center justify-center'>
          <img className='mx-auto mb-6' src='/static/assets/icons/upload.svg' alt='' />
          <p className='mb-2 text-secondary-500 dark:text-secondary-500'>{label}</p>
          <p className='font-semibold text-secondary-500 dark:text-secondary-500'>SVG, PNG, JPG</p>
        </div>
        <input {...getInputProps({ id: name })} {...rest} type='file' className='hidden' />
        {error && <p className='text-sm text-additional-red dark:text-additional-red'>{error}</p>}
      </label>
    </div>
  );
}
