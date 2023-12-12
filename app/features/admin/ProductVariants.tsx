import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

import type { AddProduct } from '~/common/productSchema';
import type { FormErrors } from './AdminNewProductLayout';
import { FormInput } from '~/components/ui/custom/FormInput';
import { ProductOptionSelect } from '~/components/ui/custom/ProductOptionSelect';

export default function ProductVariants({
  options,
  formErrors,
  productVariants,
  setProductVariants,
  duplicateProductVariant,
  removeProductVariant,
}: {
  options: {
    id: number;
    name: string;
    optionValues: {
      id: number;
      value: string;
      unit: string;
    }[];
  }[];
  formErrors: FormErrors;
  productVariants: AddProduct['productVariants'];
  setProductVariants: React.Dispatch<React.SetStateAction<AddProduct['productVariants']>>;
  duplicateProductVariant: (index: number) => void;
  removeProductVariant: (index: number) => void;
}) {
  return (
    <div className='flex flex-col gap-4 pt-4 border-t border-primary-brown'>
      {productVariants.map((variant, i) => (
        <div key={i}>
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-bold'>{variant.name || 'Variant ' + (i + 1)}</h3>
              <div className='flex items-center space-x-2'>
                <button type='button' onClick={() => duplicateProductVariant(i)}>
                  <img src='/static/assets/icons/duplicate.svg' alt='' />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button type='button'>
                      <img src='/static/assets/icons/trash-red.svg' alt='' />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone. Are you sure?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => removeProductVariant(i)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {Object.entries(variant).map(([key, value]) =>
                key === 'optionValueId' ? null : (
                  <FormInput
                    key={key}
                    type={typeof value}
                    name={`productVariants[${i}].${key}`}
                    sublabel={key}
                    value={productVariants[i][key]}
                    onChange={e => {
                      setProductVariants(prev =>
                        prev.map((v, j) =>
                          i === j
                            ? {
                                ...v,
                                [key]: typeof value === 'string' ? e.target.value : Number(e.target.value),
                              }
                            : v
                        )
                      );
                    }}
                  />
                )
              )}
              {options &&
                options.length &&
                options.map(option => (
                  <div key={option.id}>
                    <ProductOptionSelect
                      label={option.name}
                      aria-labelledby='option-label'
                      name={`productVariants[${i}].optionValueId`}
                      options={option.optionValues as any}
                      defaultValue={option.optionValues.find((o: any) => o.id === variant.optionValueId) as any}
                      formErrors={formErrors}
                      onChange={(option: any) => {
                        setProductVariants(prev =>
                          prev.map((v, j) =>
                            i === j
                              ? {
                                  ...v,
                                  optionValueId: Number(option.id),
                                }
                              : v
                          )
                        );
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
