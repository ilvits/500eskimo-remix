import { type AddProduct, productSchema } from '~/common/productSchema';

import { json, redirect, type LoaderFunction, type LinksFunction } from '@remix-run/node';
import { ValidatedForm, validationError } from 'remix-validated-form';
import { withZod } from '@remix-validated-form/with-zod';
import { useLoaderData } from '@remix-run/react';
import { createProduct, getAllCategories, getAllTags } from '~/services/products.server';
import { FormInput } from '~/components/ui/custom/FormInput';
import { FormTextarea } from '~/components/ui/custom/FormTextarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/custom/Select';
import { FileInput } from '~/components/ui/custom/FileInput';
import { Switch } from '~/components/ui/switch';
import { Button } from '~/components/ui/button';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone-esm';
import { Cropper, getTransformedImageSize, retrieveSizeRestrictions } from 'react-advanced-cropper';
import type { Coordinates, CropperRef, CropperState, DefaultSettings } from 'react-advanced-cropper';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '~/components/ui/dialog';

import reactCroperCSS from 'react-advanced-cropper/dist/style.css';
import reactCroperTheme from 'react-advanced-cropper/dist/themes/corners.css';
import reactCroperAdditional from '~/styles/react-advanced-cropper.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: reactCroperCSS },
    { rel: 'stylesheet', href: reactCroperTheme },
    { rel: 'stylesheet', href: reactCroperAdditional },
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
  const [files, setFiles] = useState<string[]>([]);

  const { defaultValues, categories } = useLoaderData<typeof loader>();
  // console.log("categories: ", categories);

  const onDrop = useCallback(({ acceptedFiles, rejectedFiles }: { acceptedFiles: File[]; rejectedFiles: File[] }) => {
    console.log('acceptedFiles: ', acceptedFiles);
    console.log('rejectedFiles: ', rejectedFiles);
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        setFiles(prev => (prev.includes(reader.result as string) ? prev : [...prev, reader.result as string]));
      };
    });
  }, []);

  useEffect(() => {
    console.log('files: ', files);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    // maxFiles: 4,
    maxSize: 1_000_000,
    onDrop: onDrop as any,
    onDropRejected: () => {
      console.log('onDropRejected');
    },
  });

  const cropperRef = useRef<CropperRef>(null);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [image, setImage] = useState<string>('');
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  const [src, setSrc] = useState('');

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

  const onReset = () => {
    imgElement &&
      (imgElement?.width > imgElement?.height
        ? cropperRef.current &&
          cropperRef.current.setCoordinates({
            width: imgElement?.width,
            height: imgElement?.height,
            left: imgElement ? imgElement.width / 2 - imgElement.height / 2 : 0,
            top: 0,
          })
        : cropperRef.current &&
          cropperRef.current.setCoordinates({
            width: imgElement?.height,
            height: imgElement?.width,
            left: 0,
            top: imgElement ? imgElement.height / 2 - imgElement.width / 2 : 0,
          }));
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-8'>Add New Product</h1>
      <ValidatedForm method='POST' validator={validator} defaultValues={defaultValues}>
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
            <label htmlFor='freeShipping' className='flex items-center justify-between'>
              <p>Free Shipping</p>
              <Switch id='freeShipping' name='freeShipping' />
            </label>
            <div className='flex space-x-4'>
              <Button type='submit'>Add Product</Button>
              <Button type='button' variant='secondary' onClick={() => window.history.back()}>
                Cancel
              </Button>
            </div>
          </div>
          <div className='w-2/5'>
            <div>
              <h2 className='mb-4 font-bold'>Product Cover</h2>
              <div className='space-y-3'>
                <div className='relative bg-gray-100 rounded-2xl w-full h-full flex items-center justify-center'>
                  <Dialog>
                    {image ? (
                      <img className='relative w-full aspect-square object-cover rounded-xl' src={image} alt='' />
                    ) : (
                      <>
                        <p className='flex items-center justify-center w-full text-3xl text-[#9CA3AF] h-full aspect-square '>
                          Upload cover please
                        </p>
                      </>
                    )}
                    {image ? (
                      <DialogTrigger className='absolute bottom-2 right-2'>
                        <div className=' w-9 h-9 bg-secondary-500 p-2 rounded-lg flex items-center justify-center'>
                          <img src='/static/assets/icons/pencilWhite.svg' alt='' />
                        </div>
                      </DialogTrigger>
                    ) : (
                      <>
                        <label
                          className='w-9 h-9 bg-secondary-500 text-white p-2 rounded-lg flex items-center justify-center cursor-pointer absolute bottom-2 right-2'
                          htmlFor='cover'
                        >
                          <input
                            className='hidden'
                            type='file'
                            name='cover'
                            id='cover'
                            onChange={e => setImage(URL.createObjectURL(e.target.files?.[0] as File))}
                          />
                          +
                        </label>
                      </>
                    )}
                    <DialogContent
                      className='
                          min-w-0 w-fit max-w-[1000px] h-fit aspect-square p-0 !block gap-0 shadow-none border-input rounded-2xl bg-[#F6F4EF]
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
                        <Button variant='outline' onClick={onReset}>
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
                <section id='dropzone' className='dropzone' {...getRootProps()}>
                  <FileInput
                    type='file'
                    {...getInputProps()}
                    label={
                      isDragActive ? (
                        <p>Drop it!</p>
                      ) : (
                        <p>
                          <span className='font-semibold'>Click to upload</span> or drag and drop
                        </p>
                      )
                    }
                  />
                </section>
                <div className='grid grid-cols-3 gap-4 mt-4 w-full transition-all duration-300'>
                  {files.map(file => (
                    <div
                      key={file}
                      className='relative p-4 flex items-center justify-center rounded-md w-32 h-32 shrink-0
                       bg-secondary-50 [&>div]:hover:opacity-100 animate-fade-in-0'
                    >
                      <div
                        className='absolute right-0 top-0 cursor-pointer opacity-0'
                        onClick={() => setFiles(prev => prev.filter(f => f !== file))}
                      >
                        <img className='w-6 h-6 z-10' src='/static/assets/icons/trash.svg' alt='' />
                      </div>
                      <img className='w-20 h-20 object-cover rounded-md' src={file} alt='' />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
