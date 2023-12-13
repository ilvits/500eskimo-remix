import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import type { Coordinates, CropperRef, CropperState, DefaultSettings } from 'react-advanced-cropper';
import { Cropper, getTransformedImageSize, retrieveSizeRestrictions } from 'react-advanced-cropper';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/custom/dropdown-menu';
import type { DropzoneOptions, FileRejection } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useBlocker, useLoaderData, useNavigation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '~/components/ui/button';
import type { EditProduct } from '~/common/productSchema';
import { FormErrors } from '~/routes/admin.products._index';
import { FormInput } from '~/components/ui/custom/FormInput';
import { FormTextarea } from '~/components/ui/custom/FormTextarea';
import { PiSpinnerLight } from 'react-icons/pi/index.js';
import ProductVariants from './ProductVariants';
import { ProductVariantsStatus } from '@prisma/client';
import { Switch } from '~/components/ui/switch';
import { TagsSelect } from '~/components/ui/custom/TagsSelect';
import { ValidatedForm } from 'remix-validated-form';
import { editProductSchema } from '~/common/productSchema';
import type { loader } from '~/routes/admin.products.$productId.edit';
import { useDropzone } from 'react-dropzone-esm';
import { withZod } from '@remix-validated-form/with-zod';

interface ProductVariantWithOptionValue extends EditProduct {
  productVariants: {
    id: number;
    name: string;
    SKU: string;
    price: number;
    quantity: number;
    optionValueId: number;
    optionValue: {
      id: number;
      value: string;
      unit: string;
    };
    status: ProductVariantsStatus;
  }[];
}

const validator = withZod(editProductSchema);

export default function AdminEditProductLayout() {
  const navigation = useNavigation();
  const cropperRef = useRef<CropperRef>(null);

  const [cover, setCover] = useState<string | null | undefined>(undefined);
  const [coverSrc, setCoverSrc] = useState<string | null | undefined>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [dropZoneErrors, setDropZoneErrors] = useState<string[]>([]);
  const [productVariants, setProductVariants] = useState<EditProduct['productVariants']>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { tags, options, product } = useLoaderData<typeof loader>();

  const defaultValues: EditProduct = product
    ? product
    : {
        cover: '',
        title: '',
        description: '',
        conditions: '',
        callories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        tagIds: [],
        freeDelivery: false,
        productVariants: [
          {
            id: 0,
            name: '',
            price: 0,
            SKU: '',
            quantity: 0,
            optionValueId: 0,
          },
        ],
      };

  useEffect(() => {
    product?.cover &&
      fetch(product.cover)
        .then(res => res.blob() as Promise<Blob>)
        .then(blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          return new Promise(resolve => {
            reader.onload = () => {
              resolve(reader.result);
              setCover(reader.result as string);
            };
            reader.onerror = error => {
              console.error(error);
            };
          });
        });
    product?.productImages &&
      product.productImages.map(async (image: { imageUrl: string }) => {
        const data = await fetch(image.imageUrl).then(res => res.arrayBuffer());
        const blob = new Blob([data], { type: 'image/webp' });
        const base64 = (await toBase64(blob)) as string;
        setFiles(prevState => (prevState.includes(base64) ? prevState : prevState.concat(base64)));
      });
    product?.productVariants &&
      setProductVariants(
        product.productVariants.map((variant: ProductVariantWithOptionValue['productVariants'][0]) => {
          return {
            id: variant.id,
            name: variant.name,
            SKU: variant.SKU,
            price: Number(variant.price),
            quantity: Number(variant.quantity),
            optionValueId: Number(variant.optionValue.id),
            status: variant.status,
          };
        }) || []
      );
  }, [product]);

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
    if (!coverSrc && cover) {
      setCoverSrc(cover);
    }
  }, [cover, coverSrc]);

  useEffect(() => {
    cover && setFormErrors((prevState: FormErrors) => ({ ...prevState, cover: false }));
  }, [cover]);

  useEffect(() => {
    productVariants.length > 0 && setFormErrors((prevState: FormErrors) => ({ ...prevState, productVariants: false }));
    productVariants.every(variant => variant.optionValueId) &&
      setFormErrors((prevState: FormErrors) => ({ ...prevState, optionValueId: false }));
    productVariants.every(variant => variant.name) &&
      setFormErrors((prevState: FormErrors) => ({ ...prevState, optionName: false }));
  }, [productVariants]);

  const toBase64 = (file: File | Blob): Promise<string | ArrayBuffer | null> =>
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
      setCover(base64 as string);
    });
    resetCoordinates();
  };
  const onCrop = () => {
    if (cropperRef.current) {
      setCoordinates(cropperRef.current.getCoordinates());
      setCover(cropperRef.current.getCanvas()?.toDataURL() as string);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
    },
    maxSize: 5_000_000,
    maxFiles: 10,
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
    setProductVariants(prev => [
      ...prev,
      { name: '', SKU: '', price: 0, quantity: 0, optionValueId: NaN, status: 'PUBLISHED' },
    ]);
  };

  const removeProductVariant = (index: number) => {
    setProductVariants(prev => prev.filter((_, i) => i !== index));
  };

  const duplicateProductVariant = (index: number) => {
    setProductVariants(prev => [
      ...prev.slice(0, index + 1),
      {
        name: prev[index].name + ' copy',
        SKU: prev[index].SKU,
        price: prev[index].price,
        quantity: prev[index].quantity,
        optionValueId: prev[index].optionValueId,
        status: 'PUBLISHED',
      },
      ...prev.slice(index + 1, prev.length),
    ]);
  };
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (productVariants.length !== 0 || files || cover) && currentLocation.pathname !== nextLocation.pathname
  );

  return (
    <div>
      <h1 className='mb-8 text-2xl font-bold'>
        {product?.title} ({product?.category.name})
      </h1>
      <ValidatedForm key='addProduct' method='POST' validator={validator} defaultValues={defaultValues}>
        <input type='hidden' name='id' value={product?.id} />
        <input type='hidden' name='categorySlug' value={product?.category.slug} />
        <input type='hidden' name='productStatus' value='DRAFT' />
        <input type='hidden' name='rating' value='0' />
        <input type='hidden' name='numReviews' value='0' />
        {/* //TODO: Rename cover_public_id to coverPublicId in db */}
        <input type='hidden' name='coverPublicId' value={product?.cover_public_id} />
        {cover && <input type='hidden' name='cover' value={cover} />}
        {files && files.map((file, i) => <input key={i} type='hidden' name='images' value={file} />)}
        <div className='flex items-start w-full space-x-12'>
          <div className='w-3/5 space-y-8'>
            <FormInput type='text' name='title' id='title' label='Title' />
            <FormTextarea className='mb-4' name='description' id='description' label='Description' />
            {/* List of Product Variants */}
            <section>
              <Tabs defaultValue='PUBLISHED'>
                <div className='flex items-center justify-between w-full mb-2 '>
                  <h2
                    className={`text-lg font-bold ${
                      formErrors.productVariants && '!text-additional-red animate-shake'
                    }`}
                  >
                    Packaging Option
                  </h2>
                  <button
                    type='button'
                    onClick={addProductVariant}
                    className='flex items-center justify-center text-2xl text-white rounded-full w-9 h-9 bg-primary'
                  >
                    +
                  </button>
                </div>
                <TabsList>
                  {Object.keys(ProductVariantsStatus).map(status => (
                    <TabsTrigger
                      key={status}
                      value={status}
                      className='px-6 border rounded-full h-9 border-secondary-200 text-primary-brown bg-background data-[state=active]:border-secondary-100 data-[state=active]:bg-secondary-100 capitalize'
                    >
                      {status.toLowerCase()}
                      {productVariants.filter(productVariant => productVariant.status === status).length > 0 &&
                        ' (' + productVariants.filter(productVariant => productVariant.status === status).length + ')'}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.keys(ProductVariantsStatus).map((status, i) => (
                  <>
                    <TabsContent key={status} value={status}>
                      <ProductVariants
                        options={options}
                        formErrors={formErrors}
                        productVariants={
                          productVariants
                            .filter(productVariant => productVariant.status === status)
                            .map(variant => {
                              return {
                                id: variant.id,
                                name: variant.name,
                                SKU: variant.SKU,
                                price: variant.price,
                                quantity: variant.quantity,
                                optionValueId: variant.optionValueId,
                              };
                            }) as any
                        }
                        setProductVariants={setProductVariants}
                        duplicateProductVariant={duplicateProductVariant}
                        removeProductVariant={removeProductVariant}
                      />
                    </TabsContent>
                  </>
                ))}
              </Tabs>
            </section>
            {/* Characteristics */}
            <div className='space-y-4'>
              <FormInput type='text' name='conditions' label='Characteristics' sublabel='Shelf life and conditions' />
              <div className='flex items-center space-x-4'>
                <FormInput type='number' name='callories' sublabel='Callories' />
                <FormInput type='number' name='protein' sublabel='Protein' />
                <FormInput type='number' name='fat' sublabel='Fat' />
                <FormInput type='number' name='carbs' sublabel='Carbs' />
              </div>
              <TagsSelect tags={tags} name='tagIds' label='Tags' selectedTags={product.tagIds} />
            </div>
            {/* Free Delivery */}
            <label htmlFor='freeDelivery' className='flex items-center justify-between'>
              <p>Free Delivery</p>
              <Switch id='freeDelivery' name='freeDelivery' defaultChecked={product.freeDelivery} />
            </label>
            {/* Submit buttons */}
            <div className='relative flex space-x-4'>
              <Button
                type='submit'
                className='disabled:cursor-not-allowed disabled:opacity-50'
                disabled={navigation.state !== 'idle'}
                onClick={e => {
                  if (!cover || !productVariants.length || !productVariants.every(variant => variant.optionValueId)) {
                    e.preventDefault();
                    !cover && setFormErrors(prev => ({ ...prev, cover: true }));
                    !productVariants.length && setFormErrors(prev => ({ ...prev, productVariants: true }));
                    !productVariants.every(variant => variant.optionValueId) &&
                      setFormErrors(prev => ({ ...prev, productVariants: true, optionValueId: true }));
                  }
                }}
              >
                Update
              </Button>
              <PiSpinnerLight
                aria-hidden
                hidden={navigation.state === 'idle'}
                className='absolute w-6 h-6 -left-1.5 fill-background animate-spin top-2'
              />
              <Button
                type='button'
                variant='outline'
                className='disabled:cursor-not-allowed disabled:opacity-50'
                disabled={navigation.state !== 'idle'}
                onClick={() => {
                  window.history.back();
                }}
              >
                Delete
              </Button>
              <Button
                type='button'
                variant='secondary'
                className='disabled:cursor-not-allowed disabled:opacity-50'
                disabled={navigation.state !== 'idle'}
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
          {/* Product Cover & Images */}
          <div className='w-2/5'>
            <h2 className='mb-4 font-bold'>Product Cover</h2>
            <div className='space-y-3'>
              <div className='relative bg-[#F6F4EF] rounded-2xl w-full h-full flex items-center justify-center'>
                <Dialog>
                  {cover ? (
                    <img className='relative object-cover w-full aspect-square rounded-xl' src={cover} alt='' />
                  ) : (
                    <>
                      <label
                        htmlFor='image'
                        className={`flex items-center justify-center w-full cursor-pointer text-3xl text-secondary-500 h-full aspect-square transition-all duration-500 ${
                          formErrors.cover && '!text-additional-red animate-shake'
                        }`}
                      >
                        {navigation.state !== 'idle' ? <div>Loading...</div> : null}
                      </label>
                    </>
                  )}
                  {cover ? (
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
                            <label htmlFor='image-change' className='w-full text-right cursor-pointer'>
                              Replace
                            </label>
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
                            setCover(base64 as string);
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
                      className='flex flex-col items-center justify-center w-full py-8 px-4 border-2 transition-colors duration-300
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
                      {dropZoneErrors.length > 0 && (
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
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className='relative flex items-center justify-center rounded-lg
                       bg-secondary-50 [&>div.trash]:hover:opacity-100 aspect-square w-auto h-auto'
                    >
                      <div
                        className='trash absolute -right-3 -top-3  cursor-pointer opacity-0 bg-secondary-500 rounded-full p-1.5 transition-opacity'
                        onClick={() => setFiles(prev => prev.filter(f => f !== file))}
                      >
                        <img className='z-10 w-6 h-6' src='/static/assets/icons/trash-white.svg' alt='' />
                      </div>
                      <img className='rounded-sm bg-[#F6F4EF]' src={file} alt='' />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
        {/* Leaving page dialog */}
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
