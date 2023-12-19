import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useField } from 'remix-validated-form';

type MyInputProps = {
  name: string;
  label: string;
  options: string[];
  selectedOptions?: string[];
  multiValues?: boolean;
  isSearchable?: boolean;
  placeholder?: string;
};

export const FormSelect = ({
  name,
  label,
  options,
  selectedOptions = [],
  multiValues = false,
  isSearchable = false,
  placeholder = 'Choose ' + label + '...',
}: MyInputProps) => {
  const { error, getInputProps } = useField(name) as any;

  const animatedComponents = makeAnimated();

  return (
    <div>
      <label id={`${name}-label`} className='block mb-4 font-bold' htmlFor={name}>
        {label}
      </label>
      <Select
        aria-labelledby={`${name}-label`}
        options={options}
        name={name}
        inputId={`${name}-input`}
        isMulti={multiValues}
        isSearchable={isSearchable}
        placeholder={placeholder}
        {...getInputProps({ id: name })}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        defaultValue={options.filter((option: any) => selectedOptions.includes(option.id))}
        isClearable={false}
        // closeMenuOnSelect={false}
        components={animatedComponents}
        unstyled={true}
        styles={{
          multiValue: (styles, { data }: any) => {
            return {
              ...styles,
              backgroundColor: data.color || '#F8E9CC',
              color: '#4A2502',
            };
          },
          option: (styles, { data }: any) => {
            return {
              ...styles,
              '&:hover': { backgroundColor: data.color || '#F8E9CC', color: '#4A2502' },
            };
          },
        }}
        classNamePrefix={`${name}-select`}
        classNames={{
          control: () => 'px-4 border border-input hover:border-input-hover rounded-lg bg-input-bg text-sm h-11',
          menu: () => 'bg-input-bg text-sm rounded-lg border border-input hover:border-input-hover mt-1',
          menuList: () => 'space-y-2 p-2',
          option: () => 'p-2 rounded-lg text-foreground text-sm !cursor-pointer',
          valueContainer: () => 'gap-2',
          multiValue: () => 'text-white rounded-full px-2 py-1 text-xs flex items-center',
          multiValueRemove: () => 'h-[10px] w-[10px] ml-1',
          dropdownIndicator: () => 'text-secondary-500 h-4 w-4',
        }}
      />
      {error && <span className='text-sm text-additional-red'>{error}</span>}
    </div>
  );
};
