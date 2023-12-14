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

import type { EditProduct } from '~/common/productSchema';
import type { FormErrors } from '~/routes/admin.products._index';
import { FormInput } from '~/components/ui/custom/FormInput';
import { ProductOptionSelect } from '~/components/ui/custom/ProductOptionSelect';
import { toBase64 } from '~/lib/utils';
import { useDropzone } from 'react-dropzone-esm';

export default function ProductVariants({
  options,
  formErrors,
  productVariants,
  setProductVariants,
  productVariantsImages,
  setProductVariantsImages,
  duplicateProductVariant,
  removeProductVariant,
  images,
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
  productVariantsImages: object[];
  setProductVariantsImages: React.Dispatch<React.SetStateAction<object[]>>;
  productVariants: EditProduct['productVariants'];
  setProductVariants: React.Dispatch<React.SetStateAction<EditProduct['productVariants']>>;
  duplicateProductVariant: (index: number) => void;
  removeProductVariant: (index: number) => void;
  images: {
    productVariantId: number;
    imageUrl: string;
    imagePublicId: string;
  };
}) {
  return (
    <>
      {productVariants.map((variant, i) => (
        <div key={i} className='flex flex-col gap-4 pt-8'>
          <div className='border rounded-lg border-secondary-100'>
            <header className='flex items-center justify-between px-4 py-2 border-b rounded-t-lg bg-secondary-50 border-secondary-100'>
              <h3 className='text-lg'>{variant.name || 'Variant ' + (i + 1)}</h3>
              <div className='flex items-center space-x-2'>
                <button type='button' onClick={() => duplicateProductVariant(i)}>
                  <img src='/static/assets/icons/duplicate-secondary.svg' alt='' />
                </button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <button type='button' className='py-1'>
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
            </header>
            <div className='grid grid-cols-3 gap-4 p-4'>
              {Object.entries(variant)
                .filter(([key]) => key !== 'image')
                .map(([key, value]) =>
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
                  <ProductOptionSelect
                    key={option.id}
                    sublabel={option.name}
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
                ))}
            </div>
            <Dropzone
              variantIndex={i}
              productVariantsImages={productVariantsImages}
              setProductVariantsImages={setProductVariantsImages}
              images={images}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function Dropzone({ productVariantsImages, setProductVariantsImages, variantIndex }: any) {
  const { getRootProps, getInputProps } = useDropzone({
    // acceptedFiles: '',
    noClick: false,
    noKeyboard: true,
    multiple: true,
    maxFiles: 5,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/jpg': [],
      'image/gif': [],
      'image/webp': [],
    },
    onDrop: acceptedFiles => {
      acceptedFiles.forEach((file: File) => {
        toBase64(file).then(base64 => {
          setProductVariantsImages((prev: any) => {
            return [
              ...prev.slice(0, variantIndex),
              {
                ...prev[variantIndex],
                images:
                  prev[variantIndex].images.length < 5
                    ? [...prev[variantIndex].images, base64]
                    : prev[variantIndex].images,
              },
              ...prev.slice(variantIndex + 1, prev.length),
            ];
          });
        });
      });
    },
  });
  return (
    <section className='p-4 pt-0'>
      <label className='text-sm mb-2.5 block capitalize'>Images (max 5)</label>
      <div className='flex items-center gap-4'>
        {productVariantsImages[variantIndex]?.images?.length > 0 &&
          productVariantsImages[variantIndex]?.images?.map((image: any, i: number) => (
            <div
              key={i}
              className='relative flex items-center justify-center rounded-lg bg-secondary-50 [&>button.trash]:hover:opacity-100 aspect-square w-20 h-20'
            >
              <button
                type='button'
                className='trash absolute -right-3 -top-3 cursor-pointer opacity-0 bg-secondary-500 rounded-full p-1.5 transition-opacity'
                onClick={() => {
                  setProductVariantsImages((prev: any) => {
                    return [
                      ...prev.slice(0, variantIndex),
                      { ...prev[variantIndex], images: prev[variantIndex].images.filter((_, j) => j !== i) },
                      ...prev.slice(variantIndex + 1, prev.length),
                    ];
                  });
                }}
              >
                <img className='z-10 w-4 h-4' src='/static/assets/icons/trash-white.svg' alt='' />
              </button>
              <img className='object-cover rounded-lg' width='80px' height='80px' src={image} alt='' />
            </div>
          ))}
        {productVariantsImages[variantIndex]?.images?.length < 5 && (
          <div id='dropzone' className='dropzone' {...getRootProps()}>
            <div className='w-20 h-20'>
              <label
                htmlFor={'productVariants[' + [variantIndex] + '].image'}
                className='flex flex-col items-center justify-center w-full h-full transition-colors duration-300
              bg-[url("/static/assets/dashed-border.svg")] border-none shadow-none rounded-lg cursor-pointer dark:hover:bg-bray-800 
              dark:bg-gray-700 hover:bg-secondary-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
              >
                <div className='flex items-center justify-center text-lg font-semibold text-secondary-300'>+</div>
                <input name={'productVariants[' + [variantIndex] + '].image'} className='hidden' {...getInputProps()} />
              </label>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
