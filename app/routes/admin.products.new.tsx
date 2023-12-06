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
import type { Coordinates, CropperRef, CropperState, DefaultSettings } from 'react-advanced-cropper';
import { Cropper, getTransformedImageSize, retrieveSizeRestrictions } from 'react-advanced-cropper';
import type { DataFunctionArgs, LinksFunction, LoaderFunction } from '@remix-run/node';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/custom/dropdown-menu';
import type { DropzoneOptions, FileRejection } from 'react-dropzone';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { createProduct, getAllCategories, getAllTags, getOptions } from '~/services/products.server';
import { json, redirect } from '@remix-run/node';
import { useActionData, useBlocker, useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

import type { AddProduct } from '~/common/productSchema';
import { Button } from '~/components/ui/button';
import { FormInput } from '~/components/ui/custom/FormInput';
import { FormTextarea } from '~/components/ui/custom/FormTextarea';
import { ProductOptionSelect } from '~/components/ui/custom/ProductOptionSelect';
import { Switch } from '~/components/ui/switch';
import { TagsSelect } from '~/components/ui/custom/TagsSelect';
import dashedBorderCSS from '~/styles/dashed-border.css';
import { productSchema } from '~/common/productSchema';
import reactCroperAdditional from '~/styles/react-advanced-cropper.css';
import reactCroperCSS from 'react-advanced-cropper/dist/style.css';
import reactCroperTheme from 'react-advanced-cropper/dist/themes/corners.css';
import { useDropzone } from 'react-dropzone-esm';
import { withZod } from '@remix-validated-form/with-zod';

type ProductVariants = {
  [key: string]: string | number | undefined;
};

export type FormErrors = {
  [key: string]: boolean;
};

const validator = withZod(productSchema);

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: reactCroperCSS },
    { rel: 'stylesheet', href: reactCroperTheme },
    { rel: 'stylesheet', href: reactCroperAdditional },
    { rel: 'stylesheet', href: dashedBorderCSS },
  ];
};

export const loader: LoaderFunction = async () => {
  const categories = await getAllCategories();
  const tags = await getAllTags();
  const options = await getOptions();
  return json({ categories, tags, options });
};

export const action = async ({ request }: DataFunctionArgs) => {
  const formData = await request.formData();
  const fieldValues = (await validator.validate(formData)) || { data: {} };

  if (fieldValues.error) return validationError(fieldValues.error);

  console.log('fieldValues: ', fieldValues.data);
  const tagIds = formData.getAll('tagIds');
  const imagesData = formData.getAll('images');
  // const productVariants = JSON.parse(formData.get('productVariants') as string);
  console.log('productVariants: ', JSON.stringify(formData.get('productVariants')));

  console.log('images: ', imagesData.length);

  const createdProduct = await createProduct(fieldValues.data, imagesData, tagIds);
  // console.log('createdProduct: ', createdProduct);
  if (!createdProduct) throw new Error('Something went wrong');

  return redirect('/admin/products?status=draft');
};

export default function AddNewProduct() {
  const navigation = useNavigation();
  const cropperRef = useRef<CropperRef>(null);

  const [coverSrc, setCoverSrc] = useState<string | null | undefined>(null);
  const [image, setImage] = useState<string | null | undefined>(undefined);
  const [files, setFiles] = useState<string[]>([]);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [dropZoneErrors, setDropZoneErrors] = useState<string[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariants[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { tags, options } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const defaultValues: AddProduct = {
    categoryId: 1,
    title: '',
    description: 'Cubes test description',
    cover: '',
    conditions: '12 months at -18°C',
    callories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    tagIds: [],
    productVariants: [
      {
        name: '',
        price: 0,
        sku: '',
        quantity: 0,
        optionValueId: 0,
      },
    ],
  };

  useEffect(() => {
    if (coverSrc) {
      const img = new Image();
      img.src = coverSrc as string;
      img.onload = () => {
        setImgElement(img);
      };
    }
  }, [coverSrc]);

  useEffect(() => {
    if (!coverSrc && image) {
      setCoverSrc(image);
    }
  }, [image, coverSrc]);

  useEffect(() => {
    image && setFormErrors((prevState: FormErrors) => ({ ...prevState, cover: false }));
  }, [image]);

  useEffect(() => {
    productVariants.length > 0 && setFormErrors((prevState: FormErrors) => ({ ...prevState, productVariants: false }));
  }, [productVariants]);

  useEffect(() => {
    productVariants.every(variant => variant.optionValueId) &&
      setFormErrors((prevState: FormErrors) => ({ ...prevState, optionValueId: false }));
  }, [productVariants]);

  useEffect(() => {
    productVariants.every(variant => variant.name) &&
      setFormErrors((prevState: FormErrors) => ({ ...prevState, optionName: false }));
  }, [productVariants]);

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  const defaultSize = ({ imageSize, visibleArea }: CropperState) => {
    return {
      width: (visibleArea || imageSize).width,
      height: (visibleArea || imageSize).height,
    };
  };
  const percentsRestriction = (state: CropperState, settings: DefaultSettings) => {
    const { maxWidth, maxHeight } = retrieveSizeRestrictions(settings);

    const imageSize = getTransformedImageSize(state);

    return {
      minWidth: (20 / 100) * imageSize.width,
      minHeight: (20 / 100) * imageSize.height,
      maxWidth: (maxWidth / 100) * imageSize.width,
      maxHeight: (maxHeight / 100) * imageSize.height,
    };
  };

  const resetCoordinates = () => {
    setCoordinates(null);
    imgElement &&
      (imgElement.width > imgElement.height
        ? cropperRef.current &&
          cropperRef.current.setCoordinates({
            width: imgElement.width,
            height: imgElement.height,
            left: imgElement ? imgElement.width / 2 - imgElement.height / 2 : 0,
            top: 0,
          })
        : cropperRef.current &&
          cropperRef.current.setCoordinates({
            width: imgElement.height,
            height: imgElement.width,
            left: 0,
            top: imgElement ? imgElement.height / 2 - imgElement.width / 2 : 0,
          }));
  };
  const onChangeCoverImage = (file: File) => {
    toBase64(file).then(base64 => {
      setCoverSrc(base64 as string);
      setImage(base64 as string);
    });
    resetCoordinates();
  };
  const onCrop = () => {
    if (cropperRef.current) {
      setCoordinates(cropperRef.current.getCoordinates());
      setImage(cropperRef.current.getCanvas()?.toDataURL() as string);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 5_000_000,
    // maxFiles: 4,
    onDropRejected: filesRejected => {
      console.log('onDropRejected');
      console.log(filesRejected);
      const errors = new Set<string>(
        filesRejected
          .map(file => file.errors)
          .flat()
          .map(error => error.message)
      );
      setDropZoneErrors(Array.from(errors));
      console.log('dropZoneErrors: ', dropZoneErrors);
    },
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      console.log('rejectedFiles: ', fileRejections);
      !fileRejections.length && setDropZoneErrors([]);
      acceptedFiles.forEach((file: File) => {
        toBase64(file).then(base64 => {
          setFiles(prev => (prev.includes(base64 as string) ? prev : [...prev, base64 as string]));
        });
      });
    },
  } as DropzoneOptions);

  const addProductVariant = () => {
    setProductVariants(prev => [...prev, { name: '', sku: '', price: 0, quantity: 0, optionValueId: undefined }]);
  };

  const removeProductVariant = (index: number) => {
    setProductVariants(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateProductVariant = (index: number) => {
    setProductVariants(prev => [...prev, prev[index]]);
  };
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (productVariants.length !== 0 || files || image) && currentLocation.pathname !== nextLocation.pathname
  );

  return (
    <div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <h1 className='mb-8 text-2xl font-bold'>Add New Product</h1>
      <ValidatedForm key='addProduct' method='POST' validator={validator} defaultValues={defaultValues}>
        <input type='hidden' name='categoryId' value={defaultValues.categoryId} />
        <input type='hidden' name='productStatus' value='draft' />
        <input type='hidden' name='rating' value='0' />
        <input type='hidden' name='numReviews' value='0' />
        {image && <input type='hidden' name='cover' value={image} />}
        {files && files.map((file, i) => <input key={i} type='hidden' name='images' value={file} />)}
        {/* <input type='hidden' id='productVariants' name='productVariants' value={JSON.stringify(productVariants)} /> */}
        {/* {selectedTags && selectedTags.map((tag, i) => <input key={i} type='hidden' name='tagIds' value={tag} />)} */}
        <div className='flex items-start w-full space-x-12'>
          <div className='w-3/5 space-y-8'>
            <FormInput type='text' name='title' id='title' label='Title' />
            <FormTextarea className='mb-4' name='description' id='description' label='Description' />
            <section>
              <div className='flex items-center justify-between w-full mb-2 '>
                <h2
                  className={`text-lg font-bold ${formErrors.productVariants && '!text-additional-red animate-shake'}`}
                >
                  Product Variants ({productVariants.length})
                </h2>
                <button
                  type='button'
                  onClick={addProductVariant}
                  className='flex items-center justify-center text-2xl text-white rounded-full w-9 h-9 bg-secondary-500'
                >
                  +
                </button>
              </div>
              {productVariants.length > 0 &&
                (console.log('productVariants: ', productVariants[0]),
                (
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
                                    <AlertDialogDescription>
                                      This action cannot be undone. Are you sure?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => removeProductVariant(i)}>
                                      Continue
                                    </AlertDialogAction>
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
                                  // defaultValue={value as string}
                                  // value={key in productVariants[i][key] ? productVariants[i][key] : ''}
                                  value={productVariants[i][key]}
                                  onChange={e => {
                                    setProductVariants(prev =>
                                      prev.map((v, j) =>
                                        i === j
                                          ? {
                                              ...v,
                                              [key]:
                                                typeof value === 'string' ? e.target.value : Number(e.target.value),
                                            }
                                          : v
                                      )
                                    );
                                  }}
                                />
                              )
                            )}
                            {options &&
                              options.length > 0 &&
                              options.map((option: any) => (
                                <div key={option.id}>
                                  <ProductOptionSelect
                                    label={option.name}
                                    aria-labelledby='option-label'
                                    name={`productVariants[${i}].optionValueId`}
                                    options={option.optionValues}
                                    defaultValue={option.optionValues.find((o: any) => o.id === variant.optionValueId)}
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
                ))}
            </section>
            <div className='space-y-4'>
              <FormInput type='text' name='conditions' label='Characteristics' sublabel='Shelf life and conditions' />
              <div className='flex items-center space-x-4'>
                <FormInput type='number' name='callories' sublabel='Callories' />
                <FormInput type='number' name='protein' sublabel='Protein' />
                <FormInput type='number' name='fat' sublabel='Fat' />
                <FormInput type='number' name='carbs' sublabel='Carbs' />
              </div>
              {/* <input type='hidden' name='tagIds' value={Array.from(tags).map(tag => tag.id.toString())} /> */}
              <TagsSelect tags={tags} name='tagIds' label='Tags' />
            </div>
            <label htmlFor='freeDelivery' className='flex items-center justify-between'>
              <p>Free Delivery</p>
              <Switch id='freeDelivery' name='freeDelivery' />
            </label>
            <div className='flex space-x-4'>
              <Button
                type='submit'
                className='disabled:cursor-not-allowed disabled:opacity-50'
                disabled={navigation.state !== 'idle'}
                onClick={e => {
                  if (!image || !productVariants.length || !productVariants.every(variant => variant.optionValueId)) {
                    e.preventDefault();
                    !image && setFormErrors(prev => ({ ...prev, cover: true }));
                    !productVariants.length && setFormErrors(prev => ({ ...prev, productVariants: true }));
                    !productVariants.every(variant => variant.optionValueId) &&
                      setFormErrors(prev => ({ ...prev, productVariants: true, optionValueId: true }));
                  }
                }}
              >
                Add Product
              </Button>
              <Button type='button' variant='secondary' onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </div>
          <div className='w-2/5'>
            <h2 className='mb-4 font-bold'>Product Cover</h2>
            <div className='space-y-3'>
              <div className='relative bg-[#F6F4EF] rounded-2xl w-full h-full flex items-center justify-center'>
                <Dialog>
                  {image ? (
                    <img className='relative object-cover w-full aspect-square rounded-xl' src={image} alt='' />
                  ) : (
                    <>
                      <label
                        htmlFor='image'
                        className={`flex items-center justify-center w-full cursor-pointer text-3xl text-secondary-500 h-full aspect-square transition-all duration-500 ${
                          formErrors.cover && '!text-additional-red animate-shake'
                        }`}
                      >
                        Upload cover please
                      </label>
                    </>
                  )}
                  {image ? (
                    <div className='absolute bottom-2 right-2'>
                      <input
                        className='hidden'
                        type='file'
                        name='cover-change'
                        id='image-change'
                        onChange={e => e.target.files?.[0] && onChangeCoverImage(e.target.files[0] as File)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type='button'
                            className='flex items-center justify-center p-2 rounded-full w-9 h-9 bg-secondary-500'
                          >
                            <img src='/static/assets/icons/pencilWhite.svg' alt='' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='!min-w-fit'>
                          <DropdownMenuItem>
                            <DialogTrigger className='w-full text-right cursor-pointer'>Edit</DialogTrigger>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <label htmlFor='image-change'>Replace</label>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <label
                      className='absolute flex items-center justify-center p-2 text-2xl text-white rounded-full cursor-pointer w-9 h-9 bg-secondary-500 bottom-2 right-2'
                      htmlFor='image'
                    >
                      <input
                        className='hidden'
                        type='file'
                        name='image'
                        id='image'
                        accept='image/png, image/jpeg, image/webp'
                        onChange={e => {
                          toBase64(e.target.files?.[0] as File).then(base64 => {
                            setImage(base64 as string);
                          });
                        }}
                      />
                      +
                    </label>
                  )}
                  <DialogContent
                    className='
                          min-w-0 w-fit max-w-[1000px] h-fit  p-0 !block gap-0 shadow-none border-input rounded-2xl bg-[#F6F4EF]
                          data-[state=closed]:zoom-in-100 data-[state=open]:zoom-in-100'
                  >
                    <Cropper
                      ref={cropperRef}
                      src={coverSrc}
                      defaultSize={defaultSize}
                      defaultCoordinates={coordinates}
                      className={'cropper p-16 rounded-t-xl w-fit max-w-[1000px] h-[80vh] m-0'}
                      backgroundClassName='bg-gray-100 [color:#F6F4EF]'
                      stencilProps={{
                        handlers: true,
                        lines: true,
                        movable: true,
                        resizable: true,
                        zoomable: false,
                        aspectRatio: 1 / 1,
                        overlayClassName: '[color:#F6F4EF] ',
                        lineWrapperClassNames: {
                          default: '[&>div>div]:border-[#a59280]',
                        },
                        handlerClassNames: {
                          default: '!border-[4px] z-50',
                          // hover: 'handler--hover',
                          eastNorth: 'translate-x-[3px] translate-y-[-3px]',
                          north: '!w-[36px] !h-[4px] translate-y-[-2px] !opacity-100',
                          westNorth: 'translate-x-[-3px] translate-y-[-3px]',
                          west: '!w-[4px] !h-[36px] translate-x-[-2px] !opacity-100',
                          westSouth: 'translate-x-[-3px] translate-y-[3px]',
                          south: '!w-[36px] !h-[4px] translate-y-[2px] !opacity-100',
                          eastSouth: 'translate-x-[3px] translate-y-[3px]',
                          east: '!w-[4px] !h-[36px] translate-x-[2px] !opacity-100',
                        },
                      }}
                      backgroundWrapperProps={{
                        scaleImage: true,
                        moveImage: true,
                      }}
                      sizeRestrictions={percentsRestriction}
                      // onChange={onChange}
                    />
                    <div className='flex items-center justify-between p-4 border-t bg-background border-secondary-300 rounded-b-xl'>
                      <Button variant='outline' onClick={resetCoordinates}>
                        Reset
                      </Button>
                      <div className='flex space-x-4'>
                        <DialogClose asChild>
                          <Button type='button' variant='secondary'>
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={onCrop}>Confirm</Button>
                        </DialogClose>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <section className='w-full'>
                <h2 className='mb-4 font-bold'>Gallery</h2>
                <div id='dropzone' className='dropzone' {...getRootProps()}>
                  <div className='flex items-center justify-center w-full'>
                    <label
                      htmlFor='images'
                      className='flex flex-col items-center justify-center w-full py-8 px-4 border-2 
                        bg-[url("/static/assets/dashed-border.svg")] border-none shadow-none rounded-lg cursor-pointer dark:hover:bg-bray-800 
                      dark:bg-gray-700 hover:bg-secondary-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <img className='mx-auto mb-6' src='/static/assets/icons/upload.svg' alt='' />
                        <p className='mb-2 text-secondary-500 dark:text-secondary-500'>
                          {isDragActive ? 'Drop it!' : 'Click to upload or drag and drop'}
                        </p>
                        <p className='font-semibold text-secondary-500 dark:text-secondary-500'>SVG, PNG, JPG</p>
                      </div>
                      <input name='images' className='hidden' {...getInputProps()} />
                      {dropZoneErrors && (
                        <ul className='w-full pl-4 mt-4 text-sm text-additional-red dark:text-additional-red'>
                          {dropZoneErrors.map(error => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </label>
                  </div>
                </div>
                <div className='grid w-full grid-cols-3 gap-4 mt-4 grid-container'>
                  {files.map(file => (
                    <div
                      key={file}
                      className='relative p-2.5 flex items-center justify-center rounded-lg
                       bg-secondary-100 [&>div.trash]:hover:opacity-100 aspect-square w-full h-auto'
                    >
                      <div
                        className='trash absolute right-[5px] top-[3px] cursor-pointer opacity-0'
                        onClick={() => setFiles(prev => prev.filter(f => f !== file))}
                      >
                        <img className='z-10 w-6 h-6' src='/static/assets/icons/trash.svg' alt='' />
                      </div>
                      <img className='max-w-24 max-h-24 rounded-sm bg-[#F6F4EF]' src={file} alt='' />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
        <AlertDialog open={blocker.state === 'blocked'}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>You have unsaved changes. Are you sure?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => blocker.state === 'blocked' && blocker.reset()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => blocker.state === 'blocked' && blocker.proceed()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ValidatedForm>
    </div>
  );
}
