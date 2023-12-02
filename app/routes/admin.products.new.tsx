import { type AddProduct, productSchema } from '~/common/productSchema';

import { json, redirect, type LoaderFunction, type LinksFunction } from '@remix-run/node';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { useLoaderData } from '@remix-run/react';
import { createProduct, getAllCategories, getAllTags } from '~/services/products.server';
import { FormInput } from '~/components/ui/custom/FormInput';
import { FormTextarea } from '~/components/ui/custom/FormTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/custom/Select';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { type DropzoneOptions, useDropzone, type FileRejection } from 'react-dropzone-esm';
import { Cropper, getTransformedImageSize, retrieveSizeRestrictions } from 'react-advanced-cropper';
import type { Coordinates, CropperRef, CropperState, DefaultSettings } from 'react-advanced-cropper';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '~/components/ui/dialog';

import reactCroperCSS from 'react-advanced-cropper/dist/style.css';
import reactCroperTheme from 'react-advanced-cropper/dist/themes/corners.css';
import reactCroperAdditional from '~/styles/react-advanced-cropper.css';
import dashedBorderCSS from '~/styles/dashed-border.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/custom/dropdown-menu';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: reactCroperCSS },
    { rel: 'stylesheet', href: reactCroperTheme },
    { rel: 'stylesheet', href: reactCroperAdditional },
    { rel: 'stylesheet', href: dashedBorderCSS },
  ];
};

const validator = withZod(productSchema);

export const loader: LoaderFunction = async () => {
  const defaultValues: AddProduct = {
    sku: '',
    title: '',
    description: '',
    price: 0,
    image: '',
    rating: 0,
    stock: 0,
    numReviews: 0,
    categoryId: 2,
  };

  const categories = await getAllCategories();
  const tags = await getAllTags();
  return json({ defaultValues, categories, tags });
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  console.log('formData: ', formData);

  const fieldValues = await validator.validate(formData);
  if (fieldValues.error) return validationError(fieldValues.error);

  const result = await createProduct(fieldValues.data);
  console.log('result: ', result);
  if (!result) throw new Error('Something went wrong');

  return redirect('/admin/products');
};

export default function AddNewProduct() {
  const [src, setSrc] = useState('');
  const [image, setImage] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [dropZoneErrors, setDropZoneErrors] = useState<string[]>([]);
  const { defaultValues, categories } = useLoaderData<typeof loader>();
  const [tags, setTags] = useState<string[]>([]);

  const cropperRef = useRef<CropperRef>(null);

  useEffect(() => {
    if (src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgElement(img);
      };
    }
  }, [src]);

  useEffect(() => {
    if (!src && image) {
      setSrc(image);
    }
  }, [image, src]);

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
    setSrc(URL.createObjectURL(file));
    setImage(URL.createObjectURL(file));
    resetCoordinates();
  };

  const onCrop = () => {
    if (cropperRef.current) {
      setCoordinates(cropperRef.current.getCoordinates());
      // You are able to do different manipulations at a canvas
      // but there we just get a cropped image, that can be used
      // as src for <img/> to preview result
      setImage(cropperRef.current.getCanvas()?.toDataURL() as string);
      console.log('coordinates: ', coordinates);
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
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          setFiles(prev => (prev.includes(reader.result as string) ? prev : [...prev, reader.result as string]));
        };
      });
    },
  } as DropzoneOptions);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-8'>Add New Product</h1>
      <ValidatedForm method='POST' action='/admin/products/new' validator={validator} defaultValues={defaultValues}>
        <div className='flex w-full items-start space-x-12'>
          <div className='w-3/5 space-y-8'>
            <FormInput type='text' name='title' id='title' label='Title' />
            <FormTextarea className='mb-4' name='description' id='description' label='Description' />
            <div>
              <label className='mb-4 font-bold block' htmlFor='categoryId'>
                Category
              </label>
              <Select name='categoryId'>
                <SelectTrigger>
                  <SelectValue placeholder='Choose a category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-4'>
              <FormInput
                id='price'
                type='text'
                name='conditions'
                label='Characteristics'
                sublabel='Shelf life and conditions'
              />
              <div className='space-x-4 flex items-center'>
                <FormInput type='number' name='callories' id='price' sublabel='Callories' />
                <FormInput type='number' name='nutrition' id='price' sublabel='Nutrition' />
                <FormInput type='number' name='fat' id='price' sublabel='Fat' />
                <FormInput type='number' name='carbohydrates' id='price' sublabel='Carbohydrates' />
              </div>
              <FormInput type='text' name='tags' id='tags' sublabel='Tags' />
            </div>
            <label htmlFor='freeDelivery' className='flex items-center justify-between'>
              <p>Free Delivery</p>
              <Switch id='freeDelivery' name='freeDelivery' />
            </label>
            <div className='flex space-x-4'>
              <Button type='submit'>Add Product</Button>
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
                    <img className='relative w-full aspect-square object-cover rounded-xl' src={image} alt='' />
                  ) : (
                    <>
                      <p className='flex items-center justify-center w-full text-3xl text-secondary-500 h-full aspect-square '>
                        Upload cover please
                      </p>
                    </>
                  )}
                  {image ? (
                    <div className='absolute bottom-2 right-2'>
                      <input
                        className='hidden'
                        type='file'
                        name='cover-change'
                        id='cover-change'
                        onChange={e => e.target.files?.[0] && onChangeCoverImage(e.target.files[0] as File)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type='button'
                            className=' w-9 h-9 bg-secondary-500 p-2 rounded-lg flex items-center justify-center'
                          >
                            <img src='/static/assets/icons/pencilWhite.svg' alt='' />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='!min-w-fit'>
                          <DropdownMenuItem>
                            <DialogTrigger className='w-full text-right cursor-pointer'>Edit</DialogTrigger>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <label htmlFor='cover-change'>Replace</label>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <label
                      className='w-9 h-9 bg-secondary-500 text-white p-2 rounded-lg flex items-center justify-center cursor-pointer absolute bottom-2 right-2'
                      htmlFor='cover'
                    >
                      <input
                        className='hidden'
                        type='file'
                        name='cover'
                        id='cover'
                        accept='image/png, image/jpeg, image/webp'
                        onChange={e => {
                          console.log(e.target.files?.[0]);
                          // setSrc(URL.createObjectURL(e.target.files?.[0] as File));
                          setImage(URL.createObjectURL(e.target.files?.[0] as File));
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
                      src={src}
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
                    <div className='p-4 flex items-center justify-between bg-background border-t border-secondary-300 rounded-b-xl'>
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
                        <ul className='w-full mt-4 pl-4 text-sm text-additional-red dark:text-additional-red'>
                          {dropZoneErrors.map(error => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      )}
                    </label>
                  </div>
                </div>
                <div className='grid-container grid grid-cols-3 gap-4 mt-4 w-full'>
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
                        <img className='w-6 h-6 z-10' src='/static/assets/icons/trash.svg' alt='' />
                      </div>
                      <img className='max-w-24 max-h-24 rounded-sm bg-[#F6F4EF]' src={file} alt='' />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
