import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useField } from 'remix-validated-form';

type MyInputProps = {
  name: string;
  label: string;
  options: string[];
  defaultValue?: any;
  errors?: object;
  onChange: (option: any) => void;
};

export const ProductOptionSelect = ({ options, name, label, errors, onChange, defaultValue }: MyInputProps) => {
  const { error, getInputProps } = useField(name) as any;

  const animatedComponents = makeAnimated();

  return (
    <div>
      <label id={`${label}-label`} className='font-bold mb-4 block' htmlFor={name}>
        {label}
      </label>
      <Select
        aria-labelledby={`${label}-label`}
        options={options}
        name={`${label}`}
        placeholder={`Choose ${label}...`}
        defaultValue={defaultValue}
        {...getInputProps({ id: name })}
        getOptionLabel={(option: any) => `${option.value} ${option.unit && `(${option.unit})`}`}
        getOptionValue={(option: any) => option.id.toString()}
        isClearable={false}
        // closeMenuOnSelect={false}
        components={animatedComponents}
        unstyled={true}
        styles={{
          option: (styles, { data }: any) => {
            return {
              ...styles,
              '&:hover': { backgroundColor: data.color || '#F8E9CC', color: 'white' },
            };
          },
        }}
        classNamePrefix={'options-select'}
        classNames={{
          control: () => {
            return `px-4 border border-input hover:border-input-hover rounded-lg bg-input-bg text-sm h-11 ${
              errors?.optionValueId && !defaultValue && 'border-red-500'
            }`;
          },
          menu: () => 'bg-input-bg text-sm rounded-lg border border-input hover:border-input-hover mt-1',
          menuList: () => 'space-y-2 p-2',
          option: () => 'p-2 rounded-lg text-foreground text-sm',
          valueContainer: () => 'gap-2',
          dropdownIndicator: () => 'text-secondary-500 h-4 w-4',
        }}
        onChange={onChange}
      />
      {errors?.optionValueId && !defaultValue && (
        <span className='text-sm text-additional-red'>Please select an option</span>
      )}
      {error && <span className='text-sm text-additional-red'>{error}</span>}
    </div>
  );
};
