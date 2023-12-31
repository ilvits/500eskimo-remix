import type { InputHTMLAttributes } from 'react';
import { useField } from 'remix-validated-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  sublabel?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
}

export function FormInput({ name, label, sublabel, onChange, onBlur, ...rest }: InputProps) {
  const { error, getInputProps } = useField(name);
  return (
    <div className={sublabel === 'id' ? 'hidden' : 'block'}>
      {label && (
        <label htmlFor={name} className='block mb-4 font-bold'>
          {label}
        </label>
      )}
      {sublabel && (
        <label htmlFor={name} className='text-sm mb-2.5 block capitalize'>
          {sublabel}
        </label>
      )}
      <input
        className={`bg-input-bg border border-input rounded-lg focus:ring-primary-brown focus:border-input-focus block w-full p-2.5 h-11
                    placeholder:text-primary-brown/50 hover:border-input-hover focus-visible:outline-none 
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                    ${error && '!border-red-500'}`}
        {...rest}
        {...getInputProps({ id: name })}
        onChange={onChange || (() => {})}
        onBlur={onBlur || (() => {})}
      />
      {error && <p className='text-sm text-additional-red dark:text-additional-red'>{error}</p>}
    </div>
  );
}
