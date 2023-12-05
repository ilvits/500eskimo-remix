import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useField } from 'remix-validated-form';

type MyInputProps = {
  name: string;
  label: string;
  tags: string[];
};

export const TagsSelect = ({ tags, name, label }: MyInputProps) => {
  const { error, getInputProps } = useField(name) as any;

  const animatedComponents = makeAnimated();

  return (
    <div>
      <label id='tags-label' className='font-bold mb-4 block' htmlFor={name}>
        {label}
      </label>
      <Select
        aria-labelledby='tags-label'
        options={tags}
        name='tagIds'
        isMulti
        placeholder='Choose tags...'
        {...getInputProps({ id: name })}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id.toString()}
        defaultValue={[tags[0], tags[1]]}
        isClearable={false}
        // closeMenuOnSelect={false}
        components={animatedComponents}
        unstyled={true}
        styles={{
          multiValue: (styles, { data }: any) => {
            return {
              ...styles,
              backgroundColor: data.color || '#F8E9CC',
              color: 'white',
            };
          },
          option: (styles, { data }: any) => {
            return {
              ...styles,
              '&:hover': { backgroundColor: data.color || '#F8E9CC', color: 'white' },
            };
          },
        }}
        classNamePrefix={'tags-select'}
        classNames={{
          control: () => 'px-4 border border-input hover:border-input-hover rounded-lg bg-input-bg text-sm h-11',
          menu: () => 'bg-input-bg text-sm rounded-lg border border-input hover:border-input-hover mt-1',
          menuList: () => 'space-y-2 p-2',
          option: () => 'p-2 rounded-lg text-foreground text-sm',
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
