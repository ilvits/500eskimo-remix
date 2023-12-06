import type { FormErrors } from '~/routes/admin.products.new';
import makeAnimated from 'react-select/animated';
import { useField } from 'remix-validated-form';
import Select, { type Props } from 'react-select';

type MyInputProps = {
  name: string;
  label: string;
  options: string[];
  defaultValue?: string;
  formErrors?: FormErrors;
  onChange: (option: any) => void;
};

export const ProductOptionSelect = ({ options, name, label, formErrors, onChange, defaultValue }: MyInputProps) => {
  const { error, getInputProps } = useField(name);

  const animatedComponents = makeAnimated();

  return (
    <div>
      <label id={`${label}-label`} className='block mb-4 font-bold' htmlFor={name}>
        {label}
      </label>
      <Select
        aria-labelledby={`${label}-label`}
        options={options}
        name={`${label}`}
        placeholder={`Choose ${label}...`}
        defaultValue={defaultValue}
        {...getInputProps<Props>({ id: name })}
        getOptionLabel={(option: any) => `${option.value} ${option.unit && `(${option.unit})`}`}
        getOptionValue={(option: any) => option.id.toString()}
        isClearable={false}
        // closeMenuOnSelect={false}
        components={animatedComponents}
        unstyled={true}
        classNamePrefix={'options-select'}
        classNames={{
          control: () => {
            return `px-4 border border-input hover:border-input-hover rounded-lg bg-input-bg text-sm h-11 ${
              formErrors && formErrors.optionValueId && !defaultValue && 'border-red-500'
            }`;
          },
          menu: () => 'bg-input-bg text-sm rounded-lg border border-input hover:border-input-hover mt-1',
          menuList: () => 'space-y-2 p-2',
          option: () => 'p-2 rounded-lg hover:bg-input text-foreground  text-sm',
          valueContainer: () => 'gap-2',
          dropdownIndicator: () => 'text-secondary-500 h-4 w-4',
        }}
        onChange={onChange}
      />
      {formErrors && Object.keys(formErrors).findIndex(key => key === 'optionValueId') > -1 && !defaultValue && (
        <span className='text-sm text-additional-red'>Please select an option</span>
      )}
      {error && <span className='text-sm text-additional-red'>{error}</span>}
    </div>
  );
};
